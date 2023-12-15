/*
  Warnings:

  - You are about to drop the column `sender_username` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "sender_username";
