import { BadRequestException, Injectable } from '@nestjs/common';
import { RoomService } from 'src/chat/room/room.service';
import { PrismaService } from 'src/prisma/prisma.service';

import  {createRoomDTO,
        JoinRoomDTO,
        LeaveRoomDTO,
        chatMessageDTO,
        updateRoomDTO,
        kickDTO,
        setAdminDTO,
        RoomDTO,
        MuteUserDTO,
        PrivateMessageDTO} from "src/chat/dtos/chat.dto"

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService,
				private roomService: RoomService) {

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

	async updateField(data: any): Promise<any> {
		const user = await this.prismaService.user.update(data)
		return user
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
	async get2fasettings(user_id: number) : Promise<any> { 
		const settings  = await this.prismaService.user.findUnique({
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
			return (this.make_error(`Failed to send request to '${friend_user}'` ))
        }
        const isFriend = await this.alreadyFriend(userId, friendId)
        if (isFriend) {
            return (this.make_error(`User '${friend_user}' Already a Friend :)` ))
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
				, status: "pending" },
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
	async regectFriend(current_user: string, friend_username: string) {
		const userId = await  this.getUserId(current_user) 
		const friendId = await  this.getUserId(friend_username)
		if (!friendId){ 
			return ({error: `User ${friend_username} Does not exits`})
		}
		const exists: boolean = await this.friendRequestExists(userId, friendId)
		if (exists) {
			await this.prismaService.friendship.delete({
				where : {
					status: "pending",
					user_id_friend_id: {
						user_id: friendId, friend_id: userId
					}
				}
			})
			return ({success: "Request Rejected"})
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
					select: { id: true, username: true, email: true, avatar: true}
				},
				user: {
					select: { id: true, username: true, email: true, avatar: true}
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
			return (this.make_error(`User ${username} Not found`))

		let user_profile : UserProfile = profile;
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
			where: { OR: [{ user_id: user_id, friend_id: friend_id }, { user_id: friend_id, friend_id: user_id}] },
			select: {
				status: true,
				friend_id: true,
				user_id: true,
			}
		});
		console.log("found relations : ", relationship, user_id);
		if(relationship.length === 0)
			return "none";
		else if(relationship[0].user_id === user_id && relationship[0].status !== "accepted")
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


}
