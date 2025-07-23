import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";
import DatePicker from "react-multi-date-picker";


import "react-multi-date-picker/styles/layouts/prime.css";

const CreateTour = () => {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    maxGroupSize: "",
    price: "",
    priceDiscount: "",
    summary: "",
    description: "",
    imageCover: "",
    images: [],
    startLocation: {
      address: "",
      description: "",
    },
    startDates: [],
    status: "pending",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [dates, setDates] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);

  const navigate = useNavigate();


  const validateForm = () => {
    const {
      name,
      duration,
      maxGroupSize,
      price,
      priceDiscount,
      summary,
      description,
      startLocation,
    } = formData;

    if (!name.trim()) return "Tên tour không được để trống";
    if (duration <= 0) return "Thời gian phải lớn hơn 0";
    if (maxGroupSize <= 0) return "Số lượng tối đa phải lớn hơn 0";
    if (price <= 0) return "Giá phải lớn hơn 0";
    if (priceDiscount < 0 || priceDiscount > 100)
      return "Giảm giá phải từ 0 đến 100%";
    if (!summary.trim()) return "Vui lòng nhập tóm tắt tour";
    if (!description.trim()) return "Vui lòng nhập mô tả tour";
    if (!coverFile) return "Vui lòng chọn ảnh bìa";
    if (dates.length === 0) return "Vui lòng chọn ít nhất một ngày khởi hành";
    if (!startLocation.address.trim())
      return "Vui lòng chọn địa điểm xuất phát";
    return null;
  };

  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.priceDiscount) || 0;
    const discounted = price - (price * discount) / 100;
    setFinalPrice(discounted > 0 ? discounted : 0);
  }, [formData.price, formData.priceDiscount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "address" || name === "descriptionStart") {
      setFormData((prev) => ({
        ...prev,
        startLocation: {
          ...prev.startLocation,
          [name === "address" ? "address" : "description"]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== "startLocation" &&
          key !== "imageCover" &&
          key !== "images" &&
          key !== "startDates"
        ) {
          form.append(key, value);
        }
      });

      form.append("startLocation[address]", formData.startLocation.address);
      form.append(
        "startLocation[description]",
        formData.startLocation.description
      );

      dates.forEach((date, index) => {
        form.append(`startDates[${index}]`, date.toDate().toISOString());
      });

      if (coverFile) form.append("imageCover", coverFile);
      imageFiles.forEach((file) => form.append("images", file));

      const res = await fetch("http://localhost:9999/tours/create", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Tạo tour thành công!");
        navigate("/partner/tours");
      } else {
        alert(data.message || "Lỗi tạo tour");
      }
    } catch (error) {
      console.error("Lỗi gửi form:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Header />
        <div className="p-10">
          <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
              ✨ Tạo Tour Mới
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <input
                name="name"
                onChange={handleChange}
                placeholder="Tên tour"
                className={inputClass}
                required
              />
              <input
                type="number"
                name="duration"
                placeholder="Thời gian (ngày)"
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                type="number"
                name="maxGroupSize"
                placeholder="Số lượng tối đa"
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                name="price"
                onChange={handleChange}
                type="number"
                placeholder="Giá (VND)"
                className={inputClass}
                required
              />
              <input
                name="priceDiscount"
                onChange={handleChange}
                type="number"
                placeholder="Giảm giá (%)"
                className={inputClass}
              />
              <input
                name="address"
                onChange={handleChange}
                placeholder="Địa chỉ xuất phát"
                className={inputClass}
              />
              <input
                name="descriptionStart"
                onChange={handleChange}
                placeholder="Mô tả địa điểm xuất phát"
                className={inputClass}
              />
             <div className="flex flex-col">
                <label className="text-sm text-gray-600">Ảnh bìa</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setCoverFile(file);
                    if (file) {
                      setFormData((prev) => ({
                        ...prev,
                        imageCover: URL.createObjectURL(file),
                      }));
                    }
                  }}
                />
                {formData.imageCover && (
                  <img
                    src={formData.imageCover}
                    alt="Ảnh bìa preview"
                    className="w-48 h-32 object-cover rounded-lg shadow-md mt-2"
                  />
                )}
              </div>

                     <div className="flex flex-col">
                <label className="text-sm text-gray-600">Ảnh phụ (nhiều)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImageFiles(files);
                    const previews = files.map((file) => URL.createObjectURL(file));
                    setFormData((prev) => ({
                      ...prev,
                      images: previews,
                    }));
                  }}
                />
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {formData.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Ảnh phụ ${i + 1}`}
                        className="w-24 h-20 object-cover rounded-lg shadow"
                      />
                    ))}
                  </div>
                )}
              </div>

             
              <textarea
                name="summary"
                onChange={handleChange}
                placeholder="Tóm tắt tour"
                className={`${textareaClass} md:col-span-2`}
                required
              />
              <textarea
                name="description"
                onChange={handleChange}
                placeholder="Mô tả chi tiết"
                className={`${textareaClass} md:col-span-2`}
                required
              />
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-2 block">
                  Ngày khởi hành
                </label>
                <div className="bg-white p-4 rounded-xl shadow w-fit">
                  <DatePicker
                    open={true}
                    value={dates}
                    onChange={setDates}
                    multiple
                    format="YYYY-MM-DD"
                    calendarPosition="bottom-center"
                    className="rmdp-prime custom-calendar"
                    style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc", fontSize: "16px" }}
                  />

                </div>
              </div>

              <div className="md:col-span-2 text-right text-indigo-700 font-medium">
                💸 Giá sau giảm:{" "}
                <strong>{finalPrice.toLocaleString()} VND</strong>
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                >
                  🚀 Tạo Tour
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/partner/dashboard")}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
                >
                  🔙 Về Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTour;

const inputClass =
  "w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-sm";
const textareaClass =
  "w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-sm min-h-[120px]";


