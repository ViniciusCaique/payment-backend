import { NotFound } from "@/shared/errors/not-found";
import { PaymentFilters } from "../../domain/repository-types";
import { PaymentRepository } from "../../infra/repositories/payment-repository";

interface GetPaymentsUseCaseRequest {
	document?: string | undefined;
	paymentMethod?: string | undefined;
}

export class GetPaymentsUseCase {
	constructor(private paymentRepository: PaymentRepository) {}

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
