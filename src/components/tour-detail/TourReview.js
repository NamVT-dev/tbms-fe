import React from "react";
import dayjs from "dayjs";

const TourReviews = ({ reviews = [] }) => {
  return (
    <div className="mt-10 border-t pt-8">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4">
        Đánh giá từ khách hàng
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">
          Chưa có đánh giá nào cho tour này.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-cyan-700">
                  {r.user?.name}
                </span>
                <span className="text-yellow-600 font-semibold">
                  ★ {r.rating}/5
                </span>
              </div>
              <p className="text-gray-800">{r.review}</p>
              <p className="text-xs text-gray-400 mt-1">
                {dayjs(r.createdAt).format("HH:mm DD/MM/YYYY")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TourReviews;
