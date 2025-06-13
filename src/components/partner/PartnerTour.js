import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PartnerTour = () => {
    const [tours, setTours] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9999/api/tours/partner",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setTours(data.data.tours);
                } else {
                    alert("Lỗi lấy danh sách tour: " + data.message);
                }
            } catch (error) {
                console.error("Lỗi lấy tour:", error);
            }
        };

        fetchTours();
    }, []);

    const filteredTours = tours
        .filter((tour) =>
            tour.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            sortOrder === "asc" ? a.price - b.price : b.price - a.price
        );

    const deleteTour = async (tourId) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa tour này?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `http://localhost:9999/tours/${tourId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Xóa tour thành công!");
                setTours(tours.filter((tour) => tour._id !== tourId));
            } else {
                alert("Lỗi xóa tour: " + data.message);
            }
        } catch (error) {
            console.error("Lỗi xóa tour:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                Danh Sách Tour Của Bạn
            </h2>

            <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="🔎 Tìm kiếm theo tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    {sortOrder === "asc"
                        ? "⬆️ Giá tăng dần"
                        : "⬇️ Giá giảm dần"}
                </button>
                <button
                    onClick={() => navigate("/partner/dashboard")}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                    🔙 Về Dashboard
                </button>
            </div>

            <div className="overflow-auto rounded shadow">
                <table className="w-full text-sm text-center border-collapse bg-white">
                    <thead className="bg-blue-800 text-white text-xs uppercase">
                        <tr>
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Tên Tour</th>
                            <th className="px-3 py-2">Thời Gian</th>
                            <th className="px-3 py-2">Nhóm</th>
                            <th className="px-3 py-2">Giá Gốc</th>
                            <th className="px-3 py-2">Giá Giảm</th>
                            <th className="px-3 py-2">Điểm Bắt Đầu</th>
                            <th className="px-3 py-2">Ảnh</th>
                            <th className="px-3 py-2">Trạng Thái</th>
                            <th className="px-3 py-2">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTours.map((tour, index) => (
                            <tr
                                key={tour._id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-2 py-2">{index + 1}</td>
                                <td className="font-semibold text-blue-700">
                                    {tour.name}
                                </td>
                                <td>{tour.duration} ngày</td>
                                <td>{tour.maxGroupSize} người</td>
                                <td className="text-green-600 font-medium">
                                    {tour.price} VND
                                </td>
                                <td className="text-red-600">
                                    {tour.priceDiscount
                                        ? `${tour.priceDiscount} VND`
                                        : "Không"}
                                </td>
                                <td>
                                    {tour.startLocation?.address || "Không có"}
                                </td>
                                <td>
                                    {tour.imageCover ? (
                                        <img
                                            src={tour.imageCover}
                                            alt="Ảnh Tour"
                                            className="w-20 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        "Không ảnh"
                                    )}
                                </td>
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded text-white text-xs ${
                                            tour.status === "active"
                                                ? "bg-green-600"
                                                : tour.status === "pending"
                                                ? "bg-yellow-500"
                                                : "bg-gray-500"
                                        }`}
                                    >
                                        {tour.status === "active"
                                            ? "Hoạt động"
                                            : tour.status === "pending"
                                            ? "Chờ duyệt"
                                            : "Không hoạt động"}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/partner/tours/edit/${tour._id}`
                                                )
                                            }
                                            className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 rounded text-white"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => deleteTour(tour._id)}
                                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredTours.length === 0 && (
                            <tr>
                                <td colSpan="10" className="py-6 text-gray-500">
                                    Không tìm thấy tour nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartnerTour;
