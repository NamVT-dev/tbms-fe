import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";

import "react-quill/dist/quill.snow.css";

const EditTour = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    maxGroupSize: "",
    difficulty: "easy",
    price: "",
    priceDiscount: "",
    summary: "",
    description: "",
    imageCover: "",
    status: "pending",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9999/tours/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setFormData(data.data.tour);
        } else {
          alert("Lỗi tải thông tin tour!");
        }
      } catch (error) {
        console.error("Lỗi tải tour:", error);
      }
    };

    fetchTourDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.status === "active") {
        formData.status = undefined;
      }
      const response = await fetch(`http://localhost:9999/tours/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        alert("Cập nhật tour thành công!");
        navigate("/partner/tours");
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật tour:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600">
        ✏️ Chỉnh Sửa Tour
      </h2>

      {/* Hiển thị ảnh hiện tại */}
      {formData.imageCover && (
        <div className="text-center my-4">
          <img
            src={formData.imageCover}
            alt="Ảnh Tour"
            className="w-40 h-28 rounded-lg mx-auto shadow-md"
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Tên Tour */}
        <div>
          <label className="text-gray-700 font-semibold">Tên Tour</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Thời gian */}
        <div>
          <label className="text-gray-700 font-semibold">
            Thời gian (ngày)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            min="1"
            required
          />
        </div>

        {/* Số lượng khách */}
        <div>
          <label className="text-gray-700 font-semibold">
            Số lượng khách tối đa
          </label>
          <input
            type="number"
            name="maxGroupSize"
            value={formData.maxGroupSize}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            min="1"
            required
          />
        </div>

        {/* Trạng thái Tour */}
        <div>
          <label className="text-gray-700 font-semibold">Trạng thái Tour</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="pending">Chờ duyệt</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        {/* Giá */}
        <div>
          <label className="text-gray-700 font-semibold">Giá (VND)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            min="0"
            required
          />
        </div>

        {/* Giảm giá */}
        <div>
          <label className="text-gray-700 font-semibold">Giảm giá (%)</label>
          <input
            type="number"
            name="priceDiscount"
            value={formData.priceDiscount}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            min="0"
            max="100"
          />
        </div>

        {/* Tóm tắt */}
        <div className="col-span-2">
          <label className="text-gray-700 font-semibold">Tóm tắt tour</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Mô tả chi tiết */}
        <ReactQuill
          id="tourDescription"
          className="md:col-span-2 mb-20"
          theme="snow"
          placeholder="Nhập mô tả chi tiết tour tại đây..."
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              description: value,
            }))
          }
        />

        <div className="col-span-2 flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/partner/tours")}
            className="flex-1 bg-gray-600 text-white font-bold p-3 rounded-lg hover:bg-gray-700 transition"
          >
            🔙 Trở Về
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition"
          >
            ✔️ Cập Nhật Tour
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTour;
