import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:9999/bookings/partner", {
          method: "GET",
          credentials: "include",
        });

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
    (booking) => filterStatus === "All" || booking.paid === filterStatus
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Header />
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Danh Sách Đơn Đặt Tour
          </h2>

          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {[
              { label: "Tất cả", value: "All" },
              { label: "Đã thanh toán", value: true },
              { label: "Chưa thanh toán", value: false },
            ].map(({ label, value }) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                  filterStatus === value
                    ? value
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setFilterStatus(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="overflow-auto rounded-xl shadow bg-white">
            <table className="w-full text-sm text-center">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-3 py-2">STT</th>
                  <th className="px-3 py-2">Khách hàng</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Tên Tour</th>
                  <th className="px-3 py-2">Giá</th>
                  <th className="px-3 py-2">Ngày đặt</th>
                  <th className="px-3 py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td>{booking.user?.name || "-"}</td>
                    <td>{booking.user?.email || "-"}</td>
                    <td>{booking.tour?.name || "-"}</td>
                    <td className="text-green-700 font-medium">
                      {booking.price?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || "0 VND"}
                    </td>
                    <td>
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-md text-white text-xs font-medium ${
                          booking.paid ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {booking.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-6 text-gray-500">
                      Không có đơn đặt tour nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
