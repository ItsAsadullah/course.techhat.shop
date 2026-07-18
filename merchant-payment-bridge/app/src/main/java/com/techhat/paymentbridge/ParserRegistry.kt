package com.techhat.paymentbridge

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

data class ParsedEvent(
    val provider: String,
    val transactionId: String,
    val amountMinor: Int,
    val currency: String,
    val paymentTimestamp: String?,
    val smsReceivedAt: String,
    val sender: String,
    val parserVersion: String
)

object ParserRegistry {
    private val SUPPORTED_SENDERS = listOf("bKash", "Nagad", "Rocket")

    fun isSupportedSender(sender: String): Boolean {
        // Handle variations or shortcodes if necessary
        return SUPPORTED_SENDERS.any { sender.contains(it, ignoreCase = true) }
    }

    fun parse(sender: String, message: String, timestampMillis: Long): ParsedEvent? {
        val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US).apply {
            timeZone = TimeZone.getTimeZone("Asia/Dhaka")
        }
        val receivedAt = isoFormat.format(Date(timestampMillis))

        if (sender.contains("bKash", ignoreCase = true)) {
            return parseBkash(message, receivedAt, sender)
        }
        // Add Nagad, Rocket, etc.
        return null
    }

    private fun parseBkash(message: String, receivedAt: String, sender: String): ParsedEvent? {
        // Example: Payment Tk 500.27 to 01712345678 successful. TrxID 8G7A6B5C4D at 11/07/2026 13:42
        // Note: Real bKash SMS formats vary. This is a configurable placeholder.
        val amountRegex = Regex("""Tk\s*(\d+(\.\d+)?)""", RegexOption.IGNORE_CASE)
        val trxRegex = Regex("""TrxID\s*([A-Z0-9]+)""", RegexOption.IGNORE_CASE)

        val amountMatch = amountRegex.find(message)
        val trxMatch = trxRegex.find(message)

        if (amountMatch != null && trxMatch != null) {
            val amountStr = amountMatch.groupValues[1]
            val trxId = trxMatch.groupValues[1]
            val amountMinor = Math.round(amountStr.toDouble() * 100).toInt()

            return ParsedEvent(
                provider = "bKash",
                transactionId = trxId,
                amountMinor = amountMinor,
                currency = "BDT",
                paymentTimestamp = null, // Can be parsed from SMS
                smsReceivedAt = receivedAt,
                sender = sender,
                parserVersion = "1.0.0"
            )
        }
        return null
    }
}
