// components/Layout.tsx
import React from 'react';
import Header from "@/app/components/chatPages/Header/Header";
import Footer from "@/app/components/chatPages/Footer/Footer";
import { usePathname } from 'next/navigation';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const pathname = usePathname();
    const excludedRoutes = ["/login", "/signup"];
    const isExcludedRoute = excludedRoutes.includes(pathname);
    
    return (
        <div>
            {!isExcludedRoute && <Header />}
            <main>{children}</main>
            {!isExcludedRoute && <Footer />}
        </div>
    );
};

export default Layout;
