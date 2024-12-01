export enum RoomStatusType {
  Waiting = 'waiting',
  Ready = 'ready',
  InProgress = 'in_progress',
}

export type Room = {
  roomName: string;
  roomId: string;
  players: [],
  status: RoomStatusType
}