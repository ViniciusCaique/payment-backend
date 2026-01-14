import type { Payment } from "@/modules/payment/domain/payment";
import type {
	CreatePaymentInput,
	PaymentFilters,
	UpdatePaymentInput,
} from "@/modules/payment/domain/repository-types";
import { db, type Transaction } from "@/shared/config/db";
import { payments } from "@/shared/config/db/schema/payments";
import { and, eq } from "drizzle-orm";
import type { PaymentRepository } from "../payment-repository";

export class DrizzlePaymentRepository implements PaymentRepository {
	async findByFilters(
		filters: PaymentFilters,
		tx?: Transaction,
	): Promise<Payment[]> {
		const dbInstance = tx ?? db;

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

	async findById(id: string, tx?: Transaction): Promise<Payment | undefined> {
		const dbInstance = tx ?? db;

		const [payment] = await dbInstance
			.select()
			.from(payments)
			.where(eq(payments.id, id))
			.limit(1);

		return payment;
	}

	async create(data: CreatePaymentInput, tx?: Transaction): Promise<Payment> {
		const dbInstance = tx ?? db;

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
		const dbInstance = tx ?? db;

		await dbInstance.update(payments).set(data).where(eq(payments.id, id));
	}
}
