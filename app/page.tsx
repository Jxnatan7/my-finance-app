'use client'

import React from "react";
import { ReactSVG } from 'react-svg'

const Layout = ( { children }: { children: React.ReactNode} ) => {
    return (
        <main className="flex items-center justify-center h-screen m-0">
            <div className="w-full h-full max-w-custom bg-primary-dark flex justify-center">
                {children}
            </div>
        </main>
    )
}

const Logo = () => {
    return (
        <div className="mt-40">
            <ReactSVG src="my-finance-logo.svg" />
        </div>
    )
}

export default function Home() {
    return (
        <Layout>
            <Logo/>
        </Layout>
    );
}
