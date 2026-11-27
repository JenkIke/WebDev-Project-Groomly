/*
  Warnings:

  - You are about to drop the column `groomerId` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId,name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_groomerId_fkey";

-- DropIndex
DROP INDEX "Appointment_groomerId_startTime_idx";

-- DropIndex
DROP INDEX "Service_name_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "groomerId",
ADD COLUMN     "ownerId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "ownerId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Dog" ADD COLUMN     "ownerId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "ownerId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_ownerId_startTime_idx" ON "Appointment"("ownerId", "startTime");

-- CreateIndex
CREATE INDEX "Client_ownerId_idx" ON "Client"("ownerId");

-- CreateIndex
CREATE INDEX "Dog_ownerId_idx" ON "Dog"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_ownerId_name_key" ON "Service"("ownerId", "name");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
