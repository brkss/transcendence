import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { GatewayService } from "./gateway.service";
import { IConnectedUser } from "src/utils";
import { InternalOAuthError } from "passport-oauth2";
import { GameService as GameServicedb } from "../game.service";

interface IRoom {
  id: string;
  label: string;
  hostUserId: number;
  sockets: IConnectedUser[];
  readyCount: number[];
  isPrivate?: boolean;
  gameID: number;
  scores: {leftscore : number, rightscore: number};
}

@Injectable()
export class GameService {
  gamingRooms: IRoom[] = [];
  gamingArcadeRooms: IRoom[] = [];
  constructor(private gatewayService: GatewayService, private gameservicedb: GameServicedb) {}

  connectionSuccess(
    socket: Socket,
    connectedUser: IConnectedUser,
    namespace?: string,
  ) { 
  }

  async hostRoom(socket: Socket) {
    const user = await this.gatewayService.getUserBySocket(socket);
    const roomId = Math.random().toString();
    const currentRoom = {
      id: roomId,
      label: `Room-${user.username}`,
      hostUserId: user.userID,
      sockets: [user],
      readyCount: [],
      gameID: 0,
      scores : {leftscore : 0, rightscore: 0},
    };
    this.gamingRooms.push(currentRoom);
    socket.join(roomId);
    socket.emit("currentRoomDetails", currentRoom);
    console.log("gamingrooms", this.gamingRooms);
  }

  async createPrivateRoom(socket: Socket, gameId: number) {
    //const user = await this.gatewayService.getUserBySocket(socket);
    const socket_user = socket.data.user
    const user = this.gatewayService.getConnectedUserById(socket_user.id)
    const currentRoom: IRoom = {
      id: gameId?.toString(),
      label: `Room-${user?.username}`,
      hostUserId: user?.userID,
      sockets: [user],
      readyCount: [],
      isPrivate: true,
      gameID : 0,
      scores : {leftscore : 0, rightscore : 0},
    };
    this.gamingRooms.push(currentRoom);
    socket.join(gameId.toString());
    socket.emit("currentRoomDetails", currentRoom);
  }

  async hostArcadeRoom(socket: Socket) {
    const user = await this.gatewayService.getUserBySocket(socket);
    const roomId = Math.random().toString();
    const currentRoom = {
      id: roomId,
      label: `Room-${user.username}`,
      hostUserId: user.userID,
      sockets: [user],
      readyCount: [],
      gameID: 0,
      scores : {leftscore: 0, rightscore: 0},
    };
    this.gamingArcadeRooms.push(currentRoom);
    socket.join(roomId);
    socket.emit("currentRoomDetails", currentRoom);
    console.log("gamingArcadeRooms", this.gamingArcadeRooms);
  }

  async userReady(socket: Socket, server: Server, room: IRoom) {
    let readyCount = 0;
    //const room = this.getRoomByPlayer(socket.data.user.id);
    //const user = await this.gatewayService.getUserBySocket(socket);
    const user = await this.gatewayService.getConnectedUserById(socket.data.user.id)
    if (room && room.readyCount &&  !room.readyCount.includes(user.userID)) {
      {room.readyCount.push(user.userID);}
    }
    if (room && room.sockets) {
      room.sockets.forEach(
        (s) => room.readyCount.includes(s.userID) && readyCount++
      );
      if (room.readyCount.length >= 2 && readyCount === 2) {
        console.log(room.sockets.map((s) => console.log(s)));
        this.emitToRoomBySocket(socket, server, "startGame");
      }
    }
  }

  async joinRoom(socket: Socket, roomId?: number) {
    //const user = await this.gatewayService.getUserBySocket(socket);
    const socket_user = socket.data.user
    const user = this.gatewayService.getConnectedUserById(socket_user.id)
    if (user != undefined) {
      // user is not in game mode
      // do somthing
    }
    const selectedRoom = !roomId
      ? this.gamingRooms.find((room) => room.sockets.length < 2)
      : this.gamingRooms.find((room) => room.id === roomId.toString());

    //console.log(selectedRoom);
    selectedRoom.sockets.push(user);

    this.gamingRooms = [
      ...this.gamingRooms.filter((room) => room.id !== selectedRoom.id),
      selectedRoom,
    ];
    socket.join(selectedRoom.id);

    // Selected Room Is Same As Room ?
    //const Room = this.getRoomByPlayer(socket.data.user.id);
    const Room = selectedRoom

    setTimeout(()=>socket.emit("currentRoomDetails", Room), 1000)
    console.log("TWO USERS CONNEDTED STARTING GAME", Room);
  }

  async joinArcadeRoom(socket: Socket) {
    const user = await this.gatewayService.getUserBySocket(socket);
    const selectedRoom = this.gamingArcadeRooms.find(
      (room) => room.sockets.length < 2
    );
    console.log(selectedRoom);
    selectedRoom.sockets.push(user);
    this.gamingArcadeRooms = [
      ...this.gamingArcadeRooms.filter((room) => room.id !== selectedRoom.id),
      selectedRoom,
    ];
    socket.join(selectedRoom.id);
    const room = this.getArcadeRoomBySocket(socket);

    setTimeout(()=>socket.emit("currentRoomDetails", room), 1000)
    
    console.log("TWO USERS CONNEDTED STARTING GAME ARCADE", this.gamingArcadeRooms);
  }

  getRoomBySocket(socket: Socket) {
    let room = this.gamingRooms.find(
      (room) =>
        room?.sockets &&
        room?.sockets.find((rSocket) => rSocket?.socketId === socket?.id)
    );
    if(!room){
      room = this.gamingArcadeRooms.find(
        (room) =>
          room?.sockets &&
          room?.sockets.find((rSocket) => rSocket?.socketId === socket?.id)
      );
    }
    return room;
  }


  getRoomByPlayer(player_id: number) {
    let room = this.gamingRooms.find(
      (room) =>
        room?.sockets &&
        room?.sockets.find((rSocket) => rSocket.id === player_id)
    );
    if(!room){
      room = this.gamingArcadeRooms.find(
        (room) =>
          room?.sockets &&
          room?.sockets.find((rSocket) => rSocket?.id === player_id)
      );
    }
    return room;
  }

  getArcadeRoomBySocket(socket: Socket) {
    return this.gamingArcadeRooms.find(
      (room) =>
        room?.sockets &&
        room.sockets.find((rSocket) => rSocket.socketId === socket.id)
    );
  }

  emitToRoomBySocket(
    socket: Socket,
    server: Server,
    event: string,
    data?: any,
  ) {
    const room = this.getRoomByPlayer(socket.data.user.id);

    server?.to(room?.id).emit(event, data);
  }

  isPrivateRoomCreated(socket: Socket, roomId: number) {
    return this.gamingRooms.some((room) => room.id === roomId.toString());
  }

  async handleDisconnect(socket: Socket, server: Server) {
    // normal 
    let room = this.getRoomByPlayer(socket.data.user.id);
    let aroom = this.getArcadeRoomBySocket(socket);
    let room_result: IRoom;
    let mode: string;

    let winner = null;
    if(room){
      room_result = room;
      mode = "default";
      this.gamingRooms = this.gamingRooms?.filter(
        (gRoom) => gRoom?.id !== room?.id
      );  
      winner = room?.sockets ? room?.sockets?.find((s) => s.socketId !== socket.id) : null;
    }else if(aroom){
      room_result = aroom;
      mode = "nuke";
      this.gamingArcadeRooms = this.gamingArcadeRooms?.filter(
        (gRoom) => gRoom?.id !== aroom?.id
      );  
      winner = aroom?.sockets? aroom?.sockets.find((s) => s.socketId !== socket.id) : null;
    }
        
    //console.log("room ar : ", room, aroom);
    server?.to(room ? room?.id : aroom?.id).emit("winner", winner);
    /*
    // FIXME: add db handling
    if (room_result != undefined && room_result.sockets.length > 1){
      const data = {
      firstPlayer_id : room_result.sockets[0].userID,
      secondPlayer_id : room_result.sockets[1].userID,
      mode: mode
    }

    const game_id = await this.gameservicedb.createGame(data);
    room_result.gameID = game_id;
    const firstscore = {
      game_id : game_id,
      player_id : room_result.sockets[1].userID,
      player_score: 3
    };
    const secondscore = {
      game_id : game_id,
      player_id : room_result.sockets[0].userID,
      player_score: 5
    };
    await this.gameservicedb.addScore(game_id, firstscore);
    await this.gameservicedb.addScore(game_id, secondscore);
    }
    */
  }

  async joinQueue(
    @ConnectedSocket()
    socket: Socket
  ) {
    if (
      this.gamingRooms.some((room) => room.sockets.length < 2) &&
      this.gamingRooms.length > 0
    ) {
      this.joinRoom(socket);
    } else {
      this.hostRoom(socket);
    }
  }

  async joinArcadeQueue(
    @ConnectedSocket()
    socket: Socket
  ) {
    if (
      this.gamingArcadeRooms.some((room) => room.sockets.length < 2) &&
      this.gamingArcadeRooms.length > 0
    ) {
      this.joinArcadeRoom(socket);
    } else {
      this.hostArcadeRoom(socket);
    }
  }

  async moveLeft(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server
  ) {
    const room = this.getRoomByPlayer(socket.data.user.id);
    console.log("moveLeft", room, data);
    server
      ?.to(room?.id)
      .emit(data.value < 0 ? "moveLeftPaddleUp" : "moveLeftPaddleDown", data);
  }

  async moveLeftRelease(
    @ConnectedSocket()
    socket: Socket,
    server: Server
  ) {
    const room = this.getRoomByPlayer(socket.data.user.id);
    server?.to(room?.id).emit("moveLeftRelease");
  }

  async moveToPos(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
    isRight?: boolean
  ) {
    //const room = this.getRoomByPlayer(socket.data.user.id);
    const room = this.getRoomByPlayer(socket.data.user.id)
    //console.log("moveToPos", room, data);
    if (!room) {
      console.log("move TO pos : ", socket.data.user)
      console.log("current room :" , room)
      throw new InternalServerErrorException();
    }
    server?.to(room?.id).emit(isRight ? "setRightPos" : "setLeftPos", data);
  }

  async secondBallinit(
    @ConnectedSocket()
    socket: Socket,
    server: Server
  ) {
    this.emitToRoomBySocket(socket, server, "SpawnSecondBall");
  }

  async sendGameChat(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
    isRight?: boolean
  ) {
    this.emitToRoomBySocket(socket, server, "gameChatMessage", data);
  }

  async syncCrazzyPuck(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
    isRight?: boolean
  ) {
    this.emitToRoomBySocket(socket, server, "initPuck2", data);
  }

  async gettingScore(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
    isRight?: boolean
  ) {
    this.emitToRoomBySocket(socket, server, "getScore", data);
    // const room = this.getRoomBySocket(socket);
    // const host = this.get
    // if(isRight)
    //   room.scores.rightscore = data.value;
    // else 
    //   room.scores.leftscore = data.value;
  }

  async syncPuck(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
    isRight?: boolean
  ) {
    const room = this.getRoomByPlayer(socket.data.user.id);
    console.log(room, data);
    server?.to(room?.id).emit("initPuck", data);
  }

  async endGame(socket: Socket, payload: { leftscore: number, rightscore: number }){
      const room = this.getRoomBySocket(socket);
      console.log("room : " ,room , this.gamingRooms);
      if(room){
        const fp = room.hostUserId || room.sockets[0].userID;
        console.log("fp : ", fp);
        const sp =  room.sockets[1].userID;
        const data = {
          firstPlayer_id : fp,
          secondPlayer_id : sp,
          mode: "N/A"
        }
        const game_id = await this.gameservicedb.createGame(data);
        const firstscore = {
          game_id : game_id,
          player_id : fp,
          player_score: payload.leftscore
        };
        const secondscore = {
          game_id : game_id,
          player_id : sp,
          player_score: payload.rightscore
        };
        await this.gameservicedb.addScore(game_id, firstscore);
        await this.gameservicedb.addScore(game_id, secondscore);
      }
     
  }
}
