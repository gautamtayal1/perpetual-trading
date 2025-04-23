/*
  Warnings:

  - You are about to drop the column `market` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `unrealizedPnl` on the `Position` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Position" DROP COLUMN "market",
DROP COLUMN "unrealizedPnl";
