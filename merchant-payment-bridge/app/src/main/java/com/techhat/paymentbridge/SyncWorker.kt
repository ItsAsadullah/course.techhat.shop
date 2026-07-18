package com.techhat.paymentbridge

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.security.MessageDigest
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

class SyncWorker(appContext: Context, workerParams: WorkerParameters) :
    CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val db = AppDatabase.getDatabase(applicationContext)
        val pendingEvents = db.paymentEventDao().getPendingEvents()

        if (pendingEvents.isEmpty()) return Result.success()

        // In a real app, retrieve these securely from EncryptedSharedPreferences
        val deviceId = "paired_device_id" 
        val deviceSecret = "paired_device_secret"
        val apiBaseUrl = "https://your-nextjs-app.vercel.app/api/payment-bridge"

        val client = OkHttpClient()

        var allSuccess = true

        for (event in pendingEvents) {
            try {
                val jsonPayload = JSONObject().apply {
                    put("eventId", event.eventId)
                    put("provider", event.provider)
                    put("transactionId", event.transactionId)
                    put("amountMinor", event.amountMinor)
                    put("currency", event.currency)
                    put("smsReceivedAt", event.smsReceivedAt)
                    put("sender", event.sender)
                    put("parserVersion", event.parserVersion)
                    put("sourceFingerprint", event.sourceFingerprint)
                }.toString()

                val timestamp = (System.currentTimeMillis() / 1000).toString()
                val nonce = java.util.UUID.randomUUID().toString()

                // HMAC-SHA256
                val mac = Mac.getInstance("HmacSHA256")
                mac.init(SecretKeySpec(deviceSecret.toByteArray(), "HmacSHA256"))
                val signatureRaw = mac.doFinal((timestamp + nonce + jsonPayload).toByteArray())
                val signature = signatureRaw.joinToString("") { "%02x".format(it) }

                val request = Request.Builder()
                    .url("$apiBaseUrl/events")
                    .post(jsonPayload.toRequestBody("application/json".toMediaType()))
                    .addHeader("x-device-id", deviceId)
                    .addHeader("x-device-timestamp", timestamp)
                    .addHeader("x-device-nonce", nonce)
                    .addHeader("x-device-signature", signature)
                    .build()

                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    db.paymentEventDao().updateStatus(event.eventId, "SYNCED")
                } else if (response.code in 400..499) {
                    // Permanent error (e.g., auth failure, validation)
                    db.paymentEventDao().updateStatus(event.eventId, "FAILED_PERMANENT")
                } else {
                    allSuccess = false
                }
            } catch (e: Exception) {
                allSuccess = false
            }
        }

        return if (allSuccess) Result.success() else Result.retry()
    }
}
