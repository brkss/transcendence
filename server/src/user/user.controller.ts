import { UserService } from "./user.service";
import { Controller, Get, Param, Req, UseGuards, Post, Body, ParseIntPipe,  UseInterceptors, UploadedFile, Res, NotFoundException } from "@nestjs/common"
import { JwtAuth } from "src/auth/guards/jwtauth.guard";
import { Request } from 'express'
import { addFriendDTO, blockUserDTO, unblockUserDTO } from "./user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { uid } from 'uid'
import path = require("path") // exported form  path (re checkit!!)

const upload_config = {
    storage: diskStorage({
        destination: path.join(process.cwd(), "/uploads/images/"),
        filename: (req, file, callback) => {
            const parsed_file = path.parse(file.originalname)
            const file_name = parsed_file.name + uid(12) + parsed_file.ext
            console.log("file name: >> ", file_name);
            // validate extention type before callback !!1
            callback(null, file_name)
        }
    }),
}
@Controller('user')
@UseGuards(JwtAuth)
export class UserController {
    constructor(private userService: UserService) {

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

    @Get("friends/relationship/:username")
    async getRelationship(@Req() req: any, @Param("username") username: string) {
        const relationship = await this.userService.getRelationship(username, req.user.userID);
        console.log("rel response : ", req.user);
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

    // @Get("/avatar/:filename")
    // async getUserAvatar(@Param('filename') filename: string, @Res() res){
    //     console.log(filename)
    //     const file: path.ParsedPath = path.parse(filename)
    //     const secure_name = file.name + file.ext
    //     const abs_path = process.cwd() + "/uploads/images/" + secure_name
    //     const stream  = createReadStream(abs_path)
    //     stream.on('error', (error)=> {
    //         console.log(error)
    //         stream.close()
    //     })
    //     //stream.pipe(res);
    // }

    @Post("/upload")
    @UseInterceptors(FileInterceptor('file', upload_config))
    async uploadAvatar(@UploadedFile() file: any, @Req() req: any) {
        console.log(file)
        console.log(process.cwd())
        const user_id : number = req.user.id
        const avatar_link : string = "http://localhost:8000/user/avatar/" + file.filename;
        await this.userService.updateUserAvatar(user_id, avatar_link); 
        return
    }
}
