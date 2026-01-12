import { DrizzlePaymentRepository } from "../../infra/repositories/drizzle/drizzle-payment-repository";
import { GetPaymentUseCase } from "../usecases/get-payment";



export function makeGetPaymentUseCase() {
	const paymentRepository = new DrizzlePaymentRepository();

	const getPaymentUseCase = new GetPaymentUseCase(paymentRepository);

	return getPaymentUseCase;
}