-- CreateTable
CREATE TABLE "drill_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "drillId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "modId" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "errors" INTEGER NOT NULL DEFAULT 0,
    "timeSpent" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drill_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "drill_records_userId_idx" ON "drill_records"("userId");

-- CreateIndex
CREATE INDEX "drill_records_userId_drillId_idx" ON "drill_records"("userId", "drillId");

-- AddForeignKey
ALTER TABLE "drill_records" ADD CONSTRAINT "drill_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
