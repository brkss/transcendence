import { Injectable } from "@nestjs/common";

@Injectable()
export class authService {
    login(req: any): Object {
        return (`Hello Pong you are ${req.user.login}`)
    }
}