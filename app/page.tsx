'use client'

import React from "react";
import Layout from "@/src/components/Layout";
import Form, { TextInput } from "@/src/components/Form"
import * as yup from "yup";

const SCHEMA = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export default function Home() {
    const onSubmit = (data: any) => {
        console.log(data);
    };
    return (
        <Layout>
            <div className="mt-44"/>
            <div className="w-full max-w-96 flex justify-start mb-5">
                <p className="self-start text-white font-bold text-3xl">Login</p>
            </div>
            <Form onSubmit={onSubmit} schema={SCHEMA}>
                <TextInput path="email" label="Email" required/>
                <div className="mt-4"/>
                <TextInput path="password" label="Password" type="password" required/>
                <div className="mt-3"/>
                <div className="mt-14"/>
                <button className="w-full max-w-96 flex justify-center items-center bg-primary-green text-white rounded font-bold h-12 shadow-sm shadow-secondary-green active:shadow-inner active:shadow-secondary-green">
                    Access
                </button>
            </Form>
        </Layout>
    );
}