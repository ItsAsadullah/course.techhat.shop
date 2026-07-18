-- Migration for Manual Payment System
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS payment_number VARCHAR(50);
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS trx_id VARCHAR(100);

-- Increase status length to allow 'pending_payment'
ALTER TABLE admissions ALTER COLUMN status TYPE VARCHAR(50);
