import { callMercadoPago } from "@/shared/utils/call-mercado-pago";
import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CreatePaymentBody } from "../../domain/payment";
import {
	paymentMethodEnum,
	paymentStatusEnum,
} from "../../domain/repository-types";
import { PAYMENT_REPOSITORY, PaymentRepository } from "../../infra/repositories/payment-repository";

interface CreatePaymentUseCaseRequest {
	data: CreatePaymentBody;
}

@Injectable()
export class CreatePaymentUseCase {
	constructor(
		@Inject(PAYMENT_REPOSITORY)
		private paymentRepository: PaymentRepository
	) {}

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
