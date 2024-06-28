import React from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className="bg-rose-950 w-full h-screen flex justify-center">
            <main className="w-4/5 h-full">
                <Header/>
                <section>
                    {children}
                </section>
                <Footer/>
            </main>
        </div>
    )
}

export default Layout;