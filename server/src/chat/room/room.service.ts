/*
import { Injectable } from "@nestjs/common";
import { channel } from "diagnostics_channel";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomService {
    constructor(private prismaService: PrismaService) {

    }
    async createChatRoom(user: any, roominfo: any) {
        // roominfo should be a dto
        try {
            const newRoom = await this.prismaService.chatRoom.create({
                data: {
                    name: roominfo.name,
                    users: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })
            console.log(newRoom)
            return (newRoom)
        }catch (error) {
            return (undefined)
        }
    }
    async getUserRooms(userID: number) {
        const rooms = await this.prismaService.user.findUnique({
            where: {
                id: userID
            },
            select: {
                chat_rooms: true
            }
        })
        return (rooms)
    }

}
*/