import { NotFound } from "@/shared/errors/not-found";
import type { PaymentRepository } from "../../infra/repositories/payment-repository";

interface GetPaymentUseCaseRequest {
	id: string;
}

export class GetPaymentUseCase {
	constructor(private paymentRepository: PaymentRepository) {}

	async execute({ id }: GetPaymentUseCaseRequest) {
		const existingPayment = await this.paymentRepository.findById(id);

		if (!existingPayment) {
			throw new NotFound()
		}

		return {
			payment: existingPayment,
		};
	}
}
