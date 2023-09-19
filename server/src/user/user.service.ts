import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { use } from 'passport';
import { retryWhen } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {

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
            select: { auth2faOn: true }
        })
        return (isActivated.auth2faOn)
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
                    { user_id: user_id },
                    { friend_id: friend_id }
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

    async addFriend(current_user: string, friend_user: string) {
        const userId = await this.getUserId(current_user)
        const friendId = await this.getUserId(friend_user)
        if (userId == friendId) {
            return ({ error: `Failed to send request to '${friend_user}'` })
        }
        if (!friendId) {
            return ({ error: `User '${friend_user}' Does not exits` })
        }
        const isFriend = await this.alreadyFriend(userId, friendId)
        if (isFriend) {
            return ({ error: `User '${friend_user}' Already a Friend :)` })
        }
        // check if friend already sent a request to the user ! to avoid duplicated request !
		const requests = await this.prismaService.friendship.findMany({
			where: {
				status: "pending", 
				OR: [
					{ user_id: userId }, 
					{ friend_id: userId }
		 		]
			},
			select: {
				user_id: true
			}
		});
		if(requests.length > 0)
			return { error: "Request Already sent" }

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
            return ({ error: `Friend request Already sent to ${friend_user}` })
        }
    }
    async friendRequestExists(userId: number, friendId: number): Promise<boolean> {
        const friendship = await this.prismaService.friendship.findMany({
            where: { user_id: friendId, friend_id: userId, status: "pending" },
            select: { status: true }
        })
        if (friendship.length) // this crap should be updated 
            return (true)
        return (false)
    }

    async getAllRequests(username: string) {
        const userId = await this.getUserId(username)
        const requests = await this.prismaService.friendship.findMany({
            where:{ 
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
	async getUserProfile(username: string) {
		interface UserProfile extends Record<string, any> {
			username: string,
			email: string,
			fullName: string,
			online?: boolean
		}
		const profile = await this.prismaService.user.findUnique({
			where:{
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
		return ({error: `User ${username} Not found`})
		let user_profile : UserProfile = profile;
		const ms_passed = Date.parse(Date()) - Date.parse(profile.lastSeen)
		user_profile.online = (ms_passed * 6000 < 3) // offline if mins_passed  3

		return (profile) // profile is const WTF!
	}

	async updateLastLogin(username: string) {
		await this.prismaService.user.update({
			where: {
				username: username
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

	async getFriendRequests(username: string){
		const userId = await this.getUserId(username);
		const requests = await this.prismaService.friendship.findMany({
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
	}

	// this function get the relation ship between two users; 
	async getRelationship(friend_username: string, user_id: number) {
		const friend_id = await this.getUserId(friend_username);
		const relationship = await this.prismaService.friendship.findMany({
			where: { OR: [{ user_id: user_id, friend_id: friend_id }, { user_id: friend_id, friend_id: user_id}] },
			select: {
				status: true,
				friend_id: true,
				user_id: true,
			}
		});
		console.log("foudn relations : ", relationship, user_id);
		if(relationship.length === 0)
			return "none";
		else if(relationship[0].user_id === user_id)
			return "sent";
		else 
			return relationship[0].status;
	}
}
