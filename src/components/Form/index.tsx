'use client'

import React, {HTMLInputTypeAttribute} from 'react';
import {useForm, SubmitHandler, useFormContext, FormProvider} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

type TextInputProps = {
    path: string;
    label?: string;
    required?: boolean;
    type?: HTMLInputTypeAttribute
};

export const TextInput: React.FC<TextInputProps> = ({ path, label, required = false , type }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="flex flex-col pb-2 w-full max-w-96">
            {label && <label className="text-gray-100 text-sm mb-0.5">{label}</label>}
            <input className="w-full h-12 border-2 border-primary-gray rounded bg-transparent p-2 text-white font-bold" {...register(path, { required })} />
            <button className="">

            </button>
            {required && errors[path] && <span>This field is required</span>}
        </div>
    );
};

export const PassInput: React.FC<TextInputProps> = ({ path, label, required = false , type }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="flex flex-col pb-2 w-full max-w-96">
            {label && <label className="text-gray-100 text-sm mb-0.5">{label}</label>}
            <div className="w-full flex items-center justify-between">
                <input className="w-4/5 h-12 rounded border-2 border-primary-gray bg-transparent p-2 text-white font-bold" {...register(path, {required})} />
                <button className="w- h-12 rounded border-2 border-primary-gray bg-transparent p-2">

                </button>
            </div>
            {required && errors[path] && <span>This field is required</span>}
        </div>
    );
};

type FormProps = {
    children: React.ReactNode;
    onSubmit: SubmitHandler<any>;
    schema: yup.ObjectSchema<any>;
};

const Form: React.FC<FormProps> = ({ children, onSubmit, schema }) => {
    const methods = useForm({
        resolver: yupResolver(schema),
    });

    return (
        <FormProvider {...methods}>
            <form className="w-full h-full flex flex-col items-center" onSubmit={methods.handleSubmit(onSubmit)}>
                {children}
            </form>
        </FormProvider>
    );
};

export default Form;
