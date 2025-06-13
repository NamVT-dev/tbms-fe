import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTour = () => {
    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        maxGroupSize: "",
        price: "",
        priceDiscount: "",
        summary: "",
        description: "",
        imageCover: "",
        startLocation: {
            address: "",
            description: "",
        },
        status: "pending",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:9999/api/tours/create",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (response.ok) {
                alert("Tour đã được tạo thành công!");
                navigate("/partner/tours");
            } else {
                alert(data.message || "Tạo tour thất bại!");
            }
        } catch (error) {
            console.error("Lỗi tạo tour:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-blue-600">
                Tạo Tour Mới
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Tên Tour..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="duration"
                    placeholder="Thời gian (ngày)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Giá (VND)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Mô tả chi tiết..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                    required
                ></textarea>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Tạo Tour ✨
                </button>
            </form>
            <button
                onClick={() => navigate("/partner/dashboard")}
                className="mt-4 w-full bg-gray-600 text-white font-bold p-3 rounded-lg hover:bg-gray-700 transition"
            >
                🔙 Về Dashboard
            </button>
        </div>
    );
};

export default CreateTour;
