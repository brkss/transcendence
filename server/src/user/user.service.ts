import { Injectable } from '@nestjs/common';
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
}
