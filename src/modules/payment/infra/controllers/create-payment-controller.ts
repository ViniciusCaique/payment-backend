import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreatePaymentUseCase } from "../../application/factories/make-create-payment";
import { createPaymentBody } from "../../domain/payment";

export async function createPaymentController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const data = createPaymentBody.parse(request.body);

		const service = makeCreatePaymentUseCase();

		const response = await service.execute({ data });

		return reply.status(200).send({ data: response });
	} catch (error) {
		// biome-ignore lint/complexity/noUselessCatch: <explanation>
		throw error;
	}
}
