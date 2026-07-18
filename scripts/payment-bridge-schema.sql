-- =====================================================
-- Bangla QR Hybrid Automated Payment Verification System
-- Database Schema & RPC Functions
-- =====================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PAYMENT SESSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_id UUID NOT NULL REFERENCES admissions(id) ON DELETE CASCADE,
  base_amount_minor INTEGER NOT NULL, -- e.g., 50000 for 500.00
  unique_offset_minor INTEGER NOT NULL, -- e.g., 27
  payable_amount_minor INTEGER NOT NULL, -- e.g., 50027
  currency VARCHAR(10) DEFAULT 'BDT',
  status VARCHAR(50) DEFAULT 'AWAITING_PAYMENT', -- AWAITING_PAYMENT, AUTO_VERIFYING, PENDING_MANUAL_REVIEW, PAID, EXPIRED, CANCELLED
  expires_at TIMESTAMPTZ NOT NULL,
  cooldown_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup of active amounts
CREATE INDEX IF NOT EXISTS idx_payment_sessions_payable_amount 
ON payment_sessions(payable_amount_minor) WHERE status IN ('AWAITING_PAYMENT', 'AUTO_VERIFYING');

-- =====================================================
-- 2. PAYMENT BRIDGE DEVICES
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_bridge_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_name VARCHAR(255) NOT NULL,
  pairing_token VARCHAR(100),
  device_secret_hash TEXT, -- Storing hashed secret
  is_active BOOLEAN DEFAULT TRUE,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  sync_queue_count INTEGER DEFAULT 0,
  parser_version VARCHAR(50),
  app_version VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. PAYMENT EVENTS INBOX (Raw SMS events from Android)
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_events_inbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id VARCHAR(255) UNIQUE NOT NULL, -- UUID from Android app
  device_id UUID REFERENCES payment_bridge_devices(id),
  provider VARCHAR(100) NOT NULL,
  transaction_id VARCHAR(255),
  amount_minor INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT',
  payment_timestamp TIMESTAMPTZ,
  sms_received_at TIMESTAMPTZ NOT NULL,
  sender VARCHAR(100) NOT NULL,
  parser_version VARCHAR(50),
  source_fingerprint VARCHAR(255) UNIQUE NOT NULL, -- SHA256 of normalized data
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, MATCHED, AMBIGUOUS, NO_MATCH
  matched_session_id UUID REFERENCES payment_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. MANUAL PAYMENT REVIEWS
-- =====================================================
CREATE TABLE IF NOT EXISTS manual_payment_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES payment_sessions(id) ON DELETE CASCADE,
  user_id UUID, -- If applicable
  submitted_trx_id VARCHAR(255) NOT NULL,
  screenshot_path TEXT,
  expected_amount_minor INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, AUTO_RESOLVED
  telegram_message_id VARCHAR(255),
  telegram_chat_id VARCHAR(255),
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. PAYMENT AUDIT LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES payment_sessions(id),
  event_type VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL, -- SYSTEM, ADMIN, ANDROID_APP
  actor_id VARCHAR(255),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. RPC: ALLOCATE UNIQUE PAYMENT AMOUNT
-- =====================================================
-- Finds an unused unique_offset_minor (1-99) for the given base_amount_minor.
-- We ensure no other active session has the same payable_amount_minor.
CREATE OR REPLACE FUNCTION allocate_unique_payment_amount(
    p_admission_id UUID,
    p_base_amount_minor INTEGER,
    p_expires_in_minutes INTEGER
) RETURNS TABLE (
    success BOOLEAN,
    session_id UUID,
    payable_amount_minor INTEGER,
    message TEXT
) LANGUAGE plpgsql AS $$
DECLARE
    v_offset INTEGER;
    v_payable INTEGER;
    v_session_id UUID;
    v_found BOOLEAN := FALSE;
BEGIN
    -- We need to lock the table to prevent concurrent allocations assigning the same offset
    LOCK TABLE payment_sessions IN SHARE ROW EXCLUSIVE MODE;

    -- Look for an available offset from 1 to 99
    FOR v_offset IN 1..99 LOOP
        v_payable := p_base_amount_minor + v_offset;
        
        -- Check if this payable amount is currently active or in cooldown
        IF NOT EXISTS (
            SELECT 1 FROM payment_sessions 
            WHERE payment_sessions.payable_amount_minor = v_payable 
            AND (status IN ('AWAITING_PAYMENT', 'AUTO_VERIFYING', 'PENDING_MANUAL_REVIEW') OR cooldown_until > NOW())
        ) THEN
            v_found := TRUE;
            EXIT;
        END IF;
    END LOOP;

    IF NOT v_found THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::INTEGER, 'Unique amount pool exhausted. Please try again later.'::TEXT;
        RETURN;
    END IF;

    -- Insert new session
    INSERT INTO payment_sessions (
        admission_id, base_amount_minor, unique_offset_minor, payable_amount_minor, status, expires_at
    ) VALUES (
        p_admission_id, p_base_amount_minor, v_offset, v_payable, 'AWAITING_PAYMENT', NOW() + (p_expires_in_minutes || ' minutes')::INTERVAL
    ) RETURNING id INTO v_session_id;
    
    -- Insert audit log
    INSERT INTO payment_audit_logs (session_id, event_type, source, actor_id, metadata)
    VALUES (v_session_id, 'AMOUNT_RESERVED', 'SYSTEM', p_admission_id::TEXT, jsonb_build_object('payable_amount', v_payable));

    RETURN QUERY SELECT TRUE, v_session_id, v_payable, 'Success'::TEXT;
END;
$$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_bridge_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_payment_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_audit_logs ENABLE ROW LEVEL SECURITY;

-- Session Policy
CREATE POLICY "Users can view their own payment sessions via admission"
ON payment_sessions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admissions a 
    WHERE a.id = payment_sessions.admission_id 
    AND (a.user_id = auth.uid() OR auth.uid() IS NOT NULL)
  )
);

-- Public insert allowed for checkout creation (or restricted to auth users if needed)
CREATE POLICY "Allow authenticated users to create sessions" 
ON payment_sessions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Manual Reviews Policy
CREATE POLICY "Users can view their own reviews"
ON manual_payment_reviews FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert reviews for their sessions"
ON manual_payment_reviews FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin Full Access
CREATE POLICY "Allow admin full access" ON payment_sessions FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON payment_bridge_devices FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON payment_events_inbox FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON manual_payment_reviews FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON payment_audit_logs FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- AUTO-UPDATE updated_at TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_sessions_updated_at
  BEFORE UPDATE ON payment_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_bridge_devices_updated_at
  BEFORE UPDATE ON payment_bridge_devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manual_payment_reviews_updated_at
  BEFORE UPDATE ON manual_payment_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
