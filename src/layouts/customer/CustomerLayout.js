import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header";

const CustomerLayout = () => {
    return (
        <>
            <Header />
            <main className="pt-16 px-4">
                <Outlet />
            </main>
        </>
    );
};

export default CustomerLayout;
