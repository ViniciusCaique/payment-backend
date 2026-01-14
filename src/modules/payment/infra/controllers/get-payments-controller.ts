import { NotFound } from "@/shared/errors/not-found";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetPaymentsUseCase } from "../../application/factories/make-get-payments";
import { getPaymentsFilters } from "../../domain/payment";

export async function getPaymentsController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { document, paymentMethod } = getPaymentsFilters.parse(
			request.params,
		);

		const service = makeGetPaymentsUseCase();

		const response = await service.execute({
			document: document,
			paymentMethod: paymentMethod,
		});

		return reply.status(200).send({ data: response });
	} catch (error) {
		if (error instanceof NotFound) {
			return reply.status(404).send({
				message: error.message,
			});
		}

		throw error;
	}
}
