import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Socket, Server } from "socket.io";
//import { GatewayService } from "../../chat/gateway/chat/gateway.service";
import { GatewayService } from "./gateway.service";
import { UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { GameService } from "./game.service";
import { UserService } from "src/user/user.service";

const rooms = [];

@WebSocketGateway({
  cors: true,
  namespace: "game",
})
@UseFilters()
@UsePipes(
  new ValidationPipe({
    disableErrorMessages: false,
    whitelist: true,
    forbidNonWhitelisted: true,
  })
)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gatewayService: GatewayService,
    private userService: UserService,
    private gameService: GameService
  ) {}
  @WebSocketServer()
  server: Server;
  async handleConnection(socket: Socket) {
    const user = socket.data.user
    this.gatewayService.socketConnection(socket, "game");
    if (user)
      await this.userService.updateUserStatus(user.userID, "ingame")
  }

  async handleDisconnect(socket: Socket) {
    const user = socket.data.user
    if (user)
      await this.userService.updateUserStatus(user.userID, "online")

    this.gatewayService.handleDisconnect(socket)
    this.gameService.handleDisconnect(socket, this.server);
  }

  @SubscribeMessage("joinArcadeQueue")
  async joinArcadeQueue(
    @ConnectedSocket()
    socket: Socket
  ) {
    rooms.push(socket.id);
    try {
      const savedSocket = this.gatewayService.connectedUsers.find(
        (user) => user.socketId === socket.id
      );
      if (savedSocket) {
        this.gameService.joinArcadeQueue(socket);
      } else {
        socket.emit("notAllowed", {
          status: "401",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage("joinQueue")
  async joinQueue(
    @ConnectedSocket()
    socket: Socket
  ) {
    rooms.push(socket.id);
    try {
      const savedSocket = this.gatewayService.connectedUsers.find(
        (user) => user.socketId === socket.id
      );
      if (savedSocket) {
        this.gameService.joinQueue(socket);
      } else {
        socket.emit("notAllowed", {
          status: "401",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage("moveLeft")
  async moveLeftPaddle(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    }
  ) {
    this.gameService.moveLeft(socket, payload, this.server);
  }

  @SubscribeMessage("CrazymodePuck")
  async drawSecondBall(
    @ConnectedSocket()
    socket: Socket
  ) {
    this.gameService.secondBallinit(socket, this.server);
  }
  @SubscribeMessage("initPuck2")
  async syncCrazzyPuck(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    }
  ) {
    this.gameService.syncCrazzyPuck(socket, payload, this.server);
  }

  @SubscribeMessage("moveLeftRelease")
  async moveLeftRelease(
    @ConnectedSocket()
    socket: Socket
  ) {
    this.gameService.moveLeftRelease(socket, this.server);
  }

  @SubscribeMessage("paddleLeftPos")
  async moveLeftPaddleToPos(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    }
  ) {
    this.gameService.moveToPos(socket, payload, this.server);
  }

  @SubscribeMessage("paddleRightPos")
  async moveRightPaddleToPos(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    }
  ) {
    this.gameService.moveToPos(socket, payload, this.server, true);
  }

  @SubscribeMessage("getScore")
  async gettingScore(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    }
  ) {
    this.gameService.gettingScore(socket, payload, this.server);
  }

  @SubscribeMessage("initPuck")
  async syncPuck(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    }
  ) {
    this.gameService.syncPuck(socket, payload, this.server);
  }

  @SubscribeMessage("gameChatMessage")
  async sendGameChat(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    }
  ) {
    this.gameService.sendGameChat(socket, payload, this.server);
  }

  @SubscribeMessage("userReady")
  async userReady(
    @ConnectedSocket()
    socket: Socket
  ) {
    const room = this.gameService.getRoomByPlayer(socket.data.user.id);
    const aroom = this.gameService.getRoomByPlayer(socket.data.user.id);
    console.error("user ready room : ", room)
    console.error("user ready arcade : ", aroom)
    if(room)
      this.gameService.userReady(socket, this.server, room);
    else
      this.gameService.userReady(socket, this.server, aroom);
  }

  @SubscribeMessage("joinPrivateGame")
  async joinPrivateGame(socket: Socket, payload: { gid: number }){
      console.error("user:", socket.data.user.username, "emit socket ID:", socket.id) 
      if (this.gameService.isPrivateRoomCreated(socket, payload.gid)) {
        await this.gameService.joinRoom(socket, payload.gid);
      } else {
        await this.gameService.createPrivateRoom(socket, payload.gid);
      }
  }

}

