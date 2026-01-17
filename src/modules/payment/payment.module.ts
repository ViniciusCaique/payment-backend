import { DatabaseModule } from "@/shared/database/database.module";
import { Module } from "@nestjs/common";
import { CreatePaymentUseCase } from "./application/usecases/create-payment";
import { GetPaymentUseCase } from "./application/usecases/get-payment";
import { GetPaymentsUseCase } from "./application/usecases/get-payments";
import { UpdatePaymentUseCase } from "./application/usecases/update-payment";
import { UpdatePaymentWebhookUseCase } from "./application/usecases/update-payment-webhook";
import { DrizzlePaymentRepository } from "./infra/repositories/drizzle/drizzle-payment-repository";
import { PAYMENT_REPOSITORY } from "./infra/repositories/payment-repository";
import { PaymentController } from "./payment.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [PaymentController],
	providers: [
		{
			provide: PAYMENT_REPOSITORY,
			useClass: DrizzlePaymentRepository,
		},
    GetPaymentUseCase,
    GetPaymentsUseCase,
		CreatePaymentUseCase,
		UpdatePaymentUseCase,
		UpdatePaymentWebhookUseCase,
	],
	exports: [PAYMENT_REPOSITORY],
})
export class PaymentModule {}
