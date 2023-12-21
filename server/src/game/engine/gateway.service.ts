import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

interface IConnectedUser {
  id: number;
  userID: number;
  username: string;
  socketId: string;
}

@Injectable()
export class GatewayService {
  connectedUsers: IConnectedUser[] = [];
  constructor(
    private jwtService: JwtService,
  ) {}

  UnauthorizedDisconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect();
  }

  connectionSuccess(socket: Socket,connectedUser: IConnectedUser,namespace?: string){
    socket.emit("message", { Connection: "success"});

    if (namespace === "game" && !this.connectedUsers.find(
        (user) => user.userID === socket.data.user.userID)) 
    {
      this.connectedUsers.push({...connectedUser,socketId: socket.id});
    }
  }

  handleDisconnect(socket: Socket) {
    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.socketId !== socket.id
    );
        // debug //
        //this.connectedUsers = []
        // debug //
  }

  async socketConnection(socket: Socket, namespace?: string) {
    const access_token = socket.request.headers.authorization;
    try {
      const payload = this.jwtService.verify(access_token);
      socket.data.user = payload;
      this.connectionSuccess(socket, payload as IConnectedUser, namespace);
    } catch (error) {
        console.error("Authentication Error")
      this.UnauthorizedDisconnect(socket);
    }
  }

  async getUserBySocket(socket: Socket) {
    return this.connectedUsers.find((user) => user.socketId === socket.id);
  }

  // gets IConnectedUser from connectedUsers[] by id 
  // undefined if no such user
  getConnectedUserById(user_id: number) : IConnectedUser | undefined{
    const connected_user = this.connectedUsers.find((user) => user.id === user_id);
    return (connected_user)
  }
}