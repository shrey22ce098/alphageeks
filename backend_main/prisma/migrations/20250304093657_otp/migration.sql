-- AlterTable
ALTER TABLE "DateSchedule" ALTER COLUMN "appointmentDuration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Usera" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiry" TIMESTAMP(3);
