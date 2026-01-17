import { NotFound } from "@/shared/errors/not-found";
import { Inject } from "@nestjs/common";
import { PAYMENT_REPOSITORY, PaymentRepository } from "../../infra/repositories/payment-repository";

interface GetPaymentUseCaseRequest {
	id: string;
}

export class GetPaymentUseCase {
	constructor(
		@Inject(PAYMENT_REPOSITORY)
		private paymentRepository: PaymentRepository
	) {}


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
