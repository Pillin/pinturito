import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, check } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable(
  'rooms',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    maxPlayers: integer('max_players').notNull(),
    ownerId: text('owner_id').notNull(),
    status: text('status')
      .notNull()
      .default('waiting')
  },
  (table) => ({
    validStatus: check(
      'valid_status',
      sql`status IN ('waiting', 'ready', 'in_progress')`
    )
  })
);

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  roomId: text('room_id').notNull(),
});
