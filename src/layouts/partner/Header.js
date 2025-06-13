import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="bg-blue-600 text-white py-4 shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
                <button
                    onClick={() => navigate("/partner/dashboard")}
                    className="text-xl font-bold hover:text-blue-300 transition"
                >
                    Partner Dashboard
                </button>
            </div>
        </header>
    );
};

export default Header;
