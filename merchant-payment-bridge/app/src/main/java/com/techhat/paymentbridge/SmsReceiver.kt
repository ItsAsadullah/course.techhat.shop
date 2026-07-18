package com.techhat.paymentbridge

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.SmsMessage
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.security.MessageDigest
import java.util.UUID

class SmsReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != "android.provider.Telephony.SMS_RECEIVED") return

        val bundle = intent.extras ?: return
        val pdus = bundle.get("pdus") as? Array<*> ?: return
        
        val format = bundle.getString("format")
        val messages = pdus.mapNotNull { pdu ->
            pdu?.let { SmsMessage.createFromPdu(it as ByteArray, format) }
        }

        if (messages.isEmpty()) return

        // Combine multi-part messages
        val sender = messages[0].originatingAddress ?: return
        val fullBody = messages.joinToString("") { it.messageBody }
        val timestamp = messages[0].timestampMillis

        // 1. Validate Sender (e.g. bKash, Nagad)
        if (!ParserRegistry.isSupportedSender(sender)) return

        // 2. Parse SMS
        val parsedEvent = ParserRegistry.parse(sender, fullBody, timestamp) ?: return

        // 3. Generate Fingerprint
        val rawInput = "${parsedEvent.sender}|${parsedEvent.transactionId}|${parsedEvent.amountMinor}|${parsedEvent.smsReceivedAt}"
        val fingerprint = MessageDigest.getInstance("SHA-256")
            .digest(rawInput.toByteArray())
            .joinToString("") { "%02x".format(it) }

        val eventEntity = PaymentEventEntity(
            eventId = UUID.randomUUID().toString(),
            provider = parsedEvent.provider,
            transactionId = parsedEvent.transactionId,
            amountMinor = parsedEvent.amountMinor,
            currency = parsedEvent.currency,
            paymentTimestamp = parsedEvent.paymentTimestamp,
            smsReceivedAt = parsedEvent.smsReceivedAt,
            sender = parsedEvent.sender,
            parserVersion = parsedEvent.parserVersion,
            sourceFingerprint = fingerprint,
            syncStatus = "PENDING"
        )

        // 4. Save to Room and Queue Sync
        CoroutineScope(Dispatchers.IO).launch {
            val db = AppDatabase.getDatabase(context)
            // Check for duplicate fingerprint locally first
            val existing = db.paymentEventDao().getByFingerprint(fingerprint)
            if (existing == null) {
                db.paymentEventDao().insert(eventEntity)
                
                // Queue Sync Work
                val syncWorkRequest = OneTimeWorkRequestBuilder<SyncWorker>().build()
                WorkManager.getInstance(context).enqueue(syncWorkRequest)
            }
        }
    }
}
