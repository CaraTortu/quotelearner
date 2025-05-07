import { drizzle } from "drizzle-orm/neon-http";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

import { env } from "~/env";
import * as schema from "./schema";
import { type InferSelectModel } from "drizzle-orm";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
    conn: NeonQueryFunction<false, false> | undefined;
};

const conn = globalForDb.conn ?? neon(env.NEON_DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

// Export types
export type UserType = (typeof schema.userTypeEnum.enumValues)[number];

export type DBUser = InferSelectModel<typeof schema.user>;
