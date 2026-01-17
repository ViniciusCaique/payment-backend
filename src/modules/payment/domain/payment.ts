import { payments } from "@/shared/config/db/schema/payments";
import z from "zod/v4";

const validateCPF = (cpf: string) => {
	const cleanCPF = cpf.replace(/\D/g, "");

	if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;

	let sum = 0;
	let remainder: number;

	for (let i = 1; i <= 9; i++)
		sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (11 - i);
	remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(cleanCPF.substring(9, 10), 10)) return false;

	sum = 0;
	for (let i = 1; i <= 10; i++)
		sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (12 - i);
	remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(cleanCPF.substring(10, 11), 10)) return false;

	return true;
};

export const cpfSchema = z
	.string()
	.min(11, "CPF must be at least 11 characters")
	.transform((val) => val.replace(/\D/g, ""))
	.refine(validateCPF, "Invalid CPF");

export type Payment = typeof payments.$inferSelect;

export const getPaymentId = z.object({
	id: z.string(),
});

export const getPaymentsFilters = z.object({
	document: cpfSchema.optional(),
	paymentMethod: z.enum(["PIX", "CREDIT_CARD"]).optional(),
});

export type GetPaymentId = z.infer<typeof getPaymentId>;

export const getPaymentsResponse = z.object({
	data: z.object({
		payment: z.array(
			z.object({
				id: z.string(),
				description: z.string(),
				document: z.string(),
				amount: z.number(),
				paymentMethod: z.string(),
			}),
		),
	}),
});

export type GetPaymentsResponse = z.infer<typeof getPaymentsResponse>;

export const getPaymentResponse = z.object({
	data: z.object({
		payment: z.object({
			id: z.string(),
			description: z.string(),
			document: z.string(),
			amount: z.number(),
			paymentMethod: z.string(),
		}),
	}),
});

export type GetPaymentResponse = z.infer<typeof getPaymentResponse>;

export const createPaymentBody = z.object({
	document: cpfSchema,
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

export const mercadoPagoWebhookBody = z.object({
	action: z.string(),
	api_version: z.string(),
	data: z.object({
		id: z.string(),
	}),
	date_created: z.string(),
	id: z.number(),
	live_mode: z.boolean(),
	type: z.string(),
	user_id: z.string(),
});
