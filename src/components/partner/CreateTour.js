import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";
import DatePicker from "react-multi-date-picker";
import ReactQuill from "react-quill";
import { FaRegCalendarAlt } from "react-icons/fa";
import "react-quill/dist/quill.snow.css";
import "react-multi-date-picker/styles/layouts/prime.css"; // theme đẹp hơn
import MapSelector from "./MapSelector";
import { duration } from "@mui/material/styles";

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
      coordinates: [],
    },
    locations: [
      {
        address: "",
        description: "",
        coordinates: [],
        day: "",
      },
    ],
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dates || dates.length === 0) {
      alert("Vui lòng chọn ít nhất một ngày.");
      return;
    }

    const form = new FormData();
    try {
      form.append("name", formData.name);
      form.append("duration", formData.duration);
      form.append("maxGroupSize", formData.maxGroupSize);
      form.append("price", formData.price);
      form.append("summary", formData.summary);
      form.append("description", formData.description);
      form.append("imageCover", formData.imageCover);
      form.append("startLocation[address]", formData.startLocation.address);
      if (formData.startLocation.coordinates?.length > 1) {
        form.append(
          "startLocation[coordinates]",
          formData.startLocation.coordinates[0]
        );
        form.append(
          "startLocation[coordinates]",
          formData.startLocation.coordinates[1]
        );
      }
      form.append(
        "startLocation[description]",
        formData.startLocation.description
      );

      formData.locations.forEach((location, index) => {
        if (location.day > duration)
          alert("Ngày trong chuyến đi đã vượt quá thời gian chuyến đi");
        form.append(`locations[${index}][description]`, location.description);
        form.append(`locations[${index}][address]`, location.address);
        if (location.coordinates?.length > 1) {
          form.append(
            `locations[${index}][coordinates][0]`,
            location.coordinates[0]
          );
          form.append(
            `locations[${index}][coordinates][1]`,
            location.coordinates[1]
          );
        }
        form.append(`locations[${index}][day]`, location.day);
      });

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

  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          address: "",
          description: "",
          coordinates: [],
        },
      ],
    }));
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
              <div className="md:col-span-2">
                <h3>🗺️ Vị trí xuất phát</h3>
                <div className=" mb-6 p-4 border border-gray-300 rounded-xl bg-gray-50">
                  <label className="text-sm text-gray-600 block mb-1">
                    📍 Chọn vị trí xuất phát trên bản đồ
                  </label>
                  <MapSelector
                    onSelect={({ lat, lng, address }) => {
                      setFormData((prev) => ({
                        ...prev,
                        startLocation: {
                          ...prev.startLocation,
                          address,
                          coordinates: [lng, lat],
                        },
                      }));
                    }}
                  />
                </div>
                {formData.startLocation.address && (
                  <p className="text-sm text-green-700 mt-2 mb-5">
                    ✅ Đã chọn:{" "}
                    <strong>{formData.startLocation.address}</strong>
                  </p>
                )}

                <input
                  name="descriptionStart"
                  onChange={handleChange}
                  placeholder="Mô tả địa điểm xuất phát"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  🗺️ Các điểm dừng trung gian
                </h3>

                {formData.locations.map((loc, index) => (
                  <div
                    key={index}
                    className="mb-6 p-4 border border-gray-300 rounded-xl bg-gray-50"
                  >
                    <label className="text-sm text-gray-600 block mb-1">
                      📍 Chọn vị trí #{index + 1}
                    </label>
                    <MapSelector
                      onSelect={({ lat, lng, address }) => {
                        const newLocations = [...formData.locations];
                        newLocations[index] = {
                          ...newLocations[index],
                          address,
                          coordinates: [lng, lat],
                        };
                        setFormData((prev) => ({
                          ...prev,
                          locations: newLocations,
                        }));
                      }}
                    />
                    {loc.address && (
                      <p className="text-sm text-green-700 mt-2">
                        ✅ Đã chọn: <strong>{loc.address}</strong>
                      </p>
                    )}
                    <input
                      type="text"
                      placeholder="Mô tả địa điểm"
                      className={`${inputClass} mt-3`}
                      value={loc.description}
                      onChange={(e) => {
                        const newLocations = [...formData.locations];
                        newLocations[index] = {
                          ...newLocations[index],
                          description: e.target.value,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          locations: newLocations,
                        }));
                      }}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Ngày (trong hành trình)"
                      className={`${inputClass} mt-3`}
                      value={loc.day}
                      onChange={(e) => {
                        const newLocations = [...formData.locations];
                        newLocations[index] = {
                          ...newLocations[index],
                          day: parseInt(e.target.value) || 0,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          locations: newLocations,
                        }));
                      }}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLocation}
                  className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                >
                  ➕ Thêm vị trí trung gian
                </button>
              </div>

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
                    value={dates}
                    onChange={setDates}
                    onlyCalendar
                    multiple
                    format="YYYY-MM-DD"
                    minDate={new Date()}
                    containerClassName="w-full"
                    inputClass="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                  <FaRegCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

// Thêm CSS để ẩn input ẩn của react-multi-date-picker
const style = document.createElement("style");
style.innerHTML = `
  .custom-calendar input.rmdp-input {
    display: none !important;
  }
`;
document.head.appendChild(style);