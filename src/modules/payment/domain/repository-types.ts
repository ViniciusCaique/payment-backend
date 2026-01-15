import z from "zod/v4";

export const paymentStatusEnum = {
	PENDING: "PENDING", 
	PAID: "PAID", 
	FAIL:"FAIL"
} as const

export const paymentMethodEnum = {
	PIX: "PIX", 
	CREDIT_CARD: "CREDIT_CARD", 
} as const

export type PaymentMethod = typeof paymentMethodEnum;

export const createPaymentSchema = z.object({
	id: z.string(),
	document: z.string().min(1),
	description: z.string().min(1),
	amount: z.number().positive(),
	paymentMethod: z.enum(["PIX", "CREDIT_CARD"]),
	status: z.enum(["PENDING", "PAID", "FAIL"]),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	mercado_pago_id: z.string().optional().nullable(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export type UpdatePaymentInput = Partial<
	Omit<CreatePaymentInput, "id" | "createdAt">
>;

export interface PaymentFilters {
  document?: string;
  paymentMethod?: string;
}
