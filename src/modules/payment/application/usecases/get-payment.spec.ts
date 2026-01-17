import { NotFound } from "@/shared/errors/not-found";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPaymentRepository } from "../../infra/repositories/in-memory/in-memory-payment-repository";
import { PaymentRepository } from "../../infra/repositories/payment-repository";
import { GetPaymentUseCase } from "./get-payment";

let paymentRepository: PaymentRepository;
let sut: GetPaymentUseCase;

describe("Get payment service", () => {
	beforeEach(() => {
		paymentRepository = new InMemoryPaymentRepository();
		sut = new GetPaymentUseCase(paymentRepository);
	});

	it("should be able to get a payment", async () => {
		const payment = await paymentRepository.create({
			id: randomUUID(),
			document: "55555555555",
			description: "something",
			paymentMethod: "PIX",
			amount: 5000,
			status: "PENDING",
		});

		const response = await sut.execute({ id: payment.id });

		expect(response).toEqual(expect.any(Object));
	});

	it("should not be able to get a payment with a wrong id", async () => {
		await expect(sut.execute({ id: "non-existing-id" })).rejects.toThrow(
			NotFound,
		);
	});
});
