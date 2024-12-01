import { Hono } from 'hono';
import { CreateRoom, JoinRoom } from '../controllers/room'

const roomRouter = new Hono();

roomRouter.post('/', CreateRoom);
roomRouter.post('/:roomId/join', JoinRoom)

export default roomRouter
