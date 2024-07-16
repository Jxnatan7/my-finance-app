import {useState} from "react";

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

export function useWallets(userId: number) {

}