import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {WalletService} from "@/src/service/api/WalletService";
import {TransactionService} from "@/src/service/api/TransactionService";

export function useBoolean(init = false) {
    const [bool, setter] = useState(init)
    return {
        bool,
        toggle: () => {
            setter(b => !b)
        },
        truly: () => {
            setter(true)
        },
        falsy: () => {
            setter(false)
        }
    }
}

export function useWallets() {
    return useQuery({
        queryKey: ['wallets'],
        queryFn: () => WalletService.findAll()
    });
}

export function useWallet(walletId: number) {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: () => WalletService.find(walletId)
    });
}

export function useTransactions(walletId: number) {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: () => TransactionService.findAll(walletId)
    });
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { RegisterOptions, useFormContext, useFormState, useWatch } from 'react-hook-form'
import { get, isEqual } from 'lodash'
import { useAsyncCatcher, useBoolean, useErrorToast, useSuccessToast } from 'hook'
import { useTranslation } from 'locale'
import Form from './Provider'

// FIELD PROPS

export function useFormErrors(path) {
    const { errors } = useFormState()
    return get(errors, path)
}

export function useHelperText(path) {
    const error = useFormErrors(path)
    const { t } = useTranslation()
    if (error) return { helperText: t(error.message) }
    return null
}

export const useFormOptions = () => Form.useCtx()[0]
export const useFormSetting = () => Form.useCtx()[1]

export function usePathTranslation(path) {
    const { t } = useTranslation()
    const { unpath } = useFormOptions()
    if (!path) return { label: '', placeholder: '' }
    // remove numbers from the path
    const p = path
        .split('.')
        .filter(s => isNaN(s) && !unpath.includes(s))
        .join('.')
    return {
        label: t(`form.${p}.label`),
        placeholder: t(`form.${p}.placeholder`)
    }
}

export function useFieldProps(path: string, options: RegisterOptions = { required: false }) {
    const { register } = useFormContext()
    const { disable, disabled } = useFormOptions()
    return {
        ...register(path, options),
        ...usePathTranslation(path),
        ...useHelperText(path),
        disabled: disabled || disable.includes(path)
    }
}

export const useAsyncSelectProps = ({ path, register = undefined, ...rest }) => {
    const { disabled = rest.disabled, ...props } = useFieldProps(path, register)
    return {
        ...props,
        customProperties: { disabled }
    }
}

export function useValue(path) {
    const { getValues } = useFormContext()
    return getValues(path)
}

export function useWatchField(path) {
    const initial = useValue(path)
    const [value, setValue] = useState(initial)
    const watched = useWatch({ name: path })
    useEffect(() => {
        setValue(watched)
    }, [watched])
    return value
}

export const useIsDirtyField = path => {
    const { formState } = useFormContext()
    const initial = formState.defaultValues[path]
    const value = useWatchField(path)
    const { bool: dirty, truly } = useBoolean()
    useEffect(() => {
        if (value && !isEqual(initial, value)) truly()
    }, [value])
    return dirty
}

// FIELD EVENTS

export const useOnChangeSelectIdName = path => {
    const { setValue } = useFormContext()
    const field = useWatchField(path)
    const [value, update] = useState(field?.label || '')
    useEffect(() => { update(field?.label || '') }, [field])
    return {
        value,
        onChange: e => {
            if (e?.target) return
            if (!e) return setValue(path, null)
            setValue(path, {
                value: e.id,
                label: e.name
            })
        }
    }
}

export function useOnDataChange(path, initial = '') {
    const { getValues, setValue } = useFormContext()
    const field = () => get(getValues(), path, initial)
    const [value, update] = useState(field())
    useEffect(() => {
        if (field()) update(v => (!isEqual(v, field()) ? field() : v))
    }, [field()])
    useEffect(() => {
        update(v => {
            if (v && !isEqual(v, field())) setValue(path, v)
            return v
        })
    }, [value])
    return useMemo(() => [value, update], [value, update])
}

export function useOnChangeCheck(path) {
    const { setValue } = useFormContext()
    const onChange = useCallback(
        e => {
            const v = e?.target?.checked
            setValue(path, v)
        },
        [path]
    )
    return { checked: !!useWatchField(path), onChange }
}

export function useOnChangeSelect(path) {
    const { setValue } = useFormContext()
    return {
        value: useWatchField(path) || '',
        onChange: useCallback(
            e => {
                const v = e !== null ? e.target?.value || '' : ''
                setValue(path, v)
            },
            [path]
        )
    }
}

export const useIdsNotIn = (path, key) => {
    const [idsNotIn, avoid] = useState([])
    const field = useWatchField(path)
    useEffect(() => {
        const value = key ? field?.[key] : field
        if (!value) return avoid([])
        avoid(Array.isArray(value) ? value : [value])
    }, [field])
    return idsNotIn
}

interface FormSubmitOptions {
    redirect, invalidate, callback: (response, form) => void
}

export const useFormSubmit = (fetch, { callback = () => { } }: FormSubmitOptions = {} as FormSubmitOptions) => {
    const succeed = useSuccessToast()
    const fail = useErrorToast()
    const [submitted, setsubmitted] = useState(false)
    const submit = useAsyncCatcher(
        async form => {
            const res = await fetch(form)
            setsubmitted(true)
            succeed()
            if (callback) callback(res, form)
            return res
        },
        () => fail()
    )
    return { ...submit, submitted: !!(submit.loading || submitted) }
}
