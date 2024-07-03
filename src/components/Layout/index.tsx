import React from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Logo from "@/src/components/Logo";

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className="bg-primary-dark w-full h-screen flex justify-center">
            <main className="w-4/5 h-full flex flex-col items-center">
                <Header>
                    <Logo/>
                </Header>
                <div className="w-full h-full flex flex-col items-center">
                    {children}
                </div>
                <Footer/>
            </main>
        </div>
    )
}

export default Layout;