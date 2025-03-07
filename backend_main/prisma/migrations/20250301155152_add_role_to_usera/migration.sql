-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'doctor', 'admine');

-- AlterTable
ALTER TABLE "Usera" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
