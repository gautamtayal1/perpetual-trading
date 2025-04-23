/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Depth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Depth_id_key" ON "Depth"("id");
