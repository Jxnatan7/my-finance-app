import {api as webapi} from "@/src/service/api/http";
import {Wallet} from "@/src/service/api/WalletService";

export enum TransactionType {
    Credit = 'CREDIT',
    Debit = 'DEBIT',
}

export type Transaction = {
    id: number;
    title: string;
    value: string;
    type: TransactionType;
    createdAt: string;
    user_id: number;
}

export class TransactionService {
    static api = webapi;
    static save = async (form: TransactionServiceSaveTransactionRequestFc) => (await this.api.post<TransactionServiceFc['save']>('v1/transaction', form));
    static findAll = async (walletId: number): Promise<FindAllTransactionsResponseFc> => (await this.api.get<TransactionServiceFc['findAll']>(`v1/transaction/all/${walletId}`)).data;
    static find = async (id: number): Promise<Transaction> => (await this.api.get<TransactionServiceFc['find']>(`v1/transaction/${id}`)).data
}

export interface FindAllTransactionsResponseFc {
    wallet: Wallet;
    transactions: Transaction[];
}

export interface TransactionServiceFc {
    save: void,
    findAll: FindAllTransactionsResponseFc,
    find: Transaction,
}

export type TransactionServiceSaveTransactionRequestFc = {
    title: string;
    type: TransactionType,
    value: number,
    walletId: number,
}