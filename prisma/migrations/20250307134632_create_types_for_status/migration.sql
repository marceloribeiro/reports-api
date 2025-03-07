/*
  Warnings:

  - The `status` column on the `report_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReportRequestStatus" AS ENUM ('PENDING', 'CANCELED', 'PROCESSING', 'PROCESSED', 'ERROR');

-- AlterTable
ALTER TABLE "report_requests" DROP COLUMN "status",
ADD COLUMN     "status" "ReportRequestStatus" NOT NULL DEFAULT 'PENDING';
