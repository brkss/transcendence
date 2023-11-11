import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { constrainedMemory } from "process";
import { PrismaService } from "src/prisma/prisma.service";
import { AdministrateDTO, BanDTO, JoinRoomDTO, MuteUserDTO, RoomDTO, createRoomDTO, kickDTO, setAdminDTO, updateRoomDTO } from "../dtos/chat.dto";

@Injectable()
export class RoomService {
    constructor(private prismaService: PrismaService) {
    }

    private verifyAccess(room: any, payload: JoinRoomDTO): boolean {
        // cant join a private room
        // allowed users are selected on creation
        if (room.roomType === "PRIVATE")
            return (false)
        if (room.roomType == "PROTECTED") {
            if (room.password != payload.password) {
                throw new UnauthorizedException("Invalid Password")
            }
        }
        //either password correct or room is public
        return (true)
    }
    /*
        Checks if User has admin access
        before administrating chanel
        no need to check if user is a room member !!
    */
    private async canAdminstrate(payload: AdministrateDTO): Promise<boolean> {
        const userId = payload.userId
        const roomId = payload.roomId
        const memberId = payload.memberId
        const user_is_admin = await this.IsRoomAdmin(userId, roomId)
        if (!user_is_admin) {
            return (false)
        }
        const member_is_admin = await this.IsRoomAdmin(memberId, roomId)
        if (!member_is_admin) {
            return (true)
        } else {
            return (false)
        }
    }

    async IsUserMuted(userId: number, roomId: number): Promise<boolean> {
        const mute_entry = await this.getMuteEntry(userId, roomId)
        if (mute_entry) { // an entry exists on table
            const mute_time = mute_entry.mutedUntile
            if (mute_time > Date.now())
                return (true)
            await this.UnmuteUser(userId, roomId)
            console.log(mute_entry)
            return (false)
        }
        return (false)
    }

    // should have a unique entry 
    async addMemberTORoom(user_id: number, room_id: number, is_admin: boolean) {
        const data = {
            userId: user_id,
            roomId: room_id,
            isAdmin: is_admin
        }
        try {
            const roomId = await this.prismaService.roomMembers.create({
                data: {
                    userId: user_id,
                    roomId: room_id,
                    isAdmin: is_admin
                },
            })
            return (true)

        } catch (error) {
            //console.log(error)
            return null
        }
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
    async deleteRoom(room_id: number) {
        try {
            const room = await this.prismaService.chatRoom.delete({
                where: {
                    id: room_id
                }
            })
            return (room)
        } catch (error) {
            console.log(error)
            return (null)
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
    async getRoomById(room_id: number): Promise<any> {
        try {
            const room = await this.prismaService.chatRoom.findUniqueOrThrow({
                where: {
                    id: room_id
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
            data: data,
            select: {
                id: true,
                name: true,
                roomType: true,
                created_at: true
            }
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

    async getRoomMembers(room: any) {
        const roomMembers = await this.getRoomUsers(room.id)
        const payload = {
            room_name: room.name,
            room_users: roomMembers
        }
        return (payload)
    }

    async removeUserFromRoom(userId: number, roomId: number) {
        try {
            await this.prismaService.roomMembers.delete({
                where: {
                    userId_roomId: {
                        userId: userId,
                        roomId: roomId,
                    }
                }
            })
            return (true)
        } catch (error) {
            return false
        }
    }
    async banUserFromRoom(userId: number, roomId: number) {
        // may throw on duplicate entries 
        const user = await this.prismaService.roomMembers.update({
            where: {
                userBanned: false,
                userId_roomId: {
                    userId: userId,
                    roomId: roomId
                }
            },
            data: {
                userBanned: true
            },
            select: {
                userId: true
            }
        })
        if (user == null)
            return (false)
        return (true)
    }
    async UnbanUserFromRoom(userId: number, roomId: number) {
        // may throw on duplicate entries 
        const user = await this.prismaService.roomMembers.update({
            where: {
                userBanned: true,
                userId_roomId: {
                    userId: userId,
                    roomId: roomId
                }
            },
            data: {
                userBanned: false
            },
            select: {
                userId: true
            }
        })
        return (user == null ? false : true)
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
        return (joinedRooms?.memberRooms)
    }
    async selectUserRoom(userId: number, room_id: number) {
        const room = await this.getRoomById(room_id)
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
                room: { select: { id: true } }
            }
        })
        if (room_id === userRoom[0]?.room.id) {
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
                room: { select: { id: true, name: true, roomType: true } }
            }
        })
        return (all_rooms.map((room) => (room.room)))

    }
    async getAllUserChats(userId: number) {
        const all_chats = await this.prismaService.userChats.findMany({
            where: {
                user_id: userId
            },
            select: {
                dest: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                }
            }
        })
        return (all_chats)
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
        const user = await this.prismaService.roomMembers.update({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: roomId
                }
            },
            data: {
                isAdmin: true
            },
            select: {
                userId: true
            }
        })
        return (user == null ? false : true)
    }
    async isBannedFromRoom(userId: number, roomId: number) {
        const ban_id = await this.prismaService.roomMembers.findUnique({
            where: {
                userBanned: true,
                userId_roomId: {
                    roomId: roomId,
                    userId: userId
                },
            },
            select: {
                id: true
            }
        })
        console.log(ban_id)
        return (ban_id != null ? true : false)
    }
    async getAllBannedUsers(roomId: number) {
        const banned_users = await this.prismaService.roomMembers.findMany({
            where: {
                roomId: roomId,
                userBanned: true
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        })
        const res_payload = {
            BannedUsers: {
                banned_users
            }
        }
        return (res_payload)
    }

    async muteUserFor(userId: number, roomId: number, muteDuration: number) {
        const mute_duration = Date.now() + muteDuration
        const entry = await this.prismaService.roomMembers.update({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: roomId
                }
            },
            data: {
                mutedUntile: mute_duration
            }
        })
        return (entry == null ? false : true)
    }
    async UnmuteUser(userId: number, roomId: number) {
        const entry = await this.prismaService.roomMembers.update({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: roomId,
                }
            },
            data: {
                mutedUntile: null
            }
        })
        return (entry)
    }

    async getMuteEntry(userId: number, roomId: number): Promise<any> {
        const entry = await this.prismaService.roomMembers.findUnique({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: roomId
                }
            }
        });
        return (entry)
    }
    // assosiate user message with room 
    //async saveMessageInDB(userId:number , roomId: number, message: string) { 
    async saveMessageInDB(data: any) {
        const messageId = await this.prismaService.messages.create({
            data: {
                sender_id: data.userId,
                sender_username: data.sender_username,
                chatRom_id: data.roomId,
                recepient_id: data.recepient_id,
                message: data.message
            },
            select: {
                id: true
            }
        })
        return (messageId)
    }
    /*
        Intended to work on first time chat
        Not the best Practice ask (web-devs)
    */
    async saveUserInChats(userId: number, recepient_id: number) {
        try {
            // log should appear in both ends
            // create two entries for better fetching 
            await this.prismaService.userChats.createMany({
                data: [
                    { user_id: userId, recepient_id: recepient_id },
                    { user_id: recepient_id, recepient_id: userId }
                ]
            })
        } catch (error) {
            // not first time?. ignore it
        }
    }
    async fetch_room_messages(roomId: number) {
        const chat_messages = await this.prismaService.messages.findMany({
            where: {
                chatRom_id: roomId
            },
            select: {
                sender_username: true,
                message: true,
                created_at: true
            }
        })
        return (chat_messages)
    }
    /*
    */
    async CreateNewChatRoom(user: any, payload: createRoomDTO) {
        const duplicate_name = await this.getRoomByName(payload.roomName)
        if (duplicate_name) {
            throw new BadRequestException('Room With Same Name Already exits')
        }
        const newRoom = await this.createChatRoom(user, payload);
        return (newRoom)
    }

    /*
    */
    async UpdateChatRoom(user: any, payload: updateRoomDTO) {
        const room = await this.getRoomById(payload.room_id)
        if (room === undefined) {
            throw new BadRequestException("Chat Room Not Found!")
        }
        /* 
        only room owner can update it
        */
        if (room.owner != user.id) {
            throw new UnauthorizedException()
        }
        const data = {
            roomType: payload.roomType,
            password: (payload.roomType === "PROTECTED") ? payload.password : null
        }
        const updatedRoom = await this.updateRoom(room.id, data)
        return (updatedRoom)
    }

    async DeleteChatRoom(user: any, room_id: number) {
        const room = await this.getRoomById(room_id)
        if (room == undefined) {
            throw new BadRequestException("Chat Room Not Found!")
        }
        if (room.owner != user.id) {
            throw new UnauthorizedException()
        }
        await this.deleteRoom(room_id);
        const response = { 
            status: "success",
            message: "room deleted successfully"
        }
        return (response)
        // 200 success!!
    }

    async joinChatRoom(user: any, payload: JoinRoomDTO) {
        const room = await this.getRoomById(payload.room_id)
        if (room == undefined)
            throw new BadRequestException("Chat Room Not Found!")

        const authorized = this.verifyAccess(room, payload)
        const is_banned = await this.isBannedFromRoom(user.id, room.id)
        if (!authorized || is_banned) {
            throw new UnauthorizedException()
        }
        // adding user to RoomMember table
        const roomId = await this.addMemberTORoom(user.id, room.id, false)
        if (roomId == null) {
            throw new BadRequestException("User Already in room")
        }
        const response = { 
            status: "succcess",
            message: "user joined room"
        }
        return (response)
        // PS : fallback recheck!
        //this.connectToChat(socket, payload)
    }
    /*
    */
    async leaveChatRoom(user: any, room_id: number) {
        const room = await this.getRoomById(room_id)
        if (room == undefined) {
            throw new BadRequestException("Chat Room not found.")
        }
        // Delete user from member table
        const success = await this.removeUserFromRoom(user.id, room.id)
        if (!success) {
            throw new BadRequestException("User not room member")
        }
        //socket.to(room.b).emit("message", `${user.username} left Ch4t!`)
        //socket.emit("success", "Success")
        //socket.leave(room.name)
        const response = { 
            status: "success",
            message: "User out of room"
        }
        return (response)
    }
    /*
        kick user from chat room
        checks if user is admin and banned user is not
        removes user from room
        (will manly be used in private rooms)
        Yelds Error otherwise 
    */
    async kickUserFromRoom(user: any, payload: kickDTO) {
        const room = await this.getRoomById(payload.room_id)
        const payload_administer : AdministrateDTO = {
            userId: user.id,
            roomId: room.id,
            memberId: payload.user_id
        }
        if (! await this.canAdminstrate(payload_administer))
            throw new UnauthorizedException()
        if (! await this.removeUserFromRoom(payload.user_id, room.id))
            throw new BadRequestException("User is not room member")

        const resp = {
            status: "success",
            message: "User successfully kicked from the room."
        }
        return (resp)
    }

    async banRoomUser(user: any, payload: BanDTO) {
        const room = await this.getRoomById(payload.room_id)
        const is_banned = await this.isBannedFromRoom(user.id, room.id)
        if (is_banned) {
            throw new BadRequestException()
        }
        const administrate_payload : AdministrateDTO= {
            userId: user.id,
            roomId: room.id,
            memberId: payload.user_id
        }
        if (! await this.canAdminstrate(administrate_payload)) {
            throw new UnauthorizedException()
        }
        if (! await this.banUserFromRoom(payload.user_id, room.id)) {
            throw new BadRequestException("User not room member")
        }
        const resp = {
            status: "success",
            message: "User successfully banned from the room."
        }
        return (resp)
    }

    async UnbanUser(user: any, payload: BanDTO) {
        const room = await this.getRoomById(payload.room_id)
        const is_banned = await this.isBannedFromRoom(user.id, room.id)
        if (!is_banned) {
            throw new BadRequestException()
        }

        const administrate_payload: AdministrateDTO= {
            userId: user.id,
            roomId: room.id,
            memberId: payload.user_id
        }

        if (! await this.canAdminstrate(administrate_payload)) {
            throw new UnauthorizedException()
        }
        if (! await this.UnbanUserFromRoom(payload.user_id, room.id)) {
            throw new BadRequestException("User not a room member")
        }
        const resp = {
            status: "success",
            message: "User successfully ubaned from the room."
        }
        return (resp)
    }
    /* 
        checks authorization(user is admin) then:
        updates is_admin on db
        user has to be a member on room
    */
    async setAdmin(user: any, payload: setAdminDTO) {
        const room = await this.getRoomById(payload.room_id)
        const administrate_payload : AdministrateDTO= {
            userId: user.id,
            roomId: room.id,
            memberId: payload.user_id
        }
        if (! await this.canAdminstrate(administrate_payload)) {
            throw new UnauthorizedException()
        }
        if (!await this.addRoomAdmin(payload.user_id, room.id)) {
            throw new BadRequestException()
        }
        const resp = {
            status: "success",
            message: "User successfully set as admin"
        }
        return (resp)
    }
    /*
        Mute user for a  limited time

    */
    async muteUser(user: any, payload: MuteUserDTO) {
        const room = await this.getRoomById(payload.room_id)
        const operation_data : AdministrateDTO = {
            userId: user.id,
            roomId: room.id,
            memberId: payload.user_id
        }
        if (! await this.canAdminstrate(operation_data)) {
            throw new UnauthorizedException()
        }
        if (!await this.muteUserFor(payload.user_id, room.id, payload.muteDuration)) {
            throw new UnauthorizedException()
        }
        const resp = {
            status: "success",
            message: "User successfully muted"
        }
        return (resp)
    }

    async Un_muteUser(user: any, payload: MuteUserDTO) {
        const room = await this.getRoomById(payload.room_id)
        const is_muted = await this.IsUserMuted(user.id, room.id)
        if (!is_muted) {
            throw new BadRequestException()
        }

        const operation_data : AdministrateDTO = {
            userId: user.id,
            roomId: room.id,
            memberId: payload.user_id
        }
        if (!await this.canAdminstrate(operation_data)) {
            throw new UnauthorizedException()
        }
        if (await this.UnmuteUser(payload.user_id, room.id)) {
            throw new BadRequestException()
        }
        const resp = {
            status: "success",
            message: "User successfully Unmuted"
        }
        return (resp)
    }
    /*
        Get all banned users of a room
        only admin can get  banned users
    */
    async getBannedUsers(user: any, payload: RoomDTO) {
        const room = await this.getRoomById(payload.room_id)
        if (room == undefined) {
            throw new BadRequestException("Room does not exist")
        }
        const user_is_admin = await this.IsRoomAdmin(user.id, room.id)
        if (!user_is_admin) {
            throw new UnauthorizedException()
        }
        const banned_users = await this.getAllBannedUsers(room.id)
        const response = {
            status: "success",
            banndUsers: banned_users
        }
        return (response)
    }
}
