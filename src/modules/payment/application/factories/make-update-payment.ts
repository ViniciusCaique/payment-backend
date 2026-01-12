import { DrizzlePaymentRepository } from "../../infra/repositories/drizzle/drizzle-payment-repository";
import { UpdatePaymentUseCase } from "../usecases/update-payment";



export function makeUpdatePaymentUseCase() {
	const paymentRepository = new DrizzlePaymentRepository();

	const updatePaymentUseCase = new UpdatePaymentUseCase(paymentRepository);

	return updatePaymentUseCase;
}