/*
  Warnings:

  - You are about to drop the column `sender_id` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `sender_username` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "sender_id",
ADD COLUMN     "sender_username" TEXT NOT NULL;
