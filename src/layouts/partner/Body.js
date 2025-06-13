import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Body = () => {
    const [tours, setTours] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9999/api/tours/partner",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setTours(data.data.tours);
                } else {
                    console.error("Lỗi lấy danh sách tour:", data.message);
                }
            } catch (error) {
                console.error("Lỗi tải tour:", error);
            }
        };

        fetchTours();
    }, []);

    const activeTours = tours.filter((tour) => tour.status === "active").length;
    const pendingTours = tours.filter(
        (tour) => tour.status === "pending"
    ).length;

    return (
        <div className="max-w-7xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-4xl font-bold text-center text-blue-600">
                📌 Quản Lý Tour Du Lịch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Tổng số tour */}
                <div className="p-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl shadow-lg text-center">
                    <h5 className="text-blue-700 font-semibold text-lg uppercase">
                        Tổng số tour
                    </h5>
                    <h3 className="text-4xl font-bold text-gray-800">
                        {tours.length} tour
                    </h3>
                </div>

                {/* Tour đang hoạt động */}
                <div className="p-6 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl shadow-lg text-center">
                    <h5 className="text-lg uppercase">Tour đang hoạt động</h5>
                    <h3 className="text-4xl font-bold">{activeTours} tour</h3>
                </div>

                {/* Tour đang chờ duyệt */}
                <div className="p-6 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-800 rounded-xl shadow-lg text-center">
                    <h5 className="text-lg uppercase">Tour đang chờ duyệt</h5>
                    <h3 className="text-4xl font-bold">{pendingTours} tour</h3>
                </div>
            </div>

            {/* Tour nổi bật */}
            <h3 className="text-3xl font-bold text-center mt-10 text-gray-700">
                🏆 Tour Nổi Bật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                {tours.slice(0, 3).map((tour) => (
                    <div
                        key={tour._id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform"
                    >
                        <img
                            src={
                                tour.imageCover ||
                                "https://via.placeholder.com/400"
                            }
                            alt="Ảnh Tour"
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                            <h4 className="font-bold text-xl text-blue-700">
                                {tour.name}
                            </h4>
                            <p className="text-gray-600">
                                ⏳ {tour.duration} ngày • 💰 {tour.price} VND
                            </p>
                            <p className="text-gray-500">
                                📍{" "}
                                {tour.startLocation?.address ||
                                    "Không có thông tin"}
                            </p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-white text-sm mt-3 ${
                                    tour.status === "active"
                                        ? "bg-green-500"
                                        : tour.status === "pending"
                                        ? "bg-yellow-400"
                                        : "bg-gray-500"
                                }`}
                            >
                                {tour.status === "active"
                                    ? "Hoạt động"
                                    : tour.status === "pending"
                                    ? "Chờ duyệt"
                                    : "Không hoạt động"}
                            </span>
                            <button
                                onClick={() =>
                                    navigate(`/partner/tours/edit/${tour._id}`)
                                }
                                className="mt-5 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                ✏️ Chỉnh Sửa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Body;
