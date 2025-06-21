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
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h2 className="text-4xl font-bold text-center text-primary mb-10">
                <span role="img" aria-label="pin">
                    📌
                </span>{" "}
                <span className="text-gray-800">Quản Lý Tour Du Lịch</span>
            </h2>

            {/* Tổng quan tour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow h-full text-center">
                    <h5 className="text-sm font-medium text-gray-500 uppercase">
                        Tổng số tour
                    </h5>
                    <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                        {tours.length} tour
                    </h3>
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow h-full text-center">
                    <h5 className="text-sm font-medium text-green-700 uppercase">
                        Tour đang hoạt động
                    </h5>
                    <h3 className="text-3xl font-bold text-green-700 mt-2">
                        {activeTours} tour
                    </h3>
                </div>

                <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6 shadow h-full text-center">
                    <h5 className="text-sm font-medium text-yellow-700 uppercase">
                        Tour đang chờ duyệt
                    </h5>
                    <h3 className="text-3xl font-bold text-yellow-700 mt-2">
                        {pendingTours} tour
                    </h3>
                </div>
            </div>

            {/* Tour nổi bật */}
            <h3 className="text-2xl font-semibold text-gray-800 mt-12 mb-6 text-center">
                <span role="img" aria-label="trophy">
                    🏆
                </span>{" "}
                Tour Nổi Bật
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.slice(0, 3).map((tour) => (
                    <div
                        key={tour._id}
                        className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col"
                    >
                        <img
                            src={
                                tour.imageCover ||
                                "https://via.placeholder.com/400"
                            }
                            alt="Ảnh Tour"
                            className="w-full h-52 object-cover"
                        />
                        <div className="p-5 flex flex-col flex-grow">
                            <h4 className="font-semibold text-base text-indigo-700">
                                {tour.name}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                                ⏳ {tour.duration} ngày • 💰{" "}
                                {tour.price.toLocaleString()} VND
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                📍{" "}
                                {tour.startLocation?.address ||
                                    "Không có thông tin"}
                            </p>
                            <span
                                className={`mt-3 inline-block w-fit px-3 py-1 text-xs font-medium rounded-full ${
                                    tour.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : tour.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-600"
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
                                className="mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
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
