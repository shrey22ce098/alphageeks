/*
  Warnings:

  - A unique constraint covering the columns `[useraId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `useraId` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "useraId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_useraId_key" ON "Doctor"("useraId");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_useraId_fkey" FOREIGN KEY ("useraId") REFERENCES "Usera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
