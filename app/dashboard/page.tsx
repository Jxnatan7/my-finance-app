'use client'

import Layout from "@/src/components/Layout";
import React from "react";
import {useRouter} from "next/navigation";
import {Icon} from "@iconify/react";
import {useBoolean} from "@/src/hooks";
import Modal from "@/src/components/Modal";

type Wallet = {
    id: number;
    name: string;
    balance: string;
}

const SearchInput = () => {
    return (
        <input className="w-full h-11 border-gray-200 border-2 bg-transparent text-white text-md rounded p-3" placeholder="Buscar" type="text"/>
    )
}

const Wallet = ({ id, name, balance }: Wallet) => {
    return (
        <div className="bg-primary-green w-40 h-28 rounded flex flex-col justify-between p-2 cursor-pointer hover:bg-secondary-green">
            <div/>
            <div>
                <p className="text-white">{name}</p>
                <p className="text-white font-bold">R${balance}</p>
            </div>
        </div>
    )
}

const WalletList = () => {
    // const wallets = useWallets();
    const wallets = [];

    return (
        <div className="overflow-x-auto whitespace-nowrap no-scrollbar">
            {wallets.map((wallet, index) => (
                <div
                    key={index}
                    className="inline-block mr-4"
                >
                    <Wallet
                        id={wallet.id}
                        name={wallet.name}
                        balance={wallet.balance}
                        key={wallet.id}
                    />
                </div>
            ))}
        </div>
    )
}

export default function Dashboard() {
    const router = useRouter();
    const { falsy, truly, toggle, bool } = useBoolean();

    return (
        <Layout>
            <div className="w-full max-w-96 flex flex-col">
                <div className="flex justify-between items-center mt-10">
                    <p className="text-white font-bold text-4xl">Wallets</p>
                    <button className="active:opacity-50" onClick={truly}>
                        <Icon icon='tabler:plus' fontSize={27} color='#FFF' />
                    </button>
                </div>
                <div className="mt-5"/>
                <SearchInput/>
                <div className="mt-5"/>
                <WalletList/>
                <Modal isOpen={bool} title="New Wallet" onClose={falsy}>
                    <p>
                        teste
                    </p>
                </Modal>
            </div>
        </Layout>
    );
}