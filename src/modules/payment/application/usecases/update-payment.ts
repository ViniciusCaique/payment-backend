import { NotFound } from "@/shared/errors/not-found";
import { Inject } from "@nestjs/common";
import { UpdatePaymentBody } from "../../domain/payment";
import { PAYMENT_REPOSITORY, PaymentRepository } from "../../infra/repositories/payment-repository";

interface UpdatePaymentUseCaseRequest {
	id: string,
	data: UpdatePaymentBody;
}

export class UpdatePaymentUseCase {
	constructor(
		@Inject(PAYMENT_REPOSITORY)
		private paymentRepository: PaymentRepository
	) {}


	async execute({ id, data }: UpdatePaymentUseCaseRequest) {
		const existingPayment = await this.paymentRepository.findById(id);

		if (!existingPayment) {
			throw new NotFound()
		}

		await this.paymentRepository.update(id, data);
	}
}
