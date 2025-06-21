import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";

const CompanyProfile = () => {
    const [companyData, setCompanyData] = useState({
        companyName: "",
        companyDescription: "",
        companyLocation: { address: "" },
        contactEmail: "",
        contactPhone: "",
        website: "",
        logo: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9999/api/auth/profile",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    const user = data.data.user;

                    setCompanyData((prev) => ({
                        ...prev,
                        ...user,
                        companyLocation: {
                            ...prev.companyLocation,
                            ...user.companyLocation,
                        },
                    }));
                } else {
                    alert("Lỗi tải profile: " + data.message);
                }
            } catch (error) {
                console.error("Lỗi tải profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "companyLocation.address") {
            setCompanyData((prev) => ({
                ...prev,
                companyLocation: {
                    ...prev.companyLocation,
                    address: value,
                },
            }));
        } else {
            setCompanyData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:9999/api/auth/update/profile",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(companyData),
                }
            );

            const data = await response.json();
            if (response.ok) {
                alert("Cập nhật thành công!");
            } else {
                alert("Lỗi cập nhật profile: " + data.message);
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-gray-900 text-white">
                <Sidebar />
            </div>

            <div className="flex-1">
                <Header />
                <div className="p-10">
                    <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-xl mx-auto">
                        <button
                            onClick={() => navigate("/partner/dashboard")}
                            className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                        >
                            ⬅️ Quay về Dashboard
                        </button>

                        <h2 className="text-3xl font-bold text black mb-6">
                            👤 Hồ sơ Công Ty
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium mb-1">
                                    Tên Công Ty
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={companyData.companyName}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">
                                    Mô Tả Công Ty
                                </label>
                                <textarea
                                    name="companyDescription"
                                    value={companyData.companyDescription}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px]"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">
                                    Địa Chỉ
                                </label>
                                <input
                                    type="text"
                                    name="companyLocation.address"
                                    value={companyData.companyLocation.address}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">
                                    Email Liên Hệ
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={companyData.contactEmail}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">
                                    Số Điện Thoại
                                </label>
                                <input
                                    type="text"
                                    name="contactPhone"
                                    value={companyData.contactPhone}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={companyData.website}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                            >
                                💾 Lưu Thay Đổi
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
