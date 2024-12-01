
import { getDb, rooms, players } from '../db'

export const getRoom = async (c: any) => {
  const db = getDb(c.env);
  const { roomId } = c.req.param();

   try {
    
    const room = await db.select().from(rooms).where(rooms.id.eq(roomId)).first();
  
    if (!room) {
      return c.text('Room not found', 404);
    }

    const roomPlayers = await db.select().from(players).where(players.roomId.eq(roomId));

    return c.broadcast({
      ...room,
      players: roomPlayers,
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    return c.text('Error fetching room', 500);
  }
};

export const getRooms = async (c: any) => {
  const db = getDb(c.env);

  try {
    const allRooms = await db.select().from(rooms);
  
    return c.broadcast(allRooms);
  } catch (error) {

    console.error('Error fetching rooms:', error);
    return c.text('Error fetching rooms', 500);
  }
};


export const RoomConnect = async (c: any ) => {
  console.log(`Client connected: ${c.id}`);
  c.broadcast({ type: 'user_connected', id: c.id });
}

export const RoomMessage = async (c: any) => {
    const { data, broadcast, env } = c
    const db = getDb(c.env);
    const { type, ...payload } = data;

    switch (type) {
      case 'get_rooms': {
        getRooms(c)
        break;
      }

      case 'get_room': {
        getRoom(c)
        break;
      }

      default:
        broadcast({ type: 'error', message: 'Unknown action type' });
    }
  }

export const RoomDisconnect = ({ id }: any) => {
  console.log(`Client disconnected: ${id}`);
}
