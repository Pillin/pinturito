import { Context } from 'hono';
import { getDb, RoomStatusType, rooms, players, MAX_PLAYERS } from '../db'

type CreateRoomBody = {
  playerName: string;
  roomName: string;
  maxPlayers?: number;
  status?: RoomStatusType;
};

export const CreateRoom = async (c: Context) => {
 const db = getDb(c.env);
  const { roomName, playerName, maxPlayers, status } = await c.req.json<CreateRoomBody>();

  const roomId = crypto.randomUUID();
  const ownerId = crypto.randomUUID();

  const rommData = {
    id: roomId,
    name: roomName,
    maxPlayers: maxPlayers || MAX_PLAYERS,
    status: status || RoomStatusType.Waiting,
    ownerId
  }

  const playerData = {
    id: ownerId,
    name: playerName,
    roomId,
  }

  try {
    await db.transaction(async (tx) => {
      await tx.insert(rooms).values(rommData);
      await tx.insert(players).values(playerData);

      return c.json({
        ...rommData,
        owner: {
          ...playerData
        }
      });
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    return c.text('Error creating room', 500);
  }
}

export const getRooms = async (c: Context) => {
  const db = getDb(c.env);

  try {
    const allRooms = await db.select().from(rooms);
  
    return c.json(allRooms);
  } catch (error) {

    console.error('Error fetching rooms:', error);
    return c.text('Error fetching rooms', 500);
  }
};

export const getRoom = async (c: Context) => {
  const db = getDb(c.env);
  const { roomId } = c.req.param();

   try {
    const room = await db.select().from(rooms).where(rooms.id.eq(roomId)).first();
  
    if (!room) {
      return c.text('Room not found', 404);
    }

    const roomPlayers = await db.select().from(players).where(players.roomId.eq(roomId));

    return c.json({
      ...room,
      players: roomPlayers,
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    return c.text('Error fetching room', 500);
  }
};