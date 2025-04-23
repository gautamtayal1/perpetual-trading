/*
  Warnings:

  - The primary key for the `Position` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId]` on the table `Position` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Position" DROP CONSTRAINT "Position_pkey",
ADD CONSTRAINT "Position_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_userId_key" ON "Position"("userId");
