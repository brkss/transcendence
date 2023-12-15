-- AlterTable
ALTER TABLE "RoomMembers" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "userScore" INTEGER NOT NULL,
    "oppenentScore" INTEGER NOT NULL,
    "startedAt" DATE NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_id_key" ON "game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "game_opponentId_key" ON "game"("opponentId");
