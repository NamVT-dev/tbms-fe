import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [openTourMenu, setOpenTourMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="w-64 h-screen bg-gray-900 text-white p-6 shadow-lg">
            <h4 className="text-xl font-bold mb-6">Partner Dashboard</h4>

            <nav className="space-y-3">
                <a
                    href="/partner/dashboard"
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                    📊 Dashboard
                </a>

                <button
                    onClick={() => setOpenTourMenu(!openTourMenu)}
                    className="w-full text-left px-4 py-2 flex justify-between rounded hover:bg-gray-700 transition"
                >
                    🏕️ Quản lý Tour <span>{openTourMenu ? "▲" : "▼"}</span>
                </button>

                {openTourMenu && (
                    <div className="ml-5 space-y-2">
                        <a
                            href="/partner/tours/create"
                            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                        >
                            ➕ Tạo Tour mới
                        </a>
                        <a
                            href="/partner/tours"
                            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                        >
                            📜 Danh sách Tour
                        </a>
                    </div>
                )}

                <a
                    href="/partner/tours/bookinglist"
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                    📅 Đơn đặt Tour
                </a>

                <a
                    href="/partner/profile"
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                    👤 Hồ sơ Công Ty
                </a>
                <a
                    href="/settings"
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                    ⚙️ Settings
                </a>

                <button
                    onClick={handleLogout}
                    className="mt-6 w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 transition"
                >
                    🔐 Đăng Xuất
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
