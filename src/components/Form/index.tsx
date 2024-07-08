'use client'

import React, {HTMLInputTypeAttribute, useState} from 'react';
import {useForm, SubmitHandler, useFormContext, FormProvider} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Icon} from "@iconify/react";

type TextInputProps = {
    path: string;
    label?: string;
    required?: boolean;
    type?: HTMLInputTypeAttribute;
};

const Label: React.FC<{ label?: string }> = ({ label }) => {
    return label ? <label className="text-gray-100 text-md mb-0.5">{label}</label> : null;
};

const ErrorMessage: React.FC<{ error?: boolean, path: string }> = ({ error, path }) => {
    return error ? <span className="text-rose-600 text-sm mt-1">{path} is required</span> : null;
};

const PasswordToggle: React.FC<{ onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-2/12 h-12 flex justify-center items-center rounded border-2 border-primary-gray bg-transparent p-2 active:opacity-50 transition-all duration-100"
        >
            <Icon icon='tabler:eye' fontSize={27} color='#FFF' />
        </button>
    );
};

export const TextInput: React.FC<TextInputProps> = ({ path, label, required = false, type = 'text' }) => {
    const { register, formState: { errors } } = useFormContext();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsPasswordVisible(prev => !prev);
    };

    const inputType = type === 'password' && isPasswordVisible ? 'text' : type;
    const error = required && !!errors[path];

    return (
        <div className="flex flex-col w-full max-w-96">
            <Label label={label} />
            <div className={`flex ${type === 'password' ? 'items-center justify-between' : ''}`}>
                <input
                    type={inputType}
                    className={`w-${type === 'password' ? '4/5' : 'full'} h-12 border-2 border-primary-gray rounded bg-transparent p-2 text-white font-bold`}
                    {...register(path, { required })}
                />
                {type === 'password' && <PasswordToggle onClick={togglePasswordVisibility} />}
            </div>
            <ErrorMessage error={error} path={path}/>
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
