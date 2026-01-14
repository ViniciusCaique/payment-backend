import type { FastifyInstance } from "fastify";
import {
	createPaymentBody,
	createPaymentResponse,
	getPaymentId,
	getPaymentResponse,
	getPaymentsFilters,
	getPaymentsResponse,
	updatePaymentBody,
	updatePaymentResponse,
} from "../../domain/payment";
import { createPaymentController } from "../controllers/create-payment-controller";
import { getPaymentByIdController } from "../controllers/get-payment-by-id-controller copy";
import { getPaymentsController } from "../controllers/get-payments-controller";
import { updatePaymentController } from "../controllers/update-payment-controller";

export async function paymentRoutes(app: FastifyInstance) {
	app.get(
		"",
		{
			schema: {
				tags: ["Payment"],
				summary: "Get Payments",
				description: "Get Payments",
				querystring: getPaymentsFilters,
				response: { 200: getPaymentsResponse },
			},
		},
		getPaymentsController,
	);
	app.get(
		"/:id",
		{
			schema: {
				tags: ["Payment"],
				summary: "Get Payment By Id",
				description: "Get Payment By Id",
				params: getPaymentId,
				response: { 200: getPaymentResponse },
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
		"/:id",
		{
			schema: {
				tags: ["Payment"],
				summary: "Update Payment",
				params: getPaymentId,
				body: updatePaymentBody,
				response: { 200: updatePaymentResponse },
			},
		},
		updatePaymentController,
	);
}
