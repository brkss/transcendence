import {Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class auth42Guard extends AuthGuard('42-auth2') {

}