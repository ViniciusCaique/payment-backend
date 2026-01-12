import type { payments } from "@/shared/config/db/schema/payments";
import z from "zod/v4";

export type Payment = typeof payments.$inferSelect;

export const getPaymentId = z.object({
	id: z.string(),
});

export type GetPaymentId = z.infer<typeof getPaymentId>;

export const getPaymentResponse = z.object({
	data: z.object({
		payment: z.object({
			id: z.string(),
		}),
	}),
});

export type GetPaymentResponse = z.infer<typeof getPaymentResponse>;

export const createPaymentBody = z.object({
	document: z.string(),
	description: z.string(),
	amount: z.number(),
	paymentMethod: z.enum(["PIX", "CREDIT_CARD"]),
});

export const createPaymentResponse = z.object({
	data: z.object({
		payment: z.object({
			id: z.string(),
		}),
	}),
});

export type CreatePaymentBody = z.infer<typeof createPaymentBody>;
export type CreatePaymentResponse = z.infer<typeof createPaymentResponse>;

export const updatePaymentBody = z.object({
	status: z.enum(["PENDING", "PAID", "FAIL"]),
});

export const updatePaymentResponse = z.object({
	message: z.string(),
});

export type UpdatePaymentBody = z.infer<typeof updatePaymentBody>;
export type UpdatePaymentResponse = z.infer<typeof updatePaymentResponse>;
