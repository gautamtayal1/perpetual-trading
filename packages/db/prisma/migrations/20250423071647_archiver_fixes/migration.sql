/*
  Warnings:

  - You are about to drop the column `currentPrice` on the `Depth` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Depth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TradeSide" ADD VALUE 'null';

-- AlterTable
ALTER TABLE "Depth" DROP COLUMN "currentPrice",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DEFAULT 10000;
