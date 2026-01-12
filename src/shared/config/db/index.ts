import { env } from "@/shared/config/env";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { payments } from "./schema/payments";

export const db = drizzle({
	connection: {
		connectionString: env.DATABASE_URL,
	},
	schema: {
		payments,
	},
});

type Schema = {
	payments: typeof payments;
};

export type Transaction = PgTransaction<
	PostgresJsQueryResultHKT,
	Schema,
	ExtractTablesWithRelations<Schema>
>;
