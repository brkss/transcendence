import { UserService } from "./user.service";
import {Controller, Get, Param, Req, UseGuards, Post, Body} from "@nestjs/common"
import { JwtAuth } from "src/auth/guards/jwtauth.guard";
import { Request } from 'express'
import { addFriendDTO } from "./user.dto";

@Controller('user')
@UseGuards(JwtAuth)
export class UserController {
    constructor(private userService: UserService){

    }
   
	@Post("/search")
	async searchPeople(@Req() req: Request){
		const {query }= req.body;
		if(!query)
			return [];
		const results = this.userService.searchFriends(query);
		return results;
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
		if(!username)
			return { error: "Invalid username"} 
        const current_username: string = req.user.username;
        return (await this.userService.acceptFriend(current_username, username))
    }
    @Post('friends/reject')
    async rejectFriend(@Req() req: any) {
		const { username } = req.body;
		if(!username)
			return { error: "Invalid username"} 
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

	@Get("friends/relationship/:username")
	async getRelationship(@Req() req: any, @Param("username") username: string) {
		const relationship = await this.userService.getRelationship(username, req.user.userID);
		console.log("rel response : ", req.user);
		return ({relationship: relationship});
	}
}
