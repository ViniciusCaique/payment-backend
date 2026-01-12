import { db, type Transaction } from "..";
import type { TransactionRepository } from "./transaction-interface";

export class DrizzleTransactionRepository implements TransactionRepository {
	startStransaction<T>(
		clb: (tx: Transaction) => Promise<T>,
		parent?: Transaction,
	): Promise<T> {
		const invoker = parent ?? db;
		return invoker.transaction(clb);
	}
}
