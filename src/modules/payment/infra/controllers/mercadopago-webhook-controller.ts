import type { FastifyReply, FastifyRequest } from "fastify";
import { makeUpdatePaymentWebhookUseCase } from "../../application/factories/make-update-payment-webhook";
import { mercadoPagoWebhookBody } from "../../domain/payment";


export async function mercadoPagoWebhookController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { type, data } = mercadoPagoWebhookBody.parse(request.body);

    // console.log(request.body)

		if (type === "payment") {
      const service = makeUpdatePaymentWebhookUseCase();
      
			await service.execute({
				id: data.id,
			});
		}

		return reply.status(200).send({ message: "ok" });
	} catch (error) {
		console.error("Webhook processing error:", error);
		
    throw error
	}
}
