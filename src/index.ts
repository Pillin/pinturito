import { instrument } from "@fiberplane/hono-otel";
import { Hono } from "hono";
import roomRouter from './routes/room'

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.route('/rooms', roomRouter);


export default instrument(app);
