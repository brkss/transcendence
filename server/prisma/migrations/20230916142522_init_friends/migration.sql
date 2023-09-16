/*
  Warnings:

  - You are about to drop the column `connection` on the `Friendship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,friend_id]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Friendship_connection_key";

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "connection";

-- AlterTable
ALTER TABLE "RoomMembers" ADD COLUMN     "userBanned" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user_id_friend_id_key" ON "Friendship"("user_id", "friend_id");
