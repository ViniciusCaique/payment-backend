import { randomUUID } from "node:crypto";
import type { CreatePaymentBody } from "../../domain/payment";
import {
	paymentMethodEnum,
	paymentStatusEnum,
} from "../../domain/repository-types";
import type { PaymentRepository } from "../../infra/repositories/payment-repository";

interface CreatePaymentUseCaseRequest {
	data: CreatePaymentBody;
}

export class CreatePaymentUseCase {
	constructor(private paymentRepository: PaymentRepository) {}

	async execute({ data }: CreatePaymentUseCaseRequest) {
		if (data.paymentMethod === paymentMethodEnum.CREDIT_CARD) {
			// mercado pago
		}

		const payment = await this.paymentRepository.create({
			id: randomUUID(),
			amount: data.amount,
			description: data.description,
			document: data.document,
			paymentMethod: data.paymentMethod,
			status: paymentStatusEnum.PENDING,
		});

		return {
			payment,
		};
	}
}
