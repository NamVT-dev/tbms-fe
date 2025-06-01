import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";

const PartnerDashboard = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <Header />
                <Body />
                <Footer />
            </div>
        </div>
    );
};

export default PartnerDashboard;
