import React, { useState, useEffect } from "react";

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9999/api/bookings/partner",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setBookings(data.data.bookings);
                } else {
                    alert("Lỗi lấy danh sách booking: " + data.message);
                }
            } catch (error) {
                console.error("Lỗi lấy booking:", error);
            }
        };

        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(
        (booking) => filterStatus === "all" || booking.status === filterStatus
    );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
                🗕️ Đơn Đặt Tour
            </h2>

            <div className="flex justify-center space-x-2 mb-6">
                {[
                    { label: "Tất cả", value: "all" },
                    { label: "Chờ duyệt", value: "pending" },
                    { label: "Đã xác nhận", value: "confirmed" },
                    { label: "Đã hủy", value: "cancelled" },
                ].map(({ label, value }) => (
                    <button
                        key={value}
                        className={`px-4 py-2 border rounded-md ${
                            filterStatus === value
                                ? value === "pending"
                                    ? "bg-yellow-500 text-white"
                                    : value === "confirmed"
                                    ? "bg-green-500 text-white"
                                    : value === "cancelled"
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-800 text-white"
                                : "bg-gray-200"
                        }`}
                        onClick={() => setFilterStatus(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Bảng danh sách booking */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">
                                #
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Khách hàng
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Email
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Tên Tour
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Giá
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Ngày đặt
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">
                                    {index + 1}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {booking.customer?.name || "-"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {booking.customer?.email || "-"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {booking.tour?.name || "-"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-green-500">
                                    {booking.price?.toLocaleString() || 0} VND
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {booking.bookedAt
                                        ? new Date(
                                              booking.bookedAt
                                          ).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded-md text-white ${
                                            booking.status === "confirmed"
                                                ? "bg-green-500"
                                                : booking.status === "pending"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingList;
