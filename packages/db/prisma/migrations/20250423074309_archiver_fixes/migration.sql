/*
  Warnings:

  - You are about to drop the column `otherUserId` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "otherUserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
