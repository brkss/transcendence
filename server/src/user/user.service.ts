import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';

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
            return (undefined)
        return (userId.id)
    }
    async alreadyFriend(user_id: number, friend_id: number) {
        const connection : string = `${friend_id}|${user_id}`
        const found = await this.prismaService.friendship.findUnique({
            where: {
                status: "accepted",
                connection: connection
            },
            select: {
                friendship_id: true
            }
        })
        if (found?.friendship_id)
            return (true)
        return (false)
    }
    async addFriend(current_user: string, friend_user: string) {
    const userId = await  this.getUserId(current_user) 
    const friendId = await  this.getUserId(friend_user)
    if (!friendId){ 
        return ({error: `User ${friend_user} Does not exits`})
    }
    const isFriend = await this.alreadyFriend(userId, friendId)
    if (isFriend) {
        return ({error: `User ${friend_user} Already a Friend :)`})
    }
    try { 
        await this.prismaService.friendship.create({
            data: {
                 user_id: userId,
                 friend_id: friendId,
                 connection: `${userId}|${friendId}`
             },
        })
        return ({success: `Friend request sent to ${friend_user}`})
    }
    catch {
        return ({error: `Friend request Already sent to ${friend_user}`})
    }   
    }
    async friendRequestExists(userId: number, friendId: number) : Promise<boolean> {
        const friendship =  await this.prismaService.friendship.findMany({
            where: {user_id: friendId, friend_id: userId, status: "pending"},
            select: {status: true}
        })
        if (friendship.length) // this crap should be updated 
            return (true)
        return (false)
    }

    async acceptFriend(current_user: string, friend_username: string) {
        const userId = await  this.getUserId(current_user) 
        const friendId = await  this.getUserId(friend_username)
        if (!friendId){ 
                return ({error: `User ${friend_username} Does not exits`})
        }
        const exists: boolean = await this.friendRequestExists(userId, friendId)
        if (exists) {
            await this.prismaService.friendship.updateMany({
                where: {user_id: friendId, friend_id: userId, status: "pending"},
                data: { status: "accepted"}
            })
            return ({success: "Request accepted"})
        }
        else {
            return ({error: "Friend Requst Not Found"})
        }
    }

    async getAllFriends(username: string) {
        const userId = await this.getUserId(username)
        const friends = await this.prismaService.friendship.findMany({
            where: { status: "accepted", OR: [ {user_id: userId}, {friend_id: userId} ]},
            select: {
                friend: {
                    select: { id: true, username: true, email: true}
                },
                user: {
                    select: { id: true, username: true, email: true}
                }
            },
        })
        const user_friends = friends.map((ff) => {
            return ff.user.id == userId ? ff.friend : ff.user;
        })
        return (user_friends)
    }
}