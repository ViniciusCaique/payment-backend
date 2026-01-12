import type { Transaction } from "@/shared/config/db";
import type { Payment } from "../../domain/payment";
import type {
  CreatePaymentInput,
  UpdatePaymentInput,
} from "../../domain/repository-types";

export interface PaymentRepository {
	findById(id: string, tx?: Transaction): Promise<Payment | undefined>;
	create(data: CreatePaymentInput, tx?: Transaction): Promise<Payment>;
	update(id: string, data: UpdatePaymentInput, tx?: Transaction): Promise<void>;
}
