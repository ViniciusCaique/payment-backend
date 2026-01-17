import { NotFound } from "@/shared/errors/not-found";
import { Inject } from "@nestjs/common";
import { PaymentFilters } from "../../domain/repository-types";
import { PAYMENT_REPOSITORY, PaymentRepository } from "../../infra/repositories/payment-repository";

interface GetPaymentsUseCaseRequest {
	document?: string | undefined;
	paymentMethod?: string | undefined;
}

export class GetPaymentsUseCase {
	constructor(
		@Inject(PAYMENT_REPOSITORY)
		private paymentRepository: PaymentRepository
	) {}


	async execute({ document, paymentMethod }: GetPaymentsUseCaseRequest) {
		const filters: PaymentFilters = {};

		if (document) filters.document = document;
		if (paymentMethod) filters.paymentMethod = paymentMethod;

		const existingPayment = await this.paymentRepository.findByFilters(filters);

		if (existingPayment.length === 0) {
			throw new NotFound();
		}

		return {
			payment: existingPayment,
		};
	}
}
