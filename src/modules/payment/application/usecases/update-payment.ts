import { NotFound } from "@/shared/errors/not-found";
import { UpdatePaymentBody } from "../../domain/payment";
import { PaymentRepository } from "../../infra/repositories/payment-repository";

interface UpdatePaymentUseCaseRequest {
	id: string,
	data: UpdatePaymentBody;
}

export class UpdatePaymentUseCase {
	constructor(private paymentRepository: PaymentRepository) {}

	async execute({ id, data }: UpdatePaymentUseCaseRequest) {
		const existingPayment = await this.paymentRepository.findById(id);

		if (!existingPayment) {
			throw new NotFound()
		}

		await this.paymentRepository.update(id, data);
	}
}
