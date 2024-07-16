import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useFieldProps, useWatchField } from '../hooks'
import {TextInputProps} from "@/src/components/Form";

const toCurrency = v => parseFloat(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const toDouble = v => {
    const number = Number(v)
    if (!isNaN(number)) return number
    return typeof v === 'number' ? v : Number(v.replace(/[^0-9]+/g, '')) / 100
}

const useElementEvent = (type, handle = e => { }, element = null) => {
    const ref = useRef(element)
    useEffect(() => {
        const { current } = ref
        if (!current) return
        current.addEventListener(type, handle)
        return () => {
            current.removeEventListener(type, handle)
        }
    }, [ref, type, handle])
    return ref
}

const setSelectionFocus = el => position => {
    if (!el) return
    el.selectionStart = position
    el.selectionEnd = position
    el.focus()
}

const Uncontrolled = ({
                          setValue,
                          field = 0,
                          path,
                          InputCurrencyProps,
                          ...rest
                      }: TextInputProps & {
    setValue: (path: string, v: number) => void
    field?: number
    InputCurrencyProps?: unknown
}) => {
    const value = typeof field === 'number' ? toCurrency(field.toFixed(2)) : field
    const [selection, setSelection] = useState({ keyup: 0, change: 0 })
    const ref = useElementEvent('keyup', e => setSelection(s => ({ ...s, keyup: e.target.selectionStart })))
    const onChange = useCallback(
        e => {
            const { target } = e
            setSelection(s => ({ ...s, change: target.selectionStart }))
            setValue(path, toDouble(target.value))
        },
        [path]
    )
    const [, setCache] = useState(value)
    const setFocus = setSelectionFocus(ref.current)
    useEffect(() => {
        setCache(cache => {
            const { current } = ref
            const { change, keyup } = selection
            if (document.activeElement !== current) return cache
            if (keyup < 3) setFocus(3)
            if (cache !== current.value) {
                const dif = current.value.length - cache.length
                if (dif > 0) {
                    if (dif < 2) setFocus(change)
                    else setFocus(keyup + dif)
                }
                return current.value
            }
            return cache
        })
    }, [selection, setFocus])
    const p = useFieldProps(path)
    return <StyledTextInput {...p} ref={ref} value={value} onChange={onChange} {...rest} />
}

export const CurrencyInput = ({ path, ...rest }) => {
    const { setValue } = useFormContext()
    const field = useWatchField(path) || 0
    return <Uncontrolled setValue={setValue} field={field} path={path} {...rest} />
}

CurrencyInput.Uncontrolled = Uncontrolled
CurrencyInput.toCurrency = toCurrency
CurrencyInput.toDouble = toDouble
