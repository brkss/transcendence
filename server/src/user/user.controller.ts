import { UserService } from "./user.service";
import {Controller, Get, Param, Req, UseGuards, Post} from "@nestjs/common"
import { JwtAuth } from "src/auth/guards/jwtauth.guard";
import { Request } from 'express'

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
    async addFriend(@Req() req: any) {
		const { username } = req.body;
		if(!username)
			return { error: "Invalid username" }
        const current_username: string = req.user.username;
        const status = await this.userService.addFriend(current_username, username)
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

	@Get("friends/requests")
	async getFriendRequests(@Req() req: any){
		const username : string = req.user.username;
		return (await this.userService.getFriendRequests(username));
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

}
