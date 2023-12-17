import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {
  JoinRoomDTO,
  chatMessageDTO,
  PrivateMessageDTO,
  LeaveRoomDTO,
} from 'src/chat/dtos/chat.dto';

import {
  Socket,
  Server,
} from 'socket.io';
import { ValidationExceptionFilter } from 'src/chat/dtos/chatvalidation.filer';
import { GatewayService } from '../../chat/gateway/chat/gateway.service';
import { ChatService } from 'src/chat/chat.service';
import {
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from './game.service';
import { subscribe } from 'diagnostics_channel';

const rooms = [];

@WebSocketGateway({
  cors: true,
  namespace: 'game',
})
@UseFilters()
@UsePipes(
  new ValidationPipe(
    {
      disableErrorMessages:
        false,
      whitelist:
        true,
      forbidNonWhitelisted:
        true,
    },
  ),
)
export class GameGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  constructor(
    private gatewayService: GatewayService,
    private chatService: ChatService,
    private gameService: GameService,
  ) {}
  @WebSocketServer()
  server: Server;
  handleConnection(
    socket: Socket,
  ) {
    this.gatewayService.socketConnection(
      socket,
      'game',
    );
  }

  private async leaveAllRoomsOnDisconnect(
    socket: Socket,
    user: any,
  ) {
    /*
              Deleting all member entrys should be at leaveRoom
            */
    //this.gatewayService.leavAllSocketRooms(socket, user)
  }

  async handleDisconnect(
    socket: Socket,
  ) {
    const user =
      socket.data
        .user;
    const connected_rooms =
      await this.chatService.getConnectedRooms(
        user.id,
      );

    for (const room of connected_rooms) {
      const payload =
        {
          room_id:
            room.roomId,
        };
      await this.chatService.leaveChat(
        socket,
        payload,
      );
    }
    this.gatewayService.handleDisconnect(
      socket,
    );
    this.gameService.handleDisconnect(
      socket,
      this.server,
    );
  }
  
  @SubscribeMessage(
    'joinArcadeQueue'
  )
  async joinArcadeQueue(
    @ConnectedSocket()
    socket: Socket,
  ) {
    // console.log(
    //   socket,
    // );
    rooms.push(
      socket.id,
    );
    try {
      console.log(
        'connectedUsers',
        this
          .gatewayService
          .connectedUsers,
      );
      const savedSocket =
        this.gatewayService.connectedUsers.find(
          (user) =>
            user.socketId ===
            socket.id,
        );
      console.log(
        'savedSocket',
        savedSocket,
      );
      if (
        savedSocket
      ) {
        this.gameService.joinArcadeQueue(
          socket,
        );
      } else {
        socket.emit(
          'notAllowed',
          {
            status:
              '401',
          },
        );
      }
    } catch (error) {
      console.log(
        error,
      );
    }
  }



  @SubscribeMessage(
    'joinQueue',
  )
  async joinQueue(
    @ConnectedSocket()
    socket: Socket,
  ) {
    // console.log(
    //   socket,
    // );
    rooms.push(
      socket.id,
    );
    try {
      console.log(
        'connectedUsers',
        this
          .gatewayService
          .connectedUsers,
      );
      const savedSocket =
        this.gatewayService.connectedUsers.find(
          (user) =>
            user.socketId ===
            socket.id,
        );
      console.log(
        'savedSocket',
        savedSocket,
      );
      if (
        savedSocket
      ) {
        this.gameService.joinQueue(
          socket,
        );
      } else {
        socket.emit(
          'notAllowed',
          {
            status:
              '401',
          },
        );
      }
    } catch (error) {
      console.log(
        error,
      );
    }
  }

  @SubscribeMessage(
    'moveLeft',
  )
  async moveLeftPaddle(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    },
  ) {
    console.log(
      payload,
    );
    this.gameService.moveLeft(
      socket,
      payload,
      this.server,
    );
  }

  @SubscribeMessage('CrazymodePuck',

  )
  async drawSecondBall(
    @ConnectedSocket()
    socket:Socket,
  )
  {
      this.gameService.secondBallinit(socket,this.server);
  }
  @SubscribeMessage(
    'initPuck2',
  )
  async syncCrazzyPuck(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    },
  ) {
    this.gameService.syncCrazzyPuck(
      socket,
      payload,
      this.server,
    );
  }

  @SubscribeMessage(
    'moveLeftRelease',
  )
  async moveLeftRelease(
    @ConnectedSocket()
    socket: Socket,
  ) {
    this.gameService.moveLeftRelease(
      socket,
      this.server,
    );
  }

  @SubscribeMessage(
    'paddleLeftPos',
  )
  async moveLeftPaddleToPos(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    },
  ) {
    this.gameService.moveToPos(
      socket,
      payload,
      this.server,
    );
  }

  @SubscribeMessage(
    'paddleRightPos',
  )
  async moveRightPaddleToPos(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    },
  ) {
    this.gameService.moveToPos(
      socket,
      payload,
      this.server,
      true,
    );
  }
  
  @SubscribeMessage(
    'getScore',
  )
  async gettingScore(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    },
  ) {
    this.gameService.gettingScore(
      socket,
      payload,
      this.server,
    );
  }

  @SubscribeMessage(
    'initPuck',
  )
  async syncPuck(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody()
    payload: {
      value: number;
    },
  ) {
    this.gameService.syncPuck(
      socket,
      payload,
      this.server,
    );
  }

@SubscribeMessage(
  'gameChatMessage',
)
async sendGameChat(
  @ConnectedSocket()
  socket: Socket,
  @MessageBody()
  payload: {
    value: number;
  },
) {
  this.gameService.sendGameChat(
    socket,
    payload,
    this.server,
  );
}

  @SubscribeMessage(
    'userReady',
  )
  async userReady(
    @ConnectedSocket()
    socket: Socket,
  ) {
    this.gameService.userReady(
      socket,
      this.server,
    );
  }
}
