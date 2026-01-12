import type { CreatePaymentBody } from "../../domain/payment";
import type { PaymentRepository } from "../../infra/repositories/payment-repository";

interface CreatePaymentUseCaseRequest {
	data: CreatePaymentBody;
}

export class CreatePaymentUseCase {
	constructor(private paymentRepository: PaymentRepository) {}

	async execute({ data }: CreatePaymentUseCaseRequest) {
		const payment = await this.paymentRepository.create(data);

		return {
			payment,
		};
	}
}
