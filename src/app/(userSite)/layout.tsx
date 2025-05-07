import { type ReactNode } from "react";
import Footer from "../_components/nav/footer";
import NavBar from "../_components/nav/mainNavbar";

export default function UserLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <NavBar />
            <div className="min-h-svh w-full flex flex-col md:pt-16 pt-12">
                {children}
                <Footer />
            </div>
        </>
    )
}
