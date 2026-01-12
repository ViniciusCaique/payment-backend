import type { FastifyReply, FastifyRequest } from "fastify";
import { makeUpdatePaymentUseCase } from "../../application/factories/make-update-payment";
import { getPaymentId, updatePaymentBody } from "../../domain/payment";

export async function updatePaymentController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { id } = getPaymentId.parse(request.params);
		const data = updatePaymentBody.parse(request.body);

		const service = makeUpdatePaymentUseCase();

		const response = await service.execute({ id, data });

		return reply.status(200).send({ data: response });
	} catch (error) {
		// biome-ignore lint/complexity/noUselessCatch: <explanation>
		throw error;
	}
}
