import type { Payment } from "@/modules/payment/domain/payment";
import {
	type CreatePaymentInput,
	type PaymentFilters,
	paymentStatusEnum,
	type UpdatePaymentInput,
} from "@/modules/payment/domain/repository-types";
import { randomUUID } from "node:crypto";
import type { PaymentRepository } from "../payment-repository";

export class InMemoryPaymentRepository implements PaymentRepository {
	public payments: Payment[] = [];

	async findByFilters(filters: PaymentFilters): Promise<Payment[]> {
		const { document, paymentMethod } = filters;

		return this.payments.filter((payment) => {
			const matchesDocument = document ? payment.document === document : true;

			const matchesMethod = paymentMethod
				? payment.paymentMethod === paymentMethod
				: true;

			return matchesDocument && matchesMethod;
		});
	}

	async findById(id: string): Promise<Payment | undefined> {
		const payment = this.payments.find((payment) => payment.id === id);

		if (!payment) {
			return undefined;
		}

		return payment;
	}

	async create(data: CreatePaymentInput): Promise<Payment> {
		const payment = {
			id: randomUUID(),
			description: data.description,
			document: data.document,
			amount: data.amount,
			paymentMethod: data.paymentMethod,
			status: paymentStatusEnum.PENDING,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this.payments.push(payment);

		return payment;
	}

	async update(id: string, data: UpdatePaymentInput): Promise<void> {
		const existingPayment = this.payments.find((payment) => payment.id === id);
		const paymentIndex = this.payments.findIndex(
			(payment) => payment.id === id,
		);

		if (paymentIndex === -1) {
			return undefined;
		}

		if (!existingPayment) {
			return undefined;
		}

		const updatedPayment = {
			id: existingPayment.id,
			document: data.document ?? existingPayment.document,
			description: data.description ?? existingPayment.description,
			amount: data.amount ?? existingPayment.amount,
			paymentMethod: data.paymentMethod ?? existingPayment.paymentMethod,
			status: data.status ?? existingPayment.status,
			createdAt: existingPayment.createdAt,
			updatedAt: new Date(),
		};

		this.payments[paymentIndex] = updatedPayment;
	}
}
