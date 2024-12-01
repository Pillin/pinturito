import { instrument } from "@fiberplane/hono-otel";
import { Hono } from "hono";
import roomRouter from './routes/room'
import { RoomConnect, RoomMessage, RoomDisconnect } from "./controllers/room-rt";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

instrument(app);

app.route('/rooms', roomRouter);


export default {
  fetch: app.fetch,
  connect: RoomConnect,
  message: RoomMessage,
  disconnect: RoomDisconnect,
};
