import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  Socket,
  Server,
} from 'socket.io';
import { GatewayService } from 'src/chat/gateway/chat/gateway.service';

interface IConnectedUser {
  id: number;
  userID: number;
  username: string;
  socketId: string;
}

interface IRoom {
  id: string;
  label: string;
  hostUserId: number;
  sockets: IConnectedUser[];
  readyCount: number[];
}

@Injectable()
export class GameService {
  gamingRooms: IRoom[] =
    [];
  gamingArcadeRooms: IRoom[] =
    [];
  constructor(
    private gatewayService: GatewayService,
  ) {}

  async hostRoom(
    socket: Socket,
  ) {
    const user =
      await this.gatewayService.getUserBySocket(
        socket,
      );
    const roomId =
      Math.random().toString();
    const currentRoom =
      {
        id: roomId,
        label: `Room-${user.username}`,
        hostUserId:
          user.userID,
        sockets: [
          user,
        ],
        readyCount:
          [],
      };
    this.gamingRooms.push(
      currentRoom,
    );
    socket.join(
      roomId,
    );
    socket.emit(
      'currentRoomDetails',
      currentRoom,
    );
    console.log(
      'gamingrooms',
      this
        .gamingRooms,
    );
  }

  async hostArcadeRoom(
    socket: Socket,
  ) {
    const user =
      await this.gatewayService.getUserBySocket(
        socket,
      );
    const roomId =
      Math.random().toString();
    const currentRoom =
      {
        id: roomId,
        label: `Room-${user.username}`,
        hostUserId:
          user.userID,
        sockets: [
          user,
        ],
        readyCount:
          [],
      };
    this.gamingArcadeRooms.push(
      currentRoom,
    );
    socket.join(
      roomId,
    );
    socket.emit(
      'currentRoomDetails',
      currentRoom,
    );
    console.log(
      'gamingArcadeRooms',
      this
        .gamingArcadeRooms,
      this
        .gamingRooms,
    );
  }

  async userReady(
    socket: Socket,
    server: Server,
  ) {
    let readyCount = 0;
    const room =
      this.getRoomBySocket(
        socket,
      );
    const user =
      await this.gatewayService.getUserBySocket(
        socket,
      );

    if (
      !room?.readyCount.includes(
        user.userID,
      )
    ) {
      room.readyCount.push(
        user.userID,
      );
    }

    room.sockets.forEach(
      (s) =>
        room.readyCount.includes(
          s.userID,
        ) &&
        readyCount++,
    );
    if (
      room
        .readyCount
        .length >=
        2 &&
      readyCount ===
        2
    ) {
      console.log(
        room.sockets.map(
          (s) =>
            console.log(
              s,
            ),
        ),
      );

      this.emitToRoomBySocket(
        socket,
        server,
        'startGame',
      );
    }
  }

  async joinRoom(
    socket: Socket,
  ) {
    const user =
      await this.gatewayService.getUserBySocket(
        socket,
      );
    const selectedRoom =
      this.gamingRooms.find(
        (room) =>
          room
            .sockets
            .length <
          2,
      );
    console.log(
      'joinRoom',
      this
        .gamingRooms,
      this
        .gamingArcadeRooms,
    );
    selectedRoom.sockets.push(
      user,
    );
    this.gamingRooms =
      [
        ...this.gamingRooms.filter(
          (room) =>
            room.id !==
            selectedRoom.id,
        ),
        selectedRoom,
      ];
    socket.join(
      selectedRoom.id,
    );
    console.log(
      'TWO USERS CONNEDTED STARTING NORMAL GAME',
      this
        .gamingRooms,
    );
  }

  async joinArcadeRoom(
    socket: Socket,
  ) {
    const user =
      await this.gatewayService.getUserBySocket(
        socket,
      );
    const selectedRoom =
      this.gamingArcadeRooms.find(
        (room) =>
          room
            .sockets
            .length <
          2,
      );
    console.log(
      selectedRoom,
    );
    selectedRoom.sockets.push(
      user,
    );
    this.gamingArcadeRooms =
      [
        ...this.gamingArcadeRooms.filter(
          (room) =>
            room.id !==
            selectedRoom.id,
        ),
        selectedRoom,
      ];
    socket.join(
      selectedRoom.id,
    );
    console.log(
      'TWO USERS CONNEDTED STARTING GAME',
      this
        .gamingArcadeRooms,
    );
  }

  getRoomBySocket(
    socket: Socket,
  ) {
    return (
      this.gamingRooms.find(
        (room) =>
          room?.sockets &&
          room.sockets.find(
            (
              rSocket,
            ) =>
              rSocket.socketId ===
              socket.id,
          ),
      ) ??
      this.gamingArcadeRooms.find(
        (room) =>
          room?.sockets &&
          room.sockets.find(
            (
              rSocket,
            ) =>
              rSocket.socketId ===
              socket.id,
          ),
      )
    );
  }

  emitToRoomBySocket(
    socket: Socket,
    server: Server,
    event: string,
    data?: any,
  ) {
    const room =
      this.getRoomBySocket(
        socket,
      );

    server
      ?.to(room?.id)
      .emit(
        event,
        data,
      );
  }

  async handleDisconnect(
    socket: Socket,
    server: Server,
  ) {
    const room =
      this.getRoomBySocket(
        socket,
      );

    this.gamingRooms =
      this.gamingRooms?.filter(
        (gRoom) =>
          gRoom?.id !==
          room?.id,
      );
    this.gamingArcadeRooms =
      this.gamingArcadeRooms?.filter(
        (gRoom) =>
          gRoom?.id !==
          room?.id,
      );

    const winner =
      room?.sockets.find(
        (s) =>
          s.socketId !==
          socket.id,
      );

    server
      ?.to(room?.id)
      .emit(
        'winner',
        winner,
      );
    // FIXME: add db handling
  }

  async joinQueue(
    @ConnectedSocket()
    socket: Socket,
  ) {
    console.log(
      'NORMAL QUEUE',
    );
    if (
      this.gamingRooms.some(
        (room) =>
          room
            .sockets
            .length <
          2,
      ) &&
      this
        .gamingRooms
        .length > 0
    ) {
      this.joinRoom(
        socket,
      );
    } else {
      this.hostRoom(
        socket,
      );
    }
  }

  async joinArcadeQueue(
    @ConnectedSocket()
    socket: Socket,
  ) {
    if (
      this.gamingArcadeRooms.some(
        (room) =>
          room
            .sockets
            .length <
          2,
      ) &&
      this
        .gamingArcadeRooms
        .length > 0
    ) {
      this.joinArcadeRoom(
        socket,
      );
    } else {
      this.hostArcadeRoom(
        socket,
      );
    }
  }

  async moveLeft(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
  ) {
    const room =
      this.getRoomBySocket(
        socket,
      );
    console.log(
      'moveLeft',
      room,
      data,
    );
    server
      ?.to(room?.id)
      .emit(
        data.value <
          0
          ? 'moveLeftPaddleUp'
          : 'moveLeftPaddleDown',
        data,
      );
  }

  async moveLeftRelease(
    @ConnectedSocket()
    socket: Socket,
    server: Server,
  ) {
    const room =
      this.getRoomBySocket(
        socket,
      );
    server
      ?.to(room?.id)
      .emit(
        'moveLeftRelease',
      );
  }

  async moveToPos(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
    isRight?: boolean,
  ) {
    const room =
      this.getRoomBySocket(
        socket,
      );
    console.log(
      'moveToPos',
      room,
      data,
    );
    server
      ?.to(room?.id)
      .emit(
        isRight
          ? 'setRightPos'
          : 'setLeftPos',
        data,
      );
  }

  async secondBallinit(
    @ConnectedSocket()
    socket: Socket,
    server: Server,
  ) {
    this.emitToRoomBySocket(
      socket,
      server,
      'SpawnSecondBall',
    );
  }

  async syncCrazzyPuck(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
    isRight?: boolean,
  ) {
    this.emitToRoomBySocket(
      socket,
      server,
      'initPuck2',
      data,
    );
  }
  async syncPuck(
    @ConnectedSocket()
    socket: Socket,
    data: {
      value: number;
    },
    server: Server,
    isRight?: boolean,
  ) {
    const room =
      this.getRoomBySocket(
        socket,
      );
    console.log(
      room,
      data,
    );
    server
      ?.to(room?.id)
      .emit(
        'initPuck',
        data,
      );
  }
}