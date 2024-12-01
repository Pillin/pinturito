import { drizzle } from 'drizzle-orm/d1';

export const getDb = (env: { DB: any }) => {
  const { DB } = env
  return drizzle(DB);
};
