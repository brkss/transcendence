-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "auth2faOn" BOOLEAN DEFAULT false,
    "auth2faSercret" TEXT,
    "lastSeen" TEXT NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "password" TEXT,
    "roomType" "RoomType" NOT NULL DEFAULT 'PUBLIC',

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "blocker" INTEGER NOT NULL,
    "blockee" INTEGER NOT NULL
);

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

-- CreateTable
CREATE TABLE "RoomMembers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "inChat" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntile" BIGINT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RoomMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "friendship_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending'
);

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
    "startedAt" DATE NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_playingGame" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_id_key" ON "ChatRoom"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_name_key" ON "ChatRoom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Block_id_key" ON "Block"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockee_blocker_key" ON "Block"("blockee", "blocker");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_id_key" ON "Messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserChats_id_key" ON "UserChats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserChats_user_id_recepient_id_key" ON "UserChats"("user_id", "recepient_id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomBan_id_key" ON "RoomBan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomBan_user_id_room_id_key" ON "RoomBan"("user_id", "room_id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomMembers_id_key" ON "RoomMembers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomMembers_userId_roomId_key" ON "RoomMembers"("userId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_friendship_id_key" ON "Friendship"("friendship_id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user_id_friend_id_key" ON "Friendship"("user_id", "friend_id");

-- CreateIndex
CREATE UNIQUE INDEX "Score_id_key" ON "Score"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_playingGame_AB_unique" ON "_playingGame"("A", "B");

-- CreateIndex
CREATE INDEX "_playingGame_B_index" ON "_playingGame"("B");

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_owner_fkey" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatRom_id_fkey" FOREIGN KEY ("chatRom_id") REFERENCES "ChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChats" ADD CONSTRAINT "UserChats_recepient_id_fkey" FOREIGN KEY ("recepient_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomBan" ADD CONSTRAINT "RoomBan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomBan" ADD CONSTRAINT "RoomBan_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMembers" ADD CONSTRAINT "RoomMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMembers" ADD CONSTRAINT "RoomMembers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_playingGame" ADD CONSTRAINT "_playingGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_playingGame" ADD CONSTRAINT "_playingGame_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
