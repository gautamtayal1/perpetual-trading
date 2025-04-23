/*
  Warnings:

  - The values [null] on the enum `TradeSide` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TradeSide_new" AS ENUM ('LONG', 'SHORT', 'UNINITIALIZED');
ALTER TABLE "Order" ALTER COLUMN "side" TYPE "TradeSide_new" USING ("side"::text::"TradeSide_new");
ALTER TABLE "Position" ALTER COLUMN "side" TYPE "TradeSide_new" USING ("side"::text::"TradeSide_new");
ALTER TABLE "Trade" ALTER COLUMN "side" TYPE "TradeSide_new" USING ("side"::text::"TradeSide_new");
ALTER TYPE "TradeSide" RENAME TO "TradeSide_old";
ALTER TYPE "TradeSide_new" RENAME TO "TradeSide";
DROP TYPE "TradeSide_old";
COMMIT;
