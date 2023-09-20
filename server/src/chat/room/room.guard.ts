// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { PrismaService } from "src/prisma/prisma.service";

// @Injectable()
// export class RoomGuard implements CanActivate {
//     private prismaService: PrismaService;
//     constructor(private userId: number, roomName: string) {

//     }
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const id  = await this.prismaService.roomMembers.findMany({
//             where: {
//                 userId: this.userId,
//                 roo
//             }
//         })
//         return (true)
//     }
// }