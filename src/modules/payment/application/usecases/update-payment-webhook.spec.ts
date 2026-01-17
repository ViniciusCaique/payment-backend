import { NotFound } from "@/shared/errors/not-found";
import { api } from "@/shared/lib/axios";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryPaymentRepository } from "../../infra/repositories/in-memory/in-memory-payment-repository";
import { PaymentRepository } from "../../infra/repositories/payment-repository";
import { UpdatePaymentWebhookUseCase } from "./update-payment-webhook";

vi.mock("@/shared/lib/axios", () => ({
	api: {
		get: vi.fn(),
	},
}));

let paymentRepository: PaymentRepository;
let sut: UpdatePaymentWebhookUseCase;

describe("Update payment webhook service", () => {
	beforeEach(() => {
		paymentRepository = new InMemoryPaymentRepository();
		sut = new UpdatePaymentWebhookUseCase(paymentRepository);

		vi.clearAllMocks();
	});

	it("should be able to update a payment", async () => {
		const payment = await paymentRepository.create({
			id: randomUUID(),
			document: "55555555555",
			description: "something",
			paymentMethod: "PIX",
			amount: 5000,
			status: "PENDING",
			mercado_pago_id: randomUUID(),
		});

		vi.mocked(api.get).mockResolvedValueOnce({
			data: {
				status: "approved",
			},
		});

		if (payment.mercado_pago_id) {
			await sut.execute({
				id: payment.mercado_pago_id,
			});

			const paymentUpdated = await paymentRepository.findById(payment.id);

			expect(paymentUpdated?.status).toEqual("PAID");
		}
	});

	it("should not be able to update a payment with a wrong id", async () => {
		await expect(
			sut.execute({
				id: "non-existing-id",
			}),
		).rejects.toThrow(NotFound);

		expect(api.get).not.toHaveBeenCalled();
	});
});
