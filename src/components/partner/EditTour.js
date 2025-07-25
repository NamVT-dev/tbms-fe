import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";

import "react-quill/dist/quill.snow.css";
import DatePicker from "react-multi-date-picker";

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
    images: [],
    status: "pending",
    startDates: [],
  });

  const [previewCover, setPreviewCover] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const form = new FormData();
    try {
      setIsLoading(true);
      if (formData.status === "active") {
        formData.status = undefined;
      }
      form.append("name", formData.name);
      form.append("duration", formData.duration);
      form.append("maxGroupSize", formData.maxGroupSize);
      form.append("price", formData.price);
      form.append("summary", formData.summary);
      form.append("description", formData.description);
      form.append("imageCover", formData.imageCover);
      for (let i = 0; i < formData.images.length; i++) {
        form.append("images", formData.images[i]);
      }
      formData.startDates?.forEach((date) => form.append("startDates", date));

      const response = await fetch(`http://localhost:9999/tours/${id}`, {
        method: "PATCH",
        body: form,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600">
        ✏️ Chỉnh Sửa Tour
      </h2>

      {/* Hiển thị ảnh hiện tại */}
      {previewCover && (
        <div className="text-center my-4">
          <img
            src={previewCover}
            alt="Ảnh Tour"
            className="w-40 h-28 rounded-lg mx-auto shadow-md"
          />
        </div>
      )}

      {previewImages && previewImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 my-4">
          {previewImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Ảnh phụ ${idx + 1}`}
              className="w-full h-28 object-cover rounded shadow-md"
            />
          ))}
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
          <input
            type="text"
            name="status"
            value={
              formData.status === "active"
                ? "Đang hoạt động"
                : formData.status === "pending"
                  ? "Đang chờ phê duyệt"
                  : "Không hoạt động"
            }
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
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
            min="20000"
            max="99999999"
            required
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

        {/* Ảnh bìa */}
        <div className="col-span-2">
          <label className="text-gray-700 font-semibold">
            Cập nhật ảnh chính
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && !file.type.startsWith("image/")) {
                alert("Chỉ chấp nhận ảnh!");
                return;
              }
              if (file) {
                // Hiển thị ảnh preview
                const imageUrl = URL.createObjectURL(file);
                setPreviewCover(imageUrl);
                setFormData((prev) => ({
                  ...prev,
                  imageCover: file,
                }));
              }
            }}
            className="w-full mt-2"
          />
        </div>

        {/* Ảnh phụ */}
        <div className="col-span-2">
          <label className="text-gray-700 font-semibold">
            Cập nhật ảnh phụ
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const validImages = files.filter((f) =>
                f.type.startsWith("image/")
              );
              if (validImages.length !== files.length) {
                alert("Một số file không phải ảnh đã bị loại bỏ.");
              }
              const imageURLs = validImages.map((file) =>
                URL.createObjectURL(file)
              );

              setPreviewImages(imageURLs);

              setFormData((prev) => ({
                ...prev,
                images: files,
              }));
            }}
            className="w-full mt-2"
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
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600 mb-2 block">
            Ngày khởi hành (có thể chọn nhiều)
          </label>
          <div className="relative w-full">
            <DatePicker
              value={formData.startDates}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  startDates: value,
                }))
              }
              onlyCalendar
              multiple
              format="YYYY-MM-DD"
              minDate={new Date()}
              containerClassName="w-full"
              inputClass="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        </div>

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
            disabled={isLoading}
          >
            {!isLoading ? "✔️ Cập Nhật Tour" : "Đang lưu..."}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTour;
