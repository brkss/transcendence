/*
  Warnings:

  - You are about to drop the column `userBanned` on the `RoomMembers` table. All the data in the column will be lost.
  - Added the required column `sender_id` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "sender_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RoomMembers" DROP COLUMN "userBanned";

-- CreateTable
CREATE TABLE "UserChats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recepient_id" INTEGER NOT NULL,

    CONSTRAINT "UserChats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomBan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,

    CONSTRAINT "RoomBan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserChats_id_key" ON "UserChats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserChats_user_id_recepient_id_key" ON "UserChats"("user_id", "recepient_id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomBan_id_key" ON "RoomBan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomBan_user_id_room_id_key" ON "RoomBan"("user_id", "room_id");

-- AddForeignKey
ALTER TABLE "UserChats" ADD CONSTRAINT "UserChats_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomBan" ADD CONSTRAINT "RoomBan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomBan" ADD CONSTRAINT "RoomBan_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
