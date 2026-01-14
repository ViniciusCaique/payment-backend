import { NotFound } from "@/shared/errors/not-found";
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

		await service.execute({ id, data });

		return reply.status(200).send({ message: "Alterado com sucesso" });
	} catch (error) {
		if (error instanceof NotFound) {
			return reply.status(404).send({
				message: error.message,
			});
		}

		throw error;
	}
}
