'use client'

import Layout from "@/src/components/Layout";
import React, {useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {Icon} from "@iconify/react";
import {useBoolean, useWallets} from "@/src/hooks";
import Modal from "@/src/components/Modal";
import Form, {TextInput} from "@/src/components/Form";
import Loading from "@/src/components/Loading";
import Success from "@/src/components/Success";
import * as yup from "yup";
import {useMutation} from "@tanstack/react-query";
import {Wallet, WalletService, WalletServiceSaveWalletRequestFc} from "@/src/service/api/WalletService";
import Link from "next/link";
import SearchInput from "@/src/components/SearchInput";

const SCHEMA = yup.object().shape({
    name: yup.string().required('Name is required'),
});

const WalletComponent = ({ id, name, balance }: Wallet) => {
    return (
        <Link href={`/wallet/${id}`}>
            <div
                className="bg-primary-green w-40 h-28 rounded flex flex-col justify-between p-2 cursor-pointer hover:bg-secondary-green">
                <div/>
                <div>
                    <p className="text-white">{name}</p>
                    <p className="text-white font-bold">R${balance}</p>
                </div>
            </div>
        </Link>
    )
}

const WalletList = ({wallets, isLoading}: { wallets?: Wallet[], isLoading: boolean }) => {

    if (isLoading) return <Loading/>;

    return (
        <div className="overflow-x-auto whitespace-nowrap no-scrollbar">
            {wallets?.map((wallet, index) => (
                <div
                    key={index}
                    className="inline-block mr-4"
                >
                    <WalletComponent
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
    const { falsy, truly, bool } = useBoolean();
    const { data: wallets, isLoading, refetch } = useWallets();

    const mutation = useMutation({
        mutationFn: async (form: WalletServiceSaveWalletRequestFc) => {
            await WalletService.save(form);
        },
        onSuccess: () => {
            refetch().then(() => falsy()).catch();
        },
        onError: (error) => {
        },
    });

    const onSubmit = (form: WalletServiceSaveWalletRequestFc) => {
        mutation.mutate(form);
    };

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
                <WalletList wallets={wallets} isLoading={isLoading}/>
                <Modal isOpen={bool} title="New Wallet" onClose={falsy}>
                    <Form onSubmit={onSubmit} schema={SCHEMA}>
                        <TextInput path="name" label="Name" required />
                        <div className="mt-4"/>
                        <button type="submit" className="w-full max-w-96 flex justify-center items-center bg-primary-green text-white rounded font-bold h-12 shadow-sm shadow-secondary-green active:shadow-inner active:shadow-secondary-green">
                            {mutation.isPending ? <Loading/> : mutation.isSuccess ? <Success/> : "Create Wallet"}
                        </button>
                        <div className="mt-3"/>
                    </Form>
                </Modal>
            </div>
        </Layout>
    );
}