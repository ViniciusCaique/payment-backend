import { Transaction } from "@/shared/config/db";
import { Payment } from "../../domain/payment";
import {
	CreatePaymentInput,
	PaymentFilters,
	UpdatePaymentInput
} from "../../domain/repository-types";

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

export interface PaymentRepository {
	findByFilters(filters: PaymentFilters, tx?: Transaction): Promise<Payment[]>;
	findById(id: string, tx?: Transaction): Promise<Payment | undefined>;
	findByMercadoPagoId(id: string, tx?: Transaction): Promise<Payment | undefined>;
	create(data: CreatePaymentInput, tx?: Transaction): Promise<Payment>;
	update(id: string, data: UpdatePaymentInput, tx?: Transaction): Promise<void>;
}
