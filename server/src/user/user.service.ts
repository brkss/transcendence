import * as fs from 'node:fs';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { updateNameDTO } from 'src/chat/dtos/chat.dto';
import { RoomService } from 'src/chat/room/room.service';
import { GameService } from 'src/game/game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateMIMEType } from "validate-image-type";
import path = require("path") // exported form  path (re checkit!!)
import { UserHistory } from './history.interface'
// ES module error: ?
//import { fileTypeFromFile } from 'file-type';
//import imageType from "image-type"

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService,
		    private roomService: RoomService, private gameService: GameService) {

		    }
		    private make_error(error: string) {
			    const response = {
				    success: false,
				    error: error,
			    }
			    return (response)
		    }

		    findUserUnique(query: any) {
			    try {
				    const user_exits = this.prismaService.user.findUnique(query)
				    return user_exits;
			    }
			    catch {
				    return undefined;
			    }
		    }

		    async createUser(user: any): Promise<any> {
			    const query = {
				    where: {
					    login: user.login
				    },
			    }
			    const userExists = await this.findUserUnique(query)
			    if (!userExists) {
				    const db_user = await this.prismaService.user.create({
					    data: {
						    email: user.email,
						    fullName: user.usual_full_name,
						    login: user.login,
						    username: user.login,
						    lastSeen: Date(),
						    /*
						     * need to download and save image locally !
						     */
						    avatar: user.image
					    },
				    })
				    return (db_user)
			    }
			    return (userExists)
		    }
		    async block(blocker_id: number, blockee_id: number) {
			    try {
				    const id = await this.prismaService.block.create({
					    data: {
						    blocker: blocker_id,
						    blockee: blockee_id
					    },
					    select: {
						    id: true
					    }
				    })
				    return (id)
			    } catch (error) {
				    // entry exists 
				    return undefined
			    }
		    }

		    async unblock(blocker_id: number, blockee_id: number) {
			    try {
				    const id = await this.prismaService.block.delete({
					    where: {
						    blockee_blocker: {
							    blocker: blocker_id,
							    blockee: blockee_id
						    }
					    },
					    select: {
						    id: true
					    }
				    })
				    return (id)
			    } catch (error) {
				    // entry does not exists exists 
				    return undefined
			    }
		    }

		    async updateField(data: any): Promise<any> {
			    const user = await this.prismaService.user.update(data)
			    return user
		    }
		    async updateUserName(user_id: number, names: updateNameDTO) {
			    const user_names = await this.prismaService.user.update({
				    where: {
					    id: user_id
				    },
				    data: {
					    fullName: names.fullname,
					    username: names.username
				    },
				    select: {
					    username: true,
					    fullName: true
				    }
			    })
			    return (user_names)
		    }

		    async get2faSecret(user_id: number) {
			    const auth2fa_secret = await this.prismaService.user.findUnique({
				    where: { id: user_id },
				    select: { auth2faSercret: true }
			    })
			    return (auth2fa_secret?.auth2faSercret)
		    }

		    async is2faActivated(user_id: number) {
			    const isActivated = await this.prismaService.user.findUnique({
				    where: { id: user_id },
				    select: { auth2faOn: true }
			    })
			    console.log("is activated: ", isActivated)
			    return (isActivated.auth2faOn)
		    }
		    async get2fasettings(user_id: number): Promise<any> {
			    const settings = await this.prismaService.user.findUnique({
				    where: {
					    id: user_id
				    },
				    select: {
					    auth2faOn: true,
					    auth2faSercret: true
				    }
			    })
			    return (settings)
		    }

		    async getUserId(username: string) {
			    const userId = await this.prismaService.user.findUnique({
				    where: { username: username },
				    select: { id: true }
			    })
			    if (!userId)
				    return (undefined)
			    return (userId.id)
		    }
		    async alreadyFriend(user_id: number, friend_id: number) {
			    const found = await this.prismaService.friendship.findMany({
				    where: {
					    status: "accepted",
					    OR: [
						    { user_id: user_id, friend_id: friend_id },
						    { friend_id: user_id, user_id: friend_id }
					    ]
				    },
				    select: {
					    friendship_id: true
				    }
			    })
			    console.log(found)
			    if (found.length)
				    return (true)
			    return (false)
		    }

		    async addFriend(userId: number, friend_user: string) {
			    //const userId = await this.getUserId(current_user)
			    const friendId = await this.getUserId(friend_user)
			    if (!friendId) {
				    return (this.make_error(`User '${friend_user}' Does not exits`))
			    }
			    if (userId == friendId) {
				    return (this.make_error(`Failed to send request to '${friend_user}'`))
			    }
			    const isFriend = await this.alreadyFriend(userId, friendId)
			    if (isFriend) {
				    return (this.make_error(`User '${friend_user}' Already a Friend :)`))
			    }
			    // check if friend already sent a request to the user ! to avoid duplicated request !
			    const requests = await this.prismaService.friendship.findMany({
				    where: {
					    status: "pending",
					    OR: [
						    { user_id: userId, friend_id: friendId },
						    { user_id: friendId, friend_id: userId },
					    ]
				    },
				    select: {
					    user_id: true
				    }
			    });
			    if (requests.length > 0)
				    return (this.make_error("Request Already sent"))

			    try {
				    await this.prismaService.friendship.create({
					    data: {
						    user_id: userId,
						    friend_id: friendId,
					    } as any,
				    })
				    return ({ success: `Friend request sent to ${friend_user}` })
			    }
			    catch {
				    return (this.make_error(`Friend request Already sent to ${friend_user}`))
			    }
		    }
		    async friendRequestExists(userId: number, friendId: number): Promise<boolean> {
			    const friendship = await this.prismaService.friendship.findUnique({
				    where: {
					    user_id_friend_id: {
						    user_id: friendId, friend_id: userId
					    }
				, status: "pending"
				    },
				    select: { status: true }
			    })
			    console.log(friendship)
			    if (friendship)
				    return (true)
			    return (false)
		    }

		    async getAllRequests(username: string) {
			    const userId = await this.getUserId(username)
			    const requests = await this.prismaService.friendship.findMany({
				    where: {
					    friend_id: userId,
					    status: "pending"
				    },
				    select: {
					    user: {
						    select: {
							    username: true,
							    email: true,
							    fullName: true,
							    avatar: true
						    }
					    }
				    }
			    })
			    return (requests.map((req) => req.user));
		    }

		    async acceptFriend(current_user: string, friend_username: string) {
			    const userId = await this.getUserId(current_user)
			    const friendId = await this.getUserId(friend_username)
			    if (!friendId) {
				    return ({ error: `User ${friend_username} Does not exits` })
			    }
			    const exists: boolean = await this.friendRequestExists(userId, friendId)
			    if (exists) {
				    await this.prismaService.friendship.updateMany({
					    where: { user_id: friendId, friend_id: userId, status: "pending" },
					    data: { status: "accepted" }
				    })
				    return ({ success: "Request accepted" })
			    }
			    else {
				    return ({ error: "Friend Requst Not Found" })
			    }
		    }
		    async regectFriend(current_user: string, friend_username: string) {
			    const userId = await this.getUserId(current_user)
			    const friendId = await this.getUserId(friend_username)
			    if (!friendId) {
				    return ({ error: `User ${friend_username} Does not exits` })
			    }
			    const exists: boolean = await this.friendRequestExists(userId, friendId)
			    if (exists) {
				    await this.prismaService.friendship.delete({
					    where: {
						    status: "pending",
						    user_id_friend_id: {
							    user_id: friendId, friend_id: userId
						    }
					    }
				    })
				    return ({ success: "Request Rejected" })
			    }
			    else {
				    return ({ error: "Friend Requst Not Found" })
			    }
		    }



		    async getAllFriends(username: string) {
			    const userId = await this.getUserId(username)
			    const friends = await this.prismaService.friendship.findMany({
				    where: { status: "accepted", OR: [{ user_id: userId }, { friend_id: userId }] },
				    select: {
					    friend: {
						    select: { id: true, username: true, email: true, avatar: true }
					    },
					    user: {
						    select: { id: true, username: true, email: true, avatar: true }
					    }
				    },
			    })
			    const user_friends = friends.map((ff) => {
				    return ff.user.id == userId ? ff.friend : ff.user;
			    })
			    return (user_friends)
		    }
		    async updateUserAvatar(user_id : number, avatar: string) {
			    const avatar_link = await this.prismaService.user.update({
				    where: {
					    id: user_id
				    },
				    data: {
					    avatar: avatar
				    }
			    })
		    }
		    async getUserProfile(username: string) {
			    interface UserProfile extends Record<string, any> {
				    username: string,
				    email: string,
				    fullName: string,
				    online?: boolean
			    }
			    const profile = await this.prismaService.user.findUnique({
				    where: {
					    username: username
				    },
				    select: {
					    username: true,
					    email: true,
					    fullName: true,
					    lastSeen: true,
					    avatar: true
				    }
			    })
			    //const lastSeen: bigint = BigInt(Date.now()) - profile.lastSeen
			    if (profile == null)
				    return (this.make_error(`User ${username} Not found`))

			    let user_profile: UserProfile = profile;
			    const ms_passed = Date.parse(Date()) - Date.parse(profile.lastSeen)
			    user_profile.online = (ms_passed * 6000 < 3) // offline if mins_passed  3

			    return (profile) // profile is const WTF!
		    }



		    async updateLastLogin(user_id: number) {
			    await this.prismaService.user.update({
				    where: {
					    id: user_id
				    },
				    data: {
					    lastSeen: Date()
				    }
			    })
		    }

		    // get user by its id 
		    async getUserByID(userID: number) {
			    const user = await this.prismaService.user.findUnique({
				    where: { id: userID }
			    })
			    return user;
		    }

		    async searchFriends(query: string) {
			    const users = await this.prismaService.user.findMany({
				    where: {
					    OR: [
						    {
							    username: {
								    contains: query,
								    mode: 'insensitive', // Case-insensitive search
							    },
						    },
						    {
							    fullName: {
								    contains: query,
								    mode: 'insensitive',
							    },
						    },
						    {
							    email: {
								    contains: query,
								    mode: 'insensitive',
							    },
						    },
					    ],
				    },
			    });

			    return users;
		    }

		    // TODO: emit this data over a socket connection on every request !!!
		    // async getFriendRequests(username: string){
		    // 	const userId = await this.getUserId(username);
		    // 	const requests = await this.prismaService.friendship.findMany({
		    // 		where: { status: "accepted", OR: [ {user_id: userId}, {friend_id: userId} ]},
		    // 		select: {
		    // 			friend: {
		    // 				select: { id: true, username: true, email: true}
		    // 			},
		    // 			user: {
		    // 				select: { id: true, username: true, email: true}
		    // 			}
		    // 		},
		    // 	})
		    // }


		    // this function get the relation ship between two users; 
		    async getRelationship(friend_username: string, user_id: number) {
			    const friend_id = await this.getUserId(friend_username);
			    const relationship = await this.prismaService.friendship.findMany({
				    where: { OR: [{ user_id: user_id, friend_id: friend_id }, { user_id: friend_id, friend_id: user_id }] },
				    select: {
					    status: true,
					    friend_id: true,
					    user_id: true,
				    }
			    });
			    console.log("found relations : ", relationship, user_id);
			    if (relationship.length === 0)
				    return "none";
			    else if (relationship[0].user_id === user_id && relationship[0].status !== "accepted")
				    return "sent";
			    else
				    return relationship[0].status;
		    }

		    /*
		       gets all rooms of a user 
		       */
		    async getAllRooms(userId: number) {
			    const all_rooms = await this.roomService.getRoomsOfUser(userId)
			    return (all_rooms);
		    }
		    /*
		       gets users that chated with  
		       */
		    async getUserChats(user_id: number) {
			    const all_chats = await this.roomService.getAllUserChats(user_id)
			    return all_chats
		    }
		    async getChatHistory(user_id: number, end_user_id: number) {
			    const chat_history = await this.roomService.fetch_chat_messages(user_id, end_user_id);
			    return (chat_history);
		    }
		    async isBlocked(user_id: number, blockee_id: number) {
			    try {
				    await this.prismaService.block.findUniqueOrThrow({
					    where: {
						    blockee_blocker : {
							    blocker: user_id,
							    blockee: blockee_id
						    }
					    }
				    })
				    return (true)
			    } catch(error) {
				    console.log(error)
				    return (false)
			    }
		    }
		    async blockUser(user_id: number, blockee_id: number) {
			    if (user_id === blockee_id)
				    throw new ForbiddenException()
			    const user = await this.getUserByID(blockee_id);
			    if (user?.id != blockee_id) {
				    throw new ForbiddenException()
			    }
			    const id = await this.block(user_id, blockee_id)
			    if (id === undefined) {
				    throw new ForbiddenException()
			    }
			    const resp = {
				    status: "success",
				    message: "User has been blocked!"
			    }
			    return (resp);
		    }
		    async unblockUser(user_id: number, blockee_id: number) {
			    const user = await this.getUserByID(blockee_id);
			    if (user?.id != blockee_id) {
				    throw new ForbiddenException()
			    }
			    try {
				    await this.prismaService.block.findUniqueOrThrow({
					    where: {
						    blockee_blocker: {
							    blocker: user_id,
							    blockee: blockee_id
						    }
					    },
					    select: {
						    blocker: true
					    }
				    })
			    }
			    catch (error) {
				    console.log(error)
				    throw new ForbiddenException()
			    }
			    const block_id = await this.unblock(user_id, blockee_id)
			    if (block_id === undefined) {
				    throw new NotFoundException()
			    }
			    const resp = {
				    status: "success",
				    message: "User has been unblocked!"
			    }
			    return (resp);
		    }

		    async getOldAavarName(user_id: number): Promise<string | null>  {
			    const avatar_url = (await this.getUserByID(user_id)).avatar
			    const uri = avatar_url.split("/")
			    let old_file_path = null
			    console.log(uri)
			    if (uri.at(0) == "http:") { // self hosted
				    old_file_path = path.join(process.cwd(), "/uploads/images/", uri.at(-1))
			    }
			    console.log("old_path " , old_file_path)
			    return (old_file_path)
		    }

		    async updateAvatar(user_id: number, file: Express.Multer.File) {
			    const avatar_link : string = "http://localhost:8000/user/avatar/" + file.filename
			    const is_valid_image = await this.validateImageType(file)

			    if (is_valid_image == false){
				    console.log("invalid image")
				    fs.unlink(file.path, (err) => { /* skip/ignore */ });
				    throw new BadRequestException("Invalid Image")
			    }
			    const old_file_name = await this.getOldAavarName(user_id)
			    if (old_file_name){
				    fs.unlink(old_file_name, (err) => { /* skip/ignore */ });
			    }
			    await this.updateUserAvatar(user_id, avatar_link)
			    const resp = {
				    status: "success",
				    message: "User avatar updated!"
			    }
			    return (resp)
		    }
		    async validateImageType(file: Express.Multer.File): Promise<boolean> {
			    const file_type = await validateMIMEType(file.path, {
				    allowMimeTypes: ["image/jpeg", "image/png"]
			    })
			    if (!file_type.ok){
				    console.log(file_type.error)
				    return (false)
			    }
			    return (true)
		    }

		    async getUserLosesWins(userId: number)
		    {
			    let loses : number = 0;
			    let wins: number = 0;
			    let userScore : number;
			    let opponentScore : number;

			    const all_games = await this.prismaService.user.findMany({
				    where: {
					    id: userId,
				    },
				    select:
					    {
					    games: {
						    include:
							    {
							    scores: true,
						    },
					    },
				    },
			    });

			    all_games.forEach(async (game, index) => {
				    const gameId : number = game[index].id;
				    const scores = await this.gameService.getAllScores(gameId);
				    scores.forEach((score, i) =>
						   {
							   if (score[i].player_id == userId)
								   userScore = score.score;
							   else
								   opponentScore = score.score;
							   if (userScore > opponentScore)
								   wins++;
							   else
								   loses++;
						   });
			    });
			    return [wins, loses];
		    }

		    async getUserHistory(user_id: number)
		    {
			    try{
				    const user = await this.prismaService.user.findUnique({ where: {id : user_id,},});
				    if (!user)
					    throw new NotFoundException('User with ID ${user_id} not found!');

				    let history: UserHistory[] = [];


			    }
			    catch(error)
			    {
				    console.error(error);
			    }

		    }

}
