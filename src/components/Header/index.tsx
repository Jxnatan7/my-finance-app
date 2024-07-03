import React from "react";
import Logo from "@/src/components/Logo";

type HeaderProps = {
    children: React.ReactNode;
}
const Header = ({ children, ...props }: HeaderProps) => {
    return (
        <header className="w-full">
            {children}
        </header>
    )
}

export default Header;