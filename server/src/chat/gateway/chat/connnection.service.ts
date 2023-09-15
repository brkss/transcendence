import { Injectable } from "@nestjs/common";
import { connectable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ConnectionService {
    // constructor(private prismaService: PrismaService) {

    // }
    // async creatConnectionSocket(socketId: string, userID: number) {
    //     const connection = await this.prismaService.socketConnection.create({
    //         data: {
    //             socket_id: socketId,
    //             user_id: userID
    //         },
    //         select: {
    //             socket_id: true,
    //             user_id: true
    //         }
    //     })
    //     console.log(connection)
    // }
    // async deleteConnectionSocket(socketID: string) {
    //     const connection = await this.prismaService.socketConnection.delete({
    //         where:{
    //             socket_id: socketID
    //         }
    //     })
    //     console.log(connection)
    // }

}