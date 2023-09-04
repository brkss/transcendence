import { Injectable } from '@nestjs/common';
import { first } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { blob } from 'stream/consumers';

@Injectable()
export class UserService {
    constructor( private prismaService: PrismaService) {

    }

    findUserUnique(query: any) {
        try {
            const user_exits =  this.prismaService.user.findUnique(query)
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
           } 
        }
        const  userExists = await this.findUserUnique(query)
        if (!userExists) {
            const db_user = await this.prismaService.user.create({
            data: {
                email: user.email,
                fullName: user.usual_full_name,
                login: user.login,
                username: user.login
            },
            })
            return (userExists)
        }
        return (user)
    }

    async updateField(data: any) {
        const user = await this.prismaService.user.update(data)
    }
    async get2faSecret(user_login: string) {
        const auth2fa_secret = await this.prismaService.user.findUnique({
            where: { login: user_login },
            select: { auth2faSercret: true }
        })
        return (auth2fa_secret.auth2faSercret)
    }
    async is2faActivated(user_login: string) {

        const isActivated = await this.prismaService.user.findUnique({
            where: { login: user_login },
            select: { auth2faOn : true }
        })
        return (isActivated.auth2faOn)
    }
    async getUserId(username: string) {
        const userId = await this.prismaService.user.findUnique({
            where: { username: username },
            select: {id: true} 
        })
        if (!userId)
            throw("Undefined user in db")
        return (userId.id)
    }
    async addFriend(current_user: string, friend_user: string) {
        try { 
            const userId = await  this.getUserId(current_user) 
            const friendId = await  this.getUserId(friend_user)
            const friedship_id = await this.prismaService.friendship.create({
                data: {
                     user_id: userId,
                     friend_id: friendId
                 },
            })
            console.log(friedship_id)
            return (friedship_id)
        }
        catch (error) {
            return (error)
        }   
    }
    async friendRequestExists(userId: number, friendId: number) : Promise<boolean> {
        const friendship =  await this.prismaService.friendship.findMany({
            where: {user_id: userId, friend_id: friendId, status: "pending"},
            select: {status: true}
        })
        if (friendship.length) // this crap should be updated 
            return (true)
        return (false)
    }
    async acceptFriend(current_user: string, friend_username: string) {
        const userId = await  this.getUserId(current_user) 
        const friendId = await  this.getUserId(friend_username)
        const exists: boolean = await this.friendRequestExists(userId, friendId)
        if (exists) {
            await this.prismaService.friendship.updateMany({
                where: {user_id: userId, friend_id: friendId, status: "pending"},
                data: { status: "accepted"}
            })
            return "request accepted"
        }
        else {
            return "No Request available"
        }
    }
    async getAllFriends(username: string) {
        const userId = await this.getUserId(username)
        const friends = await this.prismaService.friendship.findMany({
            where: {
                status: "accepted",
                OR: [
                    {user_id: userId},
                    {friend_id: userId}
                ],
            },
            include: {
                user: true,
                friend: true
            }
        }
        )
        return (friends)
    }
}