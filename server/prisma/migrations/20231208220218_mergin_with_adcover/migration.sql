/*
  Warnings:

  - You are about to drop the `game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "game";

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "firstPlayer_id" INTEGER NOT NULL,
    "secondPlayer_id" INTEGER NOT NULL,
    "startedAt" DATE NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_id_key" ON "Score"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
