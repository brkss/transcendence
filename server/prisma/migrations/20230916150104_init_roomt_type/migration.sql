-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "roomType" "RoomType" NOT NULL DEFAULT 'PUBLIC';
