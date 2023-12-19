import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { RoomService } from "src/chat/room/room.service";

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
    private roomService: RoomService
  ) {}

  UnauthorizedDisconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect();
  }

  connectionSuccess(
    socket: Socket,
    connectedUser: IConnectedUser,
    namespace?: string
  ) {
    socket.emit("message", {
      Connection: "success",
    });
    // setInterval(
    //   () => {
    //     socket.emit(
    //       'moveLeftPaddle',
    //     );
    //   },
    //   2000,
    // );
    console.log(
      "move x emited",
      this.connectedUsers.find(
        (user) => user.userID === socket.data.user.userID
      )
    );

    if (
      namespace === "game" &&
      !this.connectedUsers.find(
        (user) => user.userID === socket.data.user.userID
      )
    ) {
      this.connectedUsers.push({
        ...connectedUser,
        socketId: socket.id,
      });
    }
  }

  handleDisconnect(socket: Socket) {
    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.socketId !== socket.id
    );

    console.log("connectedUsers disconnect", this.connectedUsers);
  }

  emitError(socket: Socket, error: string) {
    const response = {
      Error: error,
    };
    socket.emit("Error", response);
  }

  private async joinPrevRooms(socket: Socket, userId: number) {
    const all_rooms = await this.roomService.getUserJoinedRooms(userId);
    if (all_rooms === undefined) return;
    for (let chat_room of all_rooms) {
      let name = chat_room.room.name;
      socket.join(name);
    }
  }

  async socketConnection(socket: Socket, namespace?: string) {
    const access_token = socket.request.headers.authorization;
    try {
      const payload = this.jwtService.verify(access_token);
      socket.data.user = payload;
      this.connectionSuccess(socket, payload as IConnectedUser, namespace);
      socket.join("private-chat-socket-" + String(payload.userID));
      socket.join("main-socket-" + String(payload.userID));
      //await this.joinPrevRooms(socket, payload.id)
    } catch (error) {
      this.UnauthorizedDisconnect(socket);
    }
  }

  async getUserBySocket(socket: Socket) {
    return this.connectedUsers.find((user) => user.socketId === socket.id);
  }

  async leavAllSocketRooms(socket: Socket, user: any) {
    const all_rooms = await this.roomService.getUserJoinedRooms(user.id);
    await this.roomService.deleteMemberFromRooms(user.id);
    // Brodcas user left room
    for (let chat_room of all_rooms) {
      let name = chat_room.room.name;
      socket.to(name).emit("message", `${user.username} left Ch4t!`);
      socket.leave(name);
    }
  }
}

/*import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io"
import { RoomService } from "src/chat/room/room.service";

@Injectable()
export class GatewayService {
    constructor(private jwtService: JwtService,
        private roomService: RoomService) {
    }

    UnauthorizedDisconnect(socket: Socket) {
        socket.emit("Error", new UnauthorizedException())
        socket.disconnect()
    }

    connectionSuccess(socket: Socket) {
        socket.emit("message", { Connection: "success" })
    }

    emitError(socket: Socket, error: string) {
        const response = {
            Error: error,
        }
        socket.emit("Error", response)
    }

    private async joinPrevRooms(socket: Socket, userId:number) {
        
        const all_rooms = await this.roomService.getUserJoinedRooms(userId)   
        if (all_rooms === undefined)
            return ;
        for (let chat_room of all_rooms) {
            let name = chat_room.room.name
            socket.join(name)
        }
    }

    async socketConnection(socket: Socket) {
        const access_token = socket.request.headers.authorization
        try {
            const payload = this.jwtService.verify(access_token)
            socket.data.user = payload;
            this.connectionSuccess(socket)
            socket.join("private-chat-socket-" + String(payload.userID))
            //await this.joinPrevRooms(socket, payload.id)

        } catch (error) {
            this.UnauthorizedDisconnect(socket)
        }
    }

    async leavAllSocketRooms(socket: Socket, user: any) {
        const all_rooms = await this.roomService.getUserJoinedRooms(user.id)
        await this.roomService.deleteMemberFromRooms(user.id)
        // Brodcas user left room
        for (let chat_room of all_rooms) {
            let name = chat_room.room.name
            socket.to(name).emit("message", `${user.username} left Ch4t!`)
            socket.leave(name)
        }
    }
}*/
