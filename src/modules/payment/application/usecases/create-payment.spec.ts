import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPaymentRepository } from "../../infra/repositories/in-memory/in-memory-payment-repository";
import { PaymentRepository } from "../../infra/repositories/payment-repository";
import { CreatePaymentUseCase } from "./create-payment";

let paymentRepository: PaymentRepository;
let sut: CreatePaymentUseCase;

describe("Create payment service", () => {
	beforeEach(() => {
		paymentRepository = new InMemoryPaymentRepository();
		sut = new CreatePaymentUseCase(paymentRepository);
	});

	it("should be able to create a payment", async () => {
		const response = await sut.execute({
			data: {
				document: "55555555555",
				description: "something",
				paymentMethod: "PIX",
				amount: 5000,
			},
		});

		expect(response).toEqual(expect.any(Object));
	});
});
