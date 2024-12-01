import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./src/db/schema";

const seedDataRooms = [
  { name: "Matthew Prince", id: '1', maxPlayers: 3, ownerId: '1', status: 'waiting' },
];

const seedDataPlayers = [
  { name: "Matthew Prince", id: '1', roomId: '1' },
]

// Modified from: https://github.com/drizzle-team/drizzle-orm/discussions/1545
const seedDatabase = async () => {
  const pathToDb = getLocalD1DB();
  const client = createClient({
    url: `file:${pathToDb}`,
  });
  const db = drizzle(client);
  console.log("Seeding database...");
  try {
    await db.insert(schema.rooms).values(seedDataRooms);
    await db.insert(schema.players).values(seedDataPlayers);
    console.log("✅ Database seeded successfully!");
    console.log("🪿 Run `npm run fiberplane` to explore data with your api.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

seedDatabase();

function getLocalD1DB() {
  try {
    const basePath = path.resolve(".wrangler");
    const files = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .filter((f) => f.endsWith(".sqlite"));

    // In case there are multiple .sqlite files, we want the most recent one.
    files.sort((a, b) => {
      const statA = fs.statSync(path.join(basePath, a));
      const statB = fs.statSync(path.join(basePath, b));
      return statB.mtime.getTime() - statA.mtime.getTime();
    });
    const dbFile = files[0];

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);

    return url;
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Error resolving local D1 DB: ${err.message}`);
    } else {
      console.log(`Error resolving local D1 DB: ${err}`);
    }
  }
}
