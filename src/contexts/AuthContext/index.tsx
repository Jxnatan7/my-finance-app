'use client'

import {createContext, ReactNode, useState} from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import {api} from "@/src/service/api/http";

type AuthContextData = {
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (credentials: SignUpProps) => Promise<void>;
    logoutUser: () => Promise<void>;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData)

export const myFinanceToken = "@my-finance.token";

export function signOut() {
    destroyCookie(null, myFinanceToken, { path: "/" })
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [token] = useState(() => {
        const { "@my-finance.token": myFinanceToken } = parseCookies();
        return myFinanceToken;
    });
    const isAuthenticated = !!token;

    async function signIn({ email, password }: SignInProps) {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        const token = response.data.token;

        setCookie(undefined, myFinanceToken, token, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/"
        });

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    async function signUp({ name, email, password }: SignUpProps) {
        await api.post("/auth/register", {
            name,
            email,
            password
        })
    }

    async function logoutUser() {
        destroyCookie(null, myFinanceToken, { path: "/" });
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                signIn,
                signUp,
                logoutUser
            }}>
            {children}
        </AuthContext.Provider>
    )
}