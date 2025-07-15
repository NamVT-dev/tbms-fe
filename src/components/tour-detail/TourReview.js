import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const TourReviews = ({ tourId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tourId) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}reviews/tour/${tourId}`
        );
        setReviews(res.data.data || []);
        setError("");
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
        setError("Không thể tải đánh giá.");
      }
    };

    fetchReviews();
  }, [tourId]);

  return (
    <div className="mt-10 border-t pt-8">
      <h2 className="text-2xl font-semibold text-cyan-700 mb-4">
        Đánh giá Tour
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {reviews.length === 0 ? (
        <p className="text-gray-500">Chưa có đánh giá nào cho tour này.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((rev) => (
            <li
              key={rev._id}
              className="border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-yellow-500 text-lg">
                  {"⭐".repeat(rev.rating)}
                </div>
                <span className="text-gray-600 text-sm ml-2 italic">
                  {rev.user?.name || "Người dùng ẩn danh"}
                </span>
              </div>
              <p className="text-gray-800 mt-2">{rev.review}</p>
              <p className="text-gray-500 text-sm mt-1">
                {dayjs(rev.createdAt).format("HH:mm DD/MM/YYYY")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TourReviews;
