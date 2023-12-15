/*
  Warnings:

  - You are about to drop the `RoomBan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomBan" DROP CONSTRAINT "RoomBan_roomID_fkey";

-- DropForeignKey
ALTER TABLE "RoomBan" DROP CONSTRAINT "RoomBan_userID_fkey";

-- DropForeignKey
ALTER TABLE "RoomMembers" DROP CONSTRAINT "RoomMembers_userId_fkey";

-- AlterTable
ALTER TABLE "RoomMembers" ADD COLUMN     "mutedUntile" BIGINT;

-- DropTable
DROP TABLE "RoomBan";

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "recepient_id" INTEGER,
    "chatRom_id" INTEGER,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Messages_id_key" ON "Messages"("id");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatRom_id_fkey" FOREIGN KEY ("chatRom_id") REFERENCES "ChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMembers" ADD CONSTRAINT "RoomMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
