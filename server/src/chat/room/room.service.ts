import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IS_BTC_ADDRESS } from "class-validator";
import { channel } from "diagnostics_channel";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomService {
    constructor(private prismaService: PrismaService) {
    }
    // should have a unique entry 
    async addMemberTORoom(user_id: number, room_id: number, is_admin: boolean) {
        await this.prismaService.roomMembers.create({
            data: {
                userId: user_id,
                roomId: room_id,
                isAdmin: is_admin
            },
        })
    }
    async createChatRoom(user: any, roominfo: any) {
        const userIsAdmin = true
        try {
            const newRoom = await this.prismaService.chatRoom.create({
                data: {
                    name: roominfo.roomName,
                    owner: user.id
                }
            })
            console.log(newRoom)
            // add user in rooms members
            await this.addMemberTORoom(user.id, newRoom.id, userIsAdmin)
            return (newRoom)

        } catch (error) {
            console.log(error)
            return (undefined)
        }
    }
    async getRoomByName(roomName: string): Promise<number> {
        try {
            const room = await this.prismaService.chatRoom.findUniqueOrThrow({
                where: {
                    name: roomName
                },
                select: {
                    id: true
                }
            })
            return room.id;
        }
        catch (error) {
            //console.log(error)
            return undefined
        }

    }
    private async getRoomUsers(roomId: number) {
        const roomMembers = await this.prismaService.roomMembers.findMany({
            where: {
                roomId: roomId
            },
            select: {
                user: {
                    select: {
                        username:true
                    }
                }
            }
        })
        return (roomMembers)
    }
    async UserRoomExists(user: any, room_name: string) {
        const roomId = await this.getRoomByName(room_name)
        if(roomId === undefined){ 
            return ({Error: `Room ${room_name} Not found!`})
        }
        try {
            await this.addMemberTORoom(user.id, roomId, false)
        } catch {
            return ({Error: `${user.username} Already joined!`})
        }
        return(undefined)
    }
    async joinUserToRoom(user: any, room_name: string) {
        const roomId = await this.getRoomByName(room_name)
        const roomMembers = await this.getRoomUsers(roomId)
        const payload = {
            room_name: room_name,
            room_users: roomMembers
        }
        return (payload)
    }

    async removeUserFromRoom(userId: number, room_name: string) {
        const roomUser = await this.prismaService.roomMembers.deleteMany({
            where: {
                userId: userId,
                room: { 
                    name: room_name
                }
            }
        })
        return (roomUser)
    }
    async deleteMemberFromRooms(userId: number) {
        await this.prismaService.roomMembers.deleteMany({
            where:{
                userId: userId
            },
        })
    }
    async getUserJoinedRooms(userId: number) {
        const joinedRooms = await this.prismaService.user.findUnique({
            where: {
                id: userId
            },
            select: {
                memberRooms: {
                    select: {
                        room: { select: { name: true } }
                    }
                }
            }
        })
        return (joinedRooms.memberRooms)
    }
    // async getUserRooms(userID: number) {
    //     const rooms = await this.prismaService.user.findUnique({
    //         where: {
    //             id: userID
    //         },
    //         select: {
    //             memberRooms: {
    //                 select: {
    //                     room: true
    //                 }
    //             }
    //         }
    //     })
    //     return (rooms)
    // }
    // private async roomExists(room_name: string) {
    //     const room = await this.prismaService.chatRoom.findUnique({
    //         where: {
    //             name: room_name
    //         }
    //     })
    //     if (room) {
    //         return (true)
    //     }
    //     return (false)
    // }

    // private async removeUserFromChatRoom(user: any, room_name: string) {
    //     const users = await this.prismaService.chatRoom.update({
    //         where: {
    //             name: room_name
    //         },
    //         data: { users: {
    //                 disconnect: { id: user.id }
    //             }
    //         },
    //         select: {
    //             users: {
    //                 select: { username: true }
    //             }
    //         }

    //     })
    //     return (users)
    // }
 

}