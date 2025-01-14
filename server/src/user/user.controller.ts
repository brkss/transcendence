import { Request } from 'express'
import { upload_config } from 'src/utils/upload_config'; // config for mutter module
import { UserService } from "./user.service";
import { JwtAuth } from "src/auth/guards/jwtauth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { updateNameDTO } from "src/chat/dtos/chat.dto";
import { addFriendDTO, blockUserDTO, unblockUserDTO } from "./user.dto";
import {
	Controller, Get, Param
	, Req, UseGuards, Post
	, Body, ParseIntPipe
	, UseInterceptors, UploadedFile
} from "@nestjs/common"
import { UserHistory, UsersRanks } from 'src/user/history.interface';
import { GameService } from 'src/game/game.service';

@Controller('user')
@UseGuards(JwtAuth)
export class UserController {
	constructor(private userService: UserService, private gameService: GameService) {

	}

	@Post("/search")
	async searchPeople(@Req() req: Request) {
		const { query } = req.body;
		if (!query)
			return [];
		const results = this.userService.searchFriends(query);
		return results;
	}

	@Post("block")
	async blockUser(@Req() req: any, @Body() body: blockUserDTO) {
		const user_id = req.user.userID
		const blockee_id = body.user_id
		return (await this.userService.blockUser(user_id, blockee_id))
	}

	@Post("unblock")
	async unblockUser(@Req() req, @Body() body: unblockUserDTO) {
		const user_id = req.user.userID
		const blockee_id = body.user_id
		return (await this.userService.unblockUser(user_id, blockee_id))
	}

	@Get("blocked")
	async blocked(@Req() req){
		const user_id = req.user.userID;
		return ( await this.userService.getBlockedFriends(user_id) );
	}

	@Post('friends/add')
	async addFriend(@Req() req, @Body() body: addFriendDTO) {
		const user_id: number = req.user.userID
		const status = await this.userService.addFriend(user_id, req.body.username)
		return status
	}

	@Post('friends/accept')
	async acceptFriend(@Req() req: any) {
		const { username } = req.body;
		if (!username)
			return { error: "Invalid username" }
		const current_username: string = req.user.username;
		return (await this.userService.acceptFriend(current_username, username))
	}
	@Post('friends/reject')
	async rejectFriend(@Req() req: any) {
		const { username } = req.body;
		if (!username)
			return { error: "Invalid username" }
		const current_username: string = req.user.username;
		return (await this.userService.regectFriend(current_username, username))
	}

	@Get('friends/requests')
	async getAllRequests(@Req() req: any) {
		const current_username: string = req.user.username
		return (await this.userService.getAllRequests(current_username))
	}

	@Get('friends/all')
	async getAllFriends(@Req() req: any) {
		const current_username: string = req.user.username;
		return (await this.userService.getAllFriends(current_username))
	}

	@Get('profile/:username')
	async getUserprofile(@Param("username") username: string) {
		const profile = await this.userService.getUserProfile(username);
		return (profile)
	}

	@Get('userInfo/:uid')
	async getUserInfo(@Param("uid") uid: string) {
		const user = await this.userService.getUserByID(parseInt(uid));
		return (user);
	}

	@Get("friends/relationship/:username")
	async getRelationship(@Req() req: any, @Param("username") username: string) {
		const relationship = await this.userService.getRelationship(username, req.user.userID);
		return ({ relationship: relationship });
	}

	@Get("rooms")
	async getAllUserRooms(@Req() request: any) {
		const user = request.user
		const user_rooms = await this.userService.getAllRooms(user.id)
		return (user_rooms)
	}
	@Get("chats")
	async getUserChats(@Req() request: any) {
		const user = request.user
		const user_chats = await this.userService.getUserChats(user.id)
		return (user_chats)
	}
	@Get("/:user_id/chathistory")
	async getChatHistory(@Req() request: any, @Param('user_id', ParseIntPipe) end_user_id: number) {
		const user = request.user
		const history = await this.userService.getChatHistory(user.id, end_user_id);
		return (history)
	}

	@Post("/upload")
	@UseInterceptors(FileInterceptor('file', upload_config))
	async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
		const user = req.user
		return (await this.userService.updateAvatar(user.id, file))
	}

	@Post("/updatename")
	async updateUsername(@Req() request: any, @Body() body: updateNameDTO) {
		const user = request.user
		await this.userService.updateUserName(user.id, body)
		const resp = {
			status: "success",
			message: "successfully updated"
		}
		return (resp)
	}

	@Get("status/:username")
	async getUserStatus(@Req() request: any, @Param("username") username: string) {
		const userID = await this.userService.getUserId(username);
		if(userID === undefined)
			return [0, 0];
		let total_games = await this.userService.getNumberOfGames(userID);
		if (total_games == 0)
			return [0, 0];
		//console.log("number of games: " , total_games);
		const [wins, loses] = await this.userService.getUserLosesWins(userID);
		const [status_wins, status_loses] = [(wins / total_games) * 100, (loses / total_games) * 100];
		return [status_wins, status_loses];
	}

	@Get("history/:username")
	async getPlayerHistory(@Req() request: any, @Param("username") username: string) {
		const userID = await this.userService.getUserId(username);
		if (userID == undefined)
			return null;
		const history = this.userService.getUserHistory(userID);
		return (history);

	}
	@Get("leaderboard")
	async getLeaderBoard() {
		const ranks: UsersRanks[] = await this.userService.getRanks();
		return (ranks);
	}

	@Get("achievements/:username")
	async getAchievements(@Req() request: any, @Param("username") username: string)
	{
		const userID = await this.userService.getUserId(username);
		if (userID == undefined)
			return null;
		return await this.userService.getUserBadges(userID);
	}


}
