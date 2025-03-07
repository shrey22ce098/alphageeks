-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "isVerified" SET DEFAULT true;

-- AlterTable
ALTER TABLE "DoctorSpecialization" ADD COLUMN     "consultationFees" TEXT;

-- CreateTable
CREATE TABLE "DateSchedule" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "scheduleDate" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "appointmentDuration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DateTimeSlot" (
    "id" TEXT NOT NULL,
    "dateScheduleId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateTimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorSchedule" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "appointmentDuration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "timeSlotId" TEXT,
    "dateTimeSlotId" TEXT,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DateSchedule_doctorId_scheduleDate_key" ON "DateSchedule"("doctorId", "scheduleDate");

-- CreateIndex
CREATE UNIQUE INDEX "DateTimeSlot_dateScheduleId_startTime_endTime_key" ON "DateTimeSlot"("dateScheduleId", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorSchedule_doctorId_dayOfWeek_key" ON "DoctorSchedule"("doctorId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_scheduleId_startTime_endTime_key" ON "TimeSlot"("scheduleId", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_timeSlotId_key" ON "Appointment"("timeSlotId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_dateTimeSlotId_key" ON "Appointment"("dateTimeSlotId");

-- AddForeignKey
ALTER TABLE "DateSchedule" ADD CONSTRAINT "DateSchedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateTimeSlot" ADD CONSTRAINT "DateTimeSlot_dateScheduleId_fkey" FOREIGN KEY ("dateScheduleId") REFERENCES "DateSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "DoctorSchedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "DoctorSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_dateTimeSlotId_fkey" FOREIGN KEY ("dateTimeSlotId") REFERENCES "DateTimeSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
