import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";

const PartnerTour = () => {
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("http://localhost:9999/tours/partner", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

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
      const response = await fetch(`http://localhost:9999/tours/${tourId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

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

  const formatPrice = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Header />
        <div className="p-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">
            📋 Danh Sách Tour Của Bạn
          </h2>

          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <input
              type="text"
              placeholder="🔎 Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {sortOrder === "asc" ? "⬆️ Giá tăng dần" : "⬇️ Giá giảm dần"}
            </button>
            <button
              onClick={() => navigate("/partner/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              🔙 Về Dashboard
            </button>
          </div>

          <div className="overflow-auto rounded-xl shadow bg-white">
            <table className="w-full text-sm text-center">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-3 py-2">STT</th>
                  <th className="px-3 py-2">Tên Tour</th>
                  <th className="px-3 py-2">Thời Gian</th>
                  <th className="px-3 py-2">Nhóm</th>
                  <th className="px-3 py-2">Giá</th>
                  <th className="px-3 py-2">Điểm Bắt Đầu</th>
                  <th className="px-3 py-2">Ảnh</th>
                  <th className="px-3 py-2">Trạng Thái</th>
                  <th className="px-3 py-2">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((tour, index) => (
                  <tr key={tour._id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="font-semibold text-blue-800">{tour.name}</td>
                    <td>{tour.duration} ngày</td>
                    <td>{tour.maxGroupSize} người</td>
                    <td className="text-green-700 font-medium">
                      {formatPrice(tour.price)}
                    </td>
                    <td>{tour.startLocation?.address || "Không có"}</td>
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
                        className={`px-2 py-1 rounded text-white text-xs font-medium ${
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
                            navigate(`/partner/tours/edit/${tour._id}`)
                          }
                          className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 rounded text-white"
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
                    <td colSpan="11" className="py-6 text-gray-500">
                      Không tìm thấy tour nào.
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

export default PartnerTour;
