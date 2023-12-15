-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_recepient_id_fkey";

-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "blocker" INTEGER NOT NULL,
    "blockee" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_id_key" ON "Block"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockee_blocker_key" ON "Block"("blockee", "blocker");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
