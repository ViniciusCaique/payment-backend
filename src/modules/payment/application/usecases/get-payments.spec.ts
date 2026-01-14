import { NotFound } from "@/shared/errors/not-found";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPaymentRepository } from "../../infra/repositories/in-memory/in-memory-payment-repository";
import type { PaymentRepository } from "../../infra/repositories/payment-repository";
import { GetPaymentsUseCase } from "./get-payments";

let paymentRepository: PaymentRepository;
let sut: GetPaymentsUseCase;

describe("Get payments service", () => {
	beforeEach(() => {
		paymentRepository = new InMemoryPaymentRepository();
		sut = new GetPaymentsUseCase(paymentRepository);
	});

	it("should be able to get payments with document", async () => {
		const payment = await paymentRepository.create({
			id: randomUUID(),
			document: "55555555555",
			description: "something",
			paymentMethod: "PIX",
			amount: 5000,
			status: "PENDING",
		});

		const response = await sut.execute({ document: payment.document });

		expect(response).toEqual(expect.any(Object));
	});

	it("should be able to get payments with payment method", async () => {
		const payment = await paymentRepository.create({
			id: randomUUID(),
			document: "55555555555",
			description: "something",
			paymentMethod: "PIX",
			amount: 5000,
			status: "PENDING",
		});

		const response = await sut.execute({
			paymentMethod: payment.paymentMethod,
		});

		expect(response).toEqual(expect.any(Object));
	});

	it("should be able to get payments with payment method and document", async () => {
		const payment = await paymentRepository.create({
			id: randomUUID(),
			document: "55555555555",
			description: "something",
			paymentMethod: "PIX",
			amount: 5000,
			status: "PENDING",
		});

		const response = await sut.execute({
			document: payment.document,
			paymentMethod: payment.paymentMethod,
		});

		expect(response).toEqual(expect.any(Object));
	});

	it("should not be able to get a payment with wrong params", async () => {
		await expect(
			sut.execute({
				document: "non-existing-document",
				paymentMethod: "non-existing-paymentmethod",
			}),
		).rejects.toThrow(NotFound);
	});
});
