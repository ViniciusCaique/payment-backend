import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetPaymentUseCase } from "../../application/factories/make-get-payment";
import { getPaymentId } from "../../domain/payment";

export async function getPaymentByIdController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { id } = getPaymentId.parse(request.params);

		const service = makeGetPaymentUseCase();

		const response = await service.execute({ id });

		return reply.status(200).send({ data: response });
	} catch (error) {
		// biome-ignore lint/complexity/noUselessCatch: <explanation>
		throw error;
	}
}
