-- DropForeignKey
ALTER TABLE "RoomBan" DROP CONSTRAINT "RoomBan_roomID_fkey";

-- DropForeignKey
ALTER TABLE "RoomMembers" DROP CONSTRAINT "RoomMembers_roomId_fkey";

-- AddForeignKey
ALTER TABLE "RoomMembers" ADD CONSTRAINT "RoomMembers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomBan" ADD CONSTRAINT "RoomBan_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
