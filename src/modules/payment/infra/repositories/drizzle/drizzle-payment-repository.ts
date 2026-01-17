// import { DATABASE_CONNECTION } from "@/shared/database/database.module";

import { Payment } from "@/modules/payment/domain/payment";
import {
	CreatePaymentInput,
	PaymentFilters,
	UpdatePaymentInput,
} from "@/modules/payment/domain/repository-types";
import { Transaction } from "@/shared/config/db";
import * as schema from "@/shared/config/db/";
import { payments } from "@/shared/config/db/schema/payments";
import { DATABASE_CONNECTION } from "@/shared/database/database.module";
import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PaymentRepository } from "../payment-repository";

export type Database = NodePgDatabase<typeof schema>;

@Injectable()
export class DrizzlePaymentRepository implements PaymentRepository {
	constructor(
    @Inject(DATABASE_CONNECTION) private readonly database: Database,
  ) {}

	private get db(): Database {
		return this.database;
	}

	async findByFilters(
		filters: PaymentFilters,
		tx?: Transaction,
	): Promise<Payment[]> {
		const dbInstance = tx ?? this.db;

		const { document, paymentMethod } = filters;

		const conditions = [];

		if (document) {
			conditions.push(eq(payments.document, document));
		}

		if (paymentMethod) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			conditions.push(eq(payments.paymentMethod, paymentMethod as any));
		}

		const payment = await dbInstance
			.select()
			.from(payments)
			.where(and(...conditions));

		return payment;
	}

	async findByMercadoPagoId(
		id: string,
		tx?: Transaction,
	): Promise<Payment | undefined> {
		const dbInstance = tx ?? this.db;

		const [payment] = await dbInstance
			.select()
			.from(payments)
			.where(eq(payments.mercado_pago_id, id))
			.limit(1);

		return payment;
	}

	async findById(id: string, tx?: Transaction): Promise<Payment | undefined> {
		const dbInstance = tx ?? this.db;

		const [payment] = await dbInstance
			.select()
			.from(payments)
			.where(eq(payments.id, id))
			.limit(1);

		return payment;
	}

	async create(data: CreatePaymentInput, tx?: Transaction): Promise<Payment> {
		const dbInstance = tx ?? this.db;

		const [payment] = await dbInstance
			.insert(payments)
			.values(data)
			.returning();

		if (!payment) {
			throw new Error("Failed to create payment.");
		}

		return payment;
	}

	async update(
		id: string,
		data: UpdatePaymentInput,
		tx?: Transaction,
	): Promise<void> {
		const dbInstance = tx ?? this.db;

		await dbInstance.update(payments).set(data).where(eq(payments.id, id));
	}
}
