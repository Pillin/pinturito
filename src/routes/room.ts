import { Hono } from 'hono';
import { CreateRoom, getRooms, getRoom } from '../controllers/room'

const roomRouter = new Hono();

roomRouter.post('/', CreateRoom);
roomRouter.get('/', getRooms);
roomRouter.get('/:roomId', getRoom);

export default roomRouter
