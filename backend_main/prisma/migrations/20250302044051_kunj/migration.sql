/*
  Warnings:

  - You are about to drop the column `consultationFees` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `Doctor` table. All the data in the column will be lost.
  - The primary key for the `Specialization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Specialization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AvailableSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medicine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreferredDoctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prescription` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profileImage` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_slotId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "AvailableSlot" DROP CONSTRAINT "AvailableSlot_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalHistory" DROP CONSTRAINT "MedicalHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Medicine" DROP CONSTRAINT "Medicine_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "PreferredDoctor" DROP CONSTRAINT "PreferredDoctor_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "PreferredDoctor" DROP CONSTRAINT "PreferredDoctor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_doctorId_fkey";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "consultationFees",
DROP COLUMN "experience",
DROP COLUMN "name",
DROP COLUMN "specialization",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "maplink" TEXT,
ADD COLUMN     "profileImage" TEXT NOT NULL,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "Specialization" DROP CONSTRAINT "Specialization_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName";

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "AvailableSlot";

-- DropTable
DROP TABLE "Feedback";

-- DropTable
DROP TABLE "MedicalHistory";

-- DropTable
DROP TABLE "Medicine";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "PreferredDoctor";

-- DropTable
DROP TABLE "Prescription";

-- CreateTable
CREATE TABLE "DoctorSpecialization" (
    "id" SERIAL NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specializationId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DoctorSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorLanguage" (
    "id" SERIAL NOT NULL,
    "doctorId" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,
    "fluency" TEXT,

    CONSTRAINT "DoctorLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "doctorId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DoctorSpecialization_doctorId_idx" ON "DoctorSpecialization"("doctorId");

-- CreateIndex
CREATE INDEX "DoctorSpecialization_specializationId_idx" ON "DoctorSpecialization"("specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorSpecialization_doctorId_specializationId_key" ON "DoctorSpecialization"("doctorId", "specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE INDEX "DoctorLanguage_doctorId_idx" ON "DoctorLanguage"("doctorId");

-- CreateIndex
CREATE INDEX "DoctorLanguage_languageId_idx" ON "DoctorLanguage"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorLanguage_doctorId_languageId_key" ON "DoctorLanguage"("doctorId", "languageId");

-- CreateIndex
CREATE INDEX "Education_doctorId_idx" ON "Education"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE INDEX "City_name_idx" ON "City"("name");

-- CreateIndex
CREATE INDEX "Doctor_city_idx" ON "Doctor"("city");

-- CreateIndex
CREATE INDEX "Doctor_isActive_isVerified_idx" ON "Doctor"("isActive", "isVerified");

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorLanguage" ADD CONSTRAINT "DoctorLanguage_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorLanguage" ADD CONSTRAINT "DoctorLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
