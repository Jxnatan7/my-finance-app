import {api as webapi} from "@/src/service/api/http";

export type Wallet = {
    id: number;
    name: string;
    balance: string;
}

export class WalletService {
    static api = webapi;
    static save = async (form: WalletServiceSaveWalletRequestFc) => (await this.api.post<WalletServiceFc['save']>('v1/wallet', form));
    static findAll = async (): Promise<Wallet[]> => (await this.api.get<WalletServiceFc['findAll']>('v1/wallet/all')).data;
    static find = async (id: number): Promise<Wallet> => (await this.api.get<WalletServiceFc['find']>(`v1/wallet/${id}`)).data
}

export interface WalletServiceFc {
    save: void,
    findAll: Wallet[],
    find: Wallet,
}

export type WalletServiceSaveWalletRequestFc = {
    name: string;
}