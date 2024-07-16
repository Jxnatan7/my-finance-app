'use client'

import Layout from "@/src/components/Layout";
import {Icon} from "@iconify/react";
import React from "react";
import {useBoolean, useTransactions} from "@/src/hooks";
import {usePathname, useRouter} from "next/navigation";
import SearchInput from "@/src/components/SearchInput";
import {
    Transaction,
    TransactionService,
    TransactionServiceSaveTransactionRequestFc, TransactionType
} from "@/src/service/api/TransactionService";
import Loading from "@/src/components/Loading";
import Modal from "@/src/components/Modal";
import Form, {SelectTransactionType, TextInput} from "@/src/components/Form";
import Success from "@/src/components/Success";
import {useMutation} from "@tanstack/react-query";
import * as yup from "yup";

const SCHEMA = yup.object().shape({
    title: yup.string().required('Title is required'),
    type: yup.string().required('Type is required'),
    value: yup.number().required('Value is required'),
});

function extractIdFromUrl(url: string): number {
    const regex = /\/wallet\/(\d+)/;
    const match = url.match(regex);

    return match ? parseInt(match[1], 10) : 0;
}

function formatCurrency(value: string): string {
    const numberValue = parseFloat(value);

    const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numberValue);

    return formattedValue;
}

const CurrencyText = ({value}: {value: string}) => {
    const formattedValue = formatCurrency(value);
    return (
        <div className="text-green-600">
            {formattedValue}
        </div>
    )
}

const TransactionComponent = ({ transaction }: {transaction: Transaction}) => {
    return (
        <div className="w-full max-w-96 flex h-14 bg-white rounded border-2 border-gray-400">
            <div className="w-1/6 flex justify-center items-center bg-primary-green">
                <Icon icon="tabler:arrow-up" color="#FFF" fontSize={30} />
            </div>
            <div className="flex flex-col justify-center items-center p-2">
                <p className="text-black font-bold text-lg">{transaction.title}</p>
                <div className="mt-2"/>
                <p className="text-gray-600 text-sm">{transaction.createdAt}</p>
            </div>
        </div>
    )
}

const TransactionsList = ({transactions}: {transactions: Transaction[]}) => {
    return (
        <div className="overflow-y-auto whitespace-nowrap no-scrollbar">
            {transactions?.map((transaction, index) => (
                <div
                    key={index}
                    className="mb-4"
                >
                    <TransactionComponent
                        transaction={transaction}
                        key={transaction.id}
                    />
                </div>
            ))}
        </div>
    )
}

export default function WalletDetails() {
    const route = useRouter();
    const { falsy, truly, bool } = useBoolean();
    const pathname = usePathname();
    const id = extractIdFromUrl(pathname);
    const {data, isLoading: isLoadingTransactions, refetch } = useTransactions(id);

    const mutation = useMutation({
        mutationFn: async (form: TransactionServiceSaveTransactionRequestFc) => {
            await TransactionService.save(form);
        },
        onSuccess: () => {
            refetch().then(() => falsy()).catch();
        },
        onError: (error) => {
        },
    });

    const onSubmit = (form: TransactionServiceSaveTransactionRequestFc) => {
        mutation.mutate(form);
    };

    if (!data) return;                        <div className="mt-3"/>

    const { wallet, transactions } = data;

    return (
        <Layout>
            <div className="w-full max-w-96 flex flex-col">
                <div className="flex justify-between items-center mt-10">
                    <p className="text-white font-bold text-4xl">{wallet.name}</p>
                    <button className="active:opacity-50">
                        <Icon icon='tabler:pencil' fontSize={27} color='#FFF'/>
                    </button>
                </div>
                <div className="mt-2"/>
                <CurrencyText value={wallet.balance}/>
                <div className="mt-5"/>
                <SearchInput/>
                <div className="mt-5"/>
                <button className="active:opacity-50 self-end" onClick={truly}>
                    <Icon icon='tabler:plus' fontSize={27} color='#FFF'/>
                </button>
                <div className="mt-5"/>
                {isLoadingTransactions || !transactions ? <Loading/> : <TransactionsList transactions={transactions}/>}
                <Modal isOpen={bool} title="New Wallet" onClose={falsy}>
                    <Form onSubmit={onSubmit} schema={SCHEMA}>
                        <TextInput path="name" label="Name" required/>
                        <div className="mt-3"/>
                        <SelectTransactionType path="type" label="Type" required/>
                        <div className="mt-3"/>
                        <TextInput path="value" label="Value" type="number" required/>
                        <div className="mt-5"/>
                        <button
                            className="w-full max-w-96 flex justify-center items-center bg-primary-green text-white rounded font-bold h-12 shadow-sm shadow-secondary-green active:shadow-inner active:shadow-secondary-green">
                            {mutation.isPending ? <Loading/> : mutation.isSuccess ? <Success/> : "Create Transaction"}
                        </button>
                        <div className="mt-3"/>
                    </Form>
                </Modal>
            </div>
        </Layout>
    )
}