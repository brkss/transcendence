import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

@Injectable()
export class GatewayService {
  constructor(
    private jwtService: JwtService,
  ) {}

  UnauthorizedDisconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect();
  }

  connectionSuccess(socket: Socket){
    socket.emit("message", { Connection: "success"});
  }

  emitError(socket: Socket, error: string) {
    const response = {
      Error: error,
    };
    socket.emit("Error", error);
  }

    async socketConnection(socket: Socket, namespace?: string) {
    const access_token = socket.request.headers.authorization;
    try {
      const payload = this.jwtService.verify(access_token);
      socket.data.user = payload;

      socket.join("private-chat-socket-" + String(payload.userID));
      socket.join("main-socket-" + String(payload.userID));

    } catch (error) {
      this.UnauthorizedDisconnect(socket);
    }
  }
}
