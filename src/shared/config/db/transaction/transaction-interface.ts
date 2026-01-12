export interface ITransaction {
	rollback(): Promise<void>;
}

export interface TransactionRepository {
	startStransaction<T>(
		clb: (tx: ITransaction) => Promise<T>,
		parent?: ITransaction,
	): Promise<T>;
}