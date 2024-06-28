import React from 'react';
import {useForm, SubmitHandler, useFormContext, FormProvider} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

type TextInputProps = {
    path: string;
    label?: string;
    required?: boolean;
};

export const TextInput: React.FC<TextInputProps> = ({ path, label, required = false }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div>
            {label && <label>{label}</label>}
            <input {...register(path, { required })} />
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
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {children}
                <input type="submit" />
            </form>
        </FormProvider>
    );
};

export default Form;
