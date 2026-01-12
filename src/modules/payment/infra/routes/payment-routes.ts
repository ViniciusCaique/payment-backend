import type { FastifyInstance } from "fastify";
import {
  createPaymentBody,
  createPaymentResponse,
  getPaymentId,
  getPaymentResponse,
  updatePaymentBody,
} from "../../domain/payment";
import { createPaymentController } from "../controllers/create-payment-controller";
import { getPaymentByIdController } from "../controllers/get-payment-by-id-controller";
import { updatePaymentController } from "../controllers/update-payment-controller";

export async function paymentRoutes(app: FastifyInstance) {
	app.get(
		"/",
		{
			schema: {
				tags: ["Payment"],
				summary: "Get Payment By Id",
				description: "Get Payment By Id",
				params: getPaymentId,
				response: { 209: getPaymentResponse },
			},
		},
		getPaymentByIdController,
	);
	app.post(
		"/",
		{
			schema: {
				tags: ["Payment"],
				summary: "Create Payment",
				description: "Create Payment",
				body: createPaymentBody,
				response: { 201: createPaymentResponse },
			},
		},
		createPaymentController,
	);
	app.patch(
		"/",
		{
			schema: {
				tags: ["Payment"],
				summary: "Update Payment",
				params: getPaymentId,
				body: updatePaymentBody,
				response: { 200: createPaymentResponse },
			},
		},
		updatePaymentController,
	);
}
