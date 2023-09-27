import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomService {
    constructor(private prismaService: PrismaService) {
    }
    // should have a unique entry 
    async addMemberTORoom(user_id: number, room_id: number, is_admin: boolean) {
        const data = {
            userId: user_id,
            roomId: room_id,
            isAdmin: is_admin
        }
        await this.prismaService.roomMembers.create({
            data: {
                userId: user_id,
                roomId: room_id,
                isAdmin: is_admin
            },
        })
    }
    async createChatRoom(user: any, roominfo: any) {
        try {
            const newRoom = await this.prismaService.chatRoom.create({
                data: {
                    name: roominfo.roomName,
                    roomType: roominfo.roomType,
                    password: roominfo.password, //TODO: hash it first
                    owner: user.id
                },
                select: {
                    id: true,
                    name: true,
                    roomType: true,
                    created_at: true
                }
            })
            //add owner as admin member 
            const userIsAdmin: boolean = true
            await this.addMemberTORoom(user.id, newRoom.id, userIsAdmin)
            return (newRoom)

        } catch (error) {
            //console.log(error)
            return (undefined)
        }
    }
    /*
        Throw if room record does not exits
    */
    async deleteRoom(roomName: string) {
        try {
            const room = await this.prismaService.chatRoom.delete({
                where: {
                    name: roomName
                }
            })
            return (room)
        } catch (error) {
            console.log(error)
        }
    }
    async getRoomByName(roomName: string): Promise<any> {
        try {
            const room = await this.prismaService.chatRoom.findUniqueOrThrow({
                where: {
                    name: roomName
                },
            })
            return room;
        }
        catch (error) {
            //console.log(error)
            return undefined
        }

    }
    async updateRoom(roomId: number, data: any) {
        // data should be sanitzed from other fields
        // really ? yes 
        const updatedRoom = await this.prismaService.chatRoom.update({
            where: {
                id: roomId
            },
            data: data
        })
        return (updatedRoom)
    }
    private async getRoomUsers(roomId: number) {
        const roomMembers = await this.prismaService.roomMembers.findMany({
            where: {
                roomId: roomId
            },
            select: {
                isAdmin: true,
                user: { 
                    select: { 
                        id: true,
                        username: true,
                        avatar: true,
                    }
                }
            }
        })
        return (roomMembers)
    }
    // async UserRoomExists(user: any, room_name: string) {
    //     const room = await this.getRoomByName(room_name)
    //     if (room === undefined) {
    //         return ({ Error: `Room ${room_name} Not found!` })
    //     }
    //     try {
    //         await this.addMemberTORoom(user.id, room.id, false)
    //     } catch (error) {
    //         //console.log(error)
    //         return ({ Error: `${user.username} Already joined!` })
    //     }
    //     return (undefined)
    // }
    async getRoomMembers(room: any) {
        const roomMembers = await this.getRoomUsers(room.id)
        const payload = {
            room_name: room.name,
            room_users: roomMembers
        }
        return (payload)
    }

    async removeUserFromRoom(userId: number, roomId: number) {
        const roomUser = await this.prismaService.roomMembers.delete({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: roomId,
                }
            }
        })
        return (roomUser)
    }
    async banUserFromRoom(userId: number, roomId: number) {
        // may throw on duplicate entries 
        const user = await this.prismaService.roomBan.create({
            data: {
                userID: userId,
                roomID: roomId
            }
        })
    }

    async deleteMemberFromRooms(userId: number) {
        await this.prismaService.roomMembers.deleteMany({
            where: {
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
    async selectUserRoom(userId: number, roomName: string) {
        const room = await this.getRoomByName(roomName)
        if (room === undefined) {
            return (false)
        }
        const userRoom = await this.prismaService.roomMembers.findMany({
            where: {
                userId: userId,
                roomId: room.id,
                userBanned: false
            },
            select: {
                room: { select: { name: true } }
            }
        })
        if (roomName === userRoom[0]?.room.name) {
            return (true)
        }
        return (false)
    }
    async getRoomsOfUser(userId: number) {
        const all_rooms = await this.prismaService.roomMembers.findMany({
            where: {
                userId: userId
            },
            select: {
                room: { select: { name: true } }
            }
        })
        return (all_rooms)

    }
    async IsRoomAdmin(userId: number, roomId: number) {
        const isadmin = await this.prismaService.roomMembers.findUnique({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: roomId
                }
            },
            select: {
                isAdmin: true
            }
        })
        return (isadmin?.isAdmin)
    }
    async addRoomAdmin(userId: number, roomId: number) {
        await this.prismaService.roomMembers.update({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: roomId
                }
            },
            data: {
                isAdmin: true
            }
        })
    }
    async isBannedFromRoom(userId: number, roomId: number){ 
        const ban_id = await this.prismaService.roomBan.findUnique({
            where: {
                userID_roomID:{
                    roomID: roomId,
                    userID: userId
                },
            },
            select: {
                id: true
            }
        })
        console.log(ban_id)
        return (ban_id != null ? true: false)
    }
}
