import { NotFound } from "@/shared/errors/not-found";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPaymentRepository } from "../../infra/repositories/in-memory/in-memory-payment-repository";
import type { PaymentRepository } from "../../infra/repositories/payment-repository";
import { UpdatePaymentUseCase } from "./update-payment";

let paymentRepository: PaymentRepository;
let sut: UpdatePaymentUseCase;

describe("Update payment service", () => {
	beforeEach(() => {
		paymentRepository = new InMemoryPaymentRepository();
		sut = new UpdatePaymentUseCase(paymentRepository);
	});

	it("should be able to update a payment", async () => {
		const payment = await paymentRepository.create({
			id: randomUUID(),
			document: "55555555555",
			description: "something",
			paymentMethod: "PIX",
			amount: 5000,
			status: "PENDING",
		});

		await sut.execute({
			id: payment.id,
			data: {
				status: "PAID",
			},
		});

		const paymentUpdated = await paymentRepository.findById(payment.id);

		expect(paymentUpdated?.status).toEqual("PAID");
	});

	it("should not be able to update a payment with a wrong id", async () => {
		await expect(
			sut.execute({
				id: "non-existing-id",
				data: {
					status: "PAID",
				},
			}),
		).rejects.toThrow(NotFound);
	});
});
