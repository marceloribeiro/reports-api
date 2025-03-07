-- AlterTable
ALTER TABLE "report_requests" ADD COLUMN     "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
