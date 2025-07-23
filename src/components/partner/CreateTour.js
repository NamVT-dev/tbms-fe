
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";
import DatePicker from "react-multi-date-picker";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
    imageCover: null,
    images: [],
    startLocation: {
      address: "",
      description: "",
    },
    startDates: [],
    status: "pending",
  });

  const [finalPrice, setFinalPrice] = useState(0);
  const [dates, setDates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.priceDiscount) || 0;
    const discountedPrice = price - (price * discount) / 100;
    setFinalPrice(discountedPrice > 0 ? discountedPrice : 0);
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

  const validateForm = () => {
    const {
      name,
      duration,
      maxGroupSize,
      price,
      priceDiscount,
      summary,
      description,
      imageCover,
      startLocation,
    } = formData;

    if (!name.trim()) return "Tên tour không được để trống";
    if (duration <= 0) return "Thời gian phải lớn hơn 0";
    if (maxGroupSize <= 0) return "Số lượng tối đa phải lớn hơn 0";
    if (price <= 0) return "Giá phải lớn hơn 0";
    if (priceDiscount < 0 || priceDiscount > 100)
      return "Giảm giá phải từ 0 đến 100%";
    if (!summary.trim()) return "Vui lòng nhập tóm tắt tour";
    if (!description || description === "<p><br></p>")
      return "Vui lòng nhập mô tả tour";
    if (!imageCover) return "Vui lòng chọn ảnh bìa";
    if (dates.length === 0) return "Vui lòng chọn ít nhất một ngày khởi hành";
    if (!startLocation.address.trim())
      return "Vui lòng nhập địa chỉ xuất phát";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const form = new FormData();
    try {
      form.append("name", formData.name);
      form.append("duration", formData.duration);
      form.append("maxGroupSize", formData.maxGroupSize);
      form.append("price", formData.price);
      form.append("priceDiscount", formData.priceDiscount);
      form.append("summary", formData.summary);
      form.append("description", formData.description);
      form.append("imageCover", formData.imageCover);
      form.append("startLocation[address]", formData.startLocation.address);
      form.append(
        "startLocation[description]",
        formData.startLocation.description
      );

      for (let i = 0; i < formData.images.length; i++) {
        form.append("images", formData.images[i]);
      }

      dates.forEach((date) => form.append("startDates", date));

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}tours/create`,
        {
          method: "POST",
          credentials: "include",
          body: form,
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Tạo tour thành công!");
        navigate("/partner/tours");
      } else {
        alert(data.message || "Lỗi tạo tour");
      }
    } catch (error) {
      console.error("Lỗi:", error);
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
                placeholder="Thời gian (số ngày)"
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                name="maxGroupSize"
                onChange={handleChange}
                type="number"
                placeholder="Số lượng người tham gia tối đa"
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageCover: e.target.files[0],
                    }))
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Ảnh phụ (nhiều)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      images: e.target.files,
                    }))
                  }
                />
              </div>

              <textarea
                name="summary"
                onChange={handleChange}
                placeholder="Tóm tắt tour"
                className={`${textareaClass} md:col-span-2`}
                required
              />
              <ReactQuill
                className="md:col-span-2 mb-20"
                theme="snow"
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
                <div className="bg-white p-4 rounded-xl shadow w-fit">
                  <DatePicker
                    value={dates}
                    onChange={setDates}
                    onlyCalendar
                    multiple
                    format="YYYY-MM-DD"
                    className="rmdp-prime custom-calendar"
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

const style = document.createElement("style");
style.innerHTML = `
  .custom-calendar input.rmdp-input {
    display: none !important;
  }
`;
document.head.appendChild(style);
