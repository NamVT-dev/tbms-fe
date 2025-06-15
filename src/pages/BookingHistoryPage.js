import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}bookings/my`,
          { withCredentials: true }
        );
        setBookings(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Đang tải dữ liệu đặt tour...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center mt-10">Bạn chưa có đơn đặt tour nào.</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-cyan-700 mb-8">
        Lịch sử đặt tour
      </h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="border rounded-xl p-5 flex flex-col md:flex-row gap-5 shadow-sm bg-white"
          >
            {/* Hình ảnh tour */}
            <img
              src={booking.tour?.imageCover}
              alt={booking.tour?.name}
              className="w-full md:w-48 h-32 object-cover rounded-lg"
            />

            {/* Nội dung */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-cyan-800">
                {booking.tour?.name}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                <strong>Ngày khởi hành:</strong>{" "}
                {dayjs(booking.startDate).format("DD/MM/YYYY")}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <strong>Số người tham gia:</strong> {booking.numberOfPeople}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <strong>Tổng giá:</strong>{" "}
                <span className="text-orange-600 font-semibold">
                  {booking.price.toLocaleString()} đ
                </span>
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <strong>Trạng thái thanh toán:</strong>{" "}
                {booking.paid ? (
                  <span className="text-green-600 font-medium">
                    Đã thanh toán
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">
                    Chưa thanh toán
                  </span>
                )}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <strong>Ngày đặt:</strong>{" "}
                {dayjs(booking.createdAt).format("HH:mm DD/MM/YYYY")}
              </p>

              {booking.tour?.description && (
                <p className="text-sm text-gray-500 mt-3">
                  <strong>Mô tả:</strong> {booking.tour.description}
                </p>
              )}

              {/* Nếu muốn hiển thị người dùng (admin xem được) */}
              {booking.user?.name && (
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Người đặt:</strong> {booking.user.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookingHistoryPage;
