import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

const TourReviews = ({ tourId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

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

  const handleEdit = (rev) => {
    setEditingId(rev._id);
    setEditContent(rev.review);
    setEditRating(rev.rating);
  };

  const handleSave = async (revId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}reviews/${revId}`,
        { review: editContent, rating: editRating }
      );
      setReviews((prev) =>
        prev.map((r) =>
          r._id === revId
            ? { ...r, review: editContent, rating: editRating }
            : r
        )
      );
      setEditingId(null);
    } catch (err) {
      alert("Cập nhật đánh giá thất bại!");
    }
  };

  const handleDelete = async (revId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/${revId}`);
      setReviews((prev) => prev.filter((r) => r._id !== revId));
    } catch (err) {
      alert("Xóa đánh giá thất bại!");
    }
  };

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
              className={`border rounded-lg p-4 shadow-sm ${
                editingId === rev._id
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-yellow-500 text-lg">
                  {"⭐".repeat(rev.rating)}
                </div>
                <span className="text-gray-600 text-sm ml-2 italic">
                  {rev.user?.name || "Người dùng ẩn danh"}
                </span>
                {rev.user?._id === currentUser._id && editingId !== rev._id && (
                  <div className="flex gap-2">
                    <button
                      className="ml-2 text-blue-500 underline text-xs"
                      onClick={() => handleEdit(rev)}
                    >
                      Sửa
                    </button>
                    <button
                      className="ml-2 text-red-500 underline text-xs"
                      onClick={() => handleDelete(rev._id)}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
              {editingId === rev._id ? (
                <div className="mt-2 space-y-2">
                  <div className="mb-1 text-xs text-yellow-700 font-semibold">
                    Đang chỉnh sửa đánh giá của bạn
                  </div>
                  <textarea
                    className="w-full border rounded p-2"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div>
                    <label>Đánh giá: </label>
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-cyan-500 text-white px-3 py-1 rounded"
                      onClick={() => handleSave(rev._id)}
                    >
                      Lưu
                    </button>
                    <button
                      className="bg-gray-300 px-3 py-1 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 mt-2">{rev.review}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {dayjs(rev.createdAt).format("HH:mm DD/MM/YYYY")}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TourReviews;
