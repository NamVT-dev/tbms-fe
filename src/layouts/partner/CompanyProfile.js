import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <button
                onClick={() => navigate("/partner/dashboard")}
                className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
                ⬅️ Quay về Dashboard
            </button>

            <h2 className="text-2xl font-bold mb-4">👤 Hồ sơ Công Ty</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-medium">Tên Công Ty</label>
                    <input
                        type="text"
                        name="companyName"
                        value={companyData.companyName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium">Mô Tả Công Ty</label>
                    <textarea
                        name="companyDescription"
                        value={companyData.companyDescription}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium">Địa Chỉ</label>
                    <input
                        type="text"
                        name="companyLocation.address"
                        value={companyData.companyLocation.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium">Email Liên Hệ</label>
                    <input
                        type="email"
                        name="contactEmail"
                        value={companyData.contactEmail}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium">Số Điện Thoại</label>
                    <input
                        type="text"
                        name="contactPhone"
                        value={companyData.contactPhone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium">Website</label>
                    <input
                        type="url"
                        name="website"
                        value={companyData.website}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Lưu Thay Đổi
                </button>
            </form>
        </div>
    );
};

export default CompanyProfile;
