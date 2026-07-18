package com.techhat.paymentbridge

import android.content.Context
import androidx.room.*

@Entity(tableName = "payment_events")
data class PaymentEventEntity(
    @PrimaryKey val eventId: String,
    val provider: String,
    val transactionId: String,
    val amountMinor: Int,
    val currency: String,
    val paymentTimestamp: String?,
    val smsReceivedAt: String,
    val sender: String,
    val parserVersion: String,
    val sourceFingerprint: String,
    val syncStatus: String // PENDING, SYNCING, SYNCED, FAILED_PERMANENT
)

@Dao
interface PaymentEventDao {
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insert(event: PaymentEventEntity): Long

    @Query("SELECT * FROM payment_events WHERE sourceFingerprint = :fingerprint LIMIT 1")
    suspend fun getByFingerprint(fingerprint: String): PaymentEventEntity?

    @Query("SELECT * FROM payment_events WHERE syncStatus = 'PENDING'")
    suspend fun getPendingEvents(): List<PaymentEventEntity>

    @Query("UPDATE payment_events SET syncStatus = :status WHERE eventId = :eventId")
    suspend fun updateStatus(eventId: String, status: String)
}

@Database(entities = [PaymentEventEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun paymentEventDao(): PaymentEventDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "payment_bridge_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
