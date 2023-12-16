export * from './refreshtoken.interface'

export interface IConnectedUser {
    id: number;
    userID: number;
    username: string;
    socketId: string;
  }