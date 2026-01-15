import { callMercadoPago } from "@/shared/utils/call-mercado-pago";
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
		let mercado_pago_id: string | null = null;
		let checkout_url: string | null = null;

		if (data.paymentMethod === paymentMethodEnum.CREDIT_CARD) {
			const response = await callMercadoPago();
			console.log(response.id);

			mercado_pago_id = response.id;
			checkout_url = response.sandbox_init_point;
		}

		const payment = await this.paymentRepository.create({
			id: randomUUID(),
			amount: data.amount,
			description: data.description,
			document: data.document,
			paymentMethod: data.paymentMethod,
			status: paymentStatusEnum.PENDING,
			mercado_pago_id: mercado_pago_id,
		});

		return {
			payment,
			checkout_url,
		};
	}
}
