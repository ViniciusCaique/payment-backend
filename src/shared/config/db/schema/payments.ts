import {
	integer,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const paymentMethodEnum = pgEnum('paymentMethod', ['PIX', 'CREDIT_CARD']);
export const statusEnum = pgEnum('status', ['PENDING', 'PAID', 'FAIL']);

export const payments = pgTable("tb_payments", {
	id: uuid().defaultRandom().primaryKey(),
	document: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	amount: integer().notNull(),
	paymentMethod: paymentMethodEnum('paymentMethod').notNull().default('PIX'),
	status: statusEnum('status').notNull().default('PENDING'),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});
