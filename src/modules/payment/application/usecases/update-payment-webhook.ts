import { NotFound } from "@/shared/errors/not-found";
import { api } from "@/shared/lib/axios";
import { paymentStatusEnum } from "../../domain/repository-types";
import type { PaymentRepository } from "../../infra/repositories/payment-repository";

interface UpdatePaymentWebhookUseCaseRequest {
	id: string;
}

interface MercadoPagoResponse {
	status: string;
}

export class UpdatePaymentWebhookUseCase {
	constructor(private paymentRepository: PaymentRepository) {}

	async execute({ id }: UpdatePaymentWebhookUseCaseRequest) {
		const existingPayment =
			await this.paymentRepository.findByMercadoPagoId(id);

		if (!existingPayment) {
			throw new NotFound();
		}

		if (existingPayment.mercado_pago_id) {
			let status: (typeof paymentStatusEnum)[keyof typeof paymentStatusEnum] =
				paymentStatusEnum.FAIL;

			const { data: paymentData } = await api.get<MercadoPagoResponse>(
				`/v1/payments/${existingPayment.mercado_pago_id}`,
			);

			if (paymentData.status.toLowerCase() === "approved") {
				status = paymentStatusEnum.PAID;
			}

			await this.paymentRepository.update(existingPayment.id, {
				status: status,
			});
		}
	}
}
