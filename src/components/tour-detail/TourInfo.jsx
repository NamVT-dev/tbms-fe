import { useState, useEffect } from "react";
import { FaClock, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import dayjs from "dayjs";
import ResponsiveDatePickers from "../tour-detail/ResponsiveDatePickers";
import { getBookingSession } from "../../services/api";

const TourInfo = ({ tour, onSelectLocation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [numAdults, setNumAdults] = useState(2);
  const totalPrice = numAdults * (tour?.price || 0);
  useEffect(() => {}, [tour]);
  const handleScrollToMap = (location) => {
    const mapElement = document.getElementById("tour-map");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
    if (onSelectLocation) {
      onSelectLocation(location);
    }
  };

  const handleBooking = async () => {
    const isValidDate = tour?.startDates?.some((date) =>
      dayjs(date).isSame(selectedDate, "day")
    );

    if (!selectedDate) {
      alert("Vui lòng chọn ngày khởi hành.");
    } else if (!isValidDate) {
      alert("Ngày khởi hành không hợp lệ.");
    }
    try {
      const res = await getBookingSession(tour.id, numAdults, selectedDate);
      window.location.href = res.data.session?.url;
    } catch (error) {
      window.alert("Xảy ra lỗi khi đặt tour. Hãy thử lại sau!");
    }
  };

  return (
    <section className="container max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Các điểm đến */}
      <div className="md:col-span-2 bg-white rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-cyan-700">
          Các điểm đến
        </h1>
        <ul className="space-y-3">
          {tour.locations.map((loc, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 py-3 rounded-lg cursor-pointer hover:text-cyan-600 hover:bg-cyan-50 transition"
              onClick={() => handleScrollToMap(loc)}
            >
              <FaMapMarkerAlt className="text-cyan-500 mt-1" size={18} />
              <div>
                <p className="font-medium">{loc.address}</p>
                <p className="text-sm text-gray-500">{loc.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Thông tin + chọn ngày + số lượng + giá */}
      <div className="md:col-span-1 bg-white rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-5 text-cyan-700">
            Thông tin chuyến đi
          </h1>
          <ul className="space-y-4 text-gray-700 text-base">
            <li className="flex items-start gap-3">
              <FaClock className="text-cyan-500 mt-1" size={20} />
              <span>
                <strong>Thời gian:</strong> {tour.duration}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaUsers className="text-cyan-500 mt-1" size={20} />
              <span>
                <strong>Số lượng tối đa:</strong> {tour.maxGroupSize} người
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span>{tour.description}</span>
            </li>
          </ul>

          {/* Ngày khởi hành */}
          <div className="max-w-md mx-auto mt-8">
            <ResponsiveDatePickers
              label="Chọn ngày khởi hành"
              availableDates={tour?.startDates || []}
              selectedDate={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          {/* Số lượng người lớn */}
          <div className="mt-6">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium">Người lớn</p>
                <p className="text-sm text-gray-500">&gt; 10 tuổi</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1 rounded ${
                    numAdults <= 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (numAdults > 1) setNumAdults(numAdults - 1);
                  }}
                  disabled={numAdults <= 1}
                >
                  -
                </button>
                <span className="w-6 text-center">{numAdults}</span>
                <button
                  className={`px-3 py-1 rounded ${
                    numAdults >= tour?.maxGroupSize
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (numAdults < tour?.maxGroupSize)
                      setNumAdults(numAdults + 1);
                  }}
                  disabled={numAdults >= tour?.maxGroupSize}
                >
                  +
                </button>
              </div>
            </div>
            {numAdults === tour?.maxGroupSize && (
              <p className="text-sm text-red-500 mt-2">
                Đã đạt số lượng tối đa: {tour.maxGroupSize} người
              </p>
            )}
            {/* Tổng giá */}
            <div className="text-center mt-4">
              <p className="text-lg font-semibold text-orange-500">
                Tổng Giá Tour: {totalPrice.toLocaleString()} đ
              </p>
            </div>
          </div>
        </div>

        {/* Nút đặt tour */}
        <div className="text-center mt-6">
          <button
            onClick={handleBooking}
            className="bg-cyan-500 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl text-lg"
          >
            Yêu cầu đặt
          </button>
        </div>
      </div>
    </section>
  );
};

export default TourInfo;
