import React from "react";
import Layout from "@/src/components/Layout";
import Form, {TextInput} from "@/src/components/Form"
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
            <Form onSubmit={onSubmit} schema={SCHEMA}>
                <TextInput path="email" label="Email" required />
                <TextInput path="password" label="Password" required />
            </Form>
        </Layout>
    );
}
