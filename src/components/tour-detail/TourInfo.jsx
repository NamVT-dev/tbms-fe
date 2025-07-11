import { useState } from "react";
import { FaClock, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import dayjs from "dayjs";
import ResponsiveDatePickers from "../tour-detail/ResponsiveDatePickers";
import TiptapEditor from "../tour-detail/TiptapEditor";
import { getBookingSession } from "../../services/api";

const TourInfo = ({ tour, onSelectLocation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [numAdults, setNumAdults] = useState(2);
  const [activeLocation, setActiveLocation] = useState(tour.locations[0]);

  const totalPrice = numAdults * (tour?.price || 0);

  const handleScrollToMap = (location) => {
    const mapElement = document.getElementById("tour-map");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
    setActiveLocation(location);
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
    <div className="container max-w-5xl mx-auto space-y-2">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Các điểm đến */}
        <div className="md:col-span-1 bg-white rounded-2xl p-8 flex flex-col">
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold mb-4 text-cyan-700">
              Các điểm đến
            </h1>
            <ul className="space-y-3">
              {tour.locations.map((loc, idx) => {
                const isActive =
                  activeLocation?.coordinates[0] === loc.coordinates[0] &&
                  activeLocation?.coordinates[1] === loc.coordinates[1];

                return (
                  <li
                    key={idx}
                    className={`flex items-start gap-3 py-3 px-3 rounded-lg cursor-pointer transition border ${
                      isActive
                        ? "bg-cyan-50 border-cyan-500 text-cyan-700 font-semibold"
                        : "hover:bg-cyan-50 hover:text-cyan-600 border-transparent"
                    }`}
                    onClick={() => handleScrollToMap(loc)}
                  >
                    <FaMapMarkerAlt
                      className={`mt-1 ${
                        isActive ? "text-red-500" : "text-cyan-500"
                      }`}
                      size={18}
                    />
                    <div>
                      <p className="font-medium">{loc.address}</p>
                      <p className="text-sm text-gray-500">{loc.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right: Thông tin tour */}
        <div className="md:col-span-2 bg-white rounded-2xl p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold mb-4 text-cyan-700">
              Thông tin chuyến đi
            </h1>
            <ul className="space-y-4 text-gray-700 text-base">
              <li className="flex items-center gap-3">
                <FaClock className="text-cyan-500" size={20} />
                <span>
                  <strong>Thời gian:</strong> {tour.duration}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaUsers className="text-cyan-500" size={20} />
                <span>
                  <strong>Số lượng tối đa:</strong> {tour.maxGroupSize} người
                </span>
              </li>
            </ul>

            {/* Chọn ngày */}
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Ngày khởi hành
              </label>
              <ResponsiveDatePickers
                label=""
                availableDates={tour?.startDates || []}
                selectedDate={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>

            {/* Số lượng người */}
            <div className="mt-6 space-y-2">
              <label className="block text-gray-700 font-medium">
                Người lớn
              </label>
              <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2">
                <div>
                  <p className="text-sm font-medium">Số lượng</p>
                  <p className="text-xs text-gray-500">&gt; 10 tuổi</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1 rounded ${
                      numAdults <= 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      if (numAdults > 1) setNumAdults(numAdults - 1);
                    }}
                    disabled={numAdults <= 1}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-lg font-semibold">
                    {numAdults}
                  </span>
                  <button
                    className={`px-3 py-1 rounded ${
                      numAdults >= tour?.maxGroupSize
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
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
                <p className="text-sm text-red-500">
                  Đã đạt số lượng tối đa: {tour.maxGroupSize} người
                </p>
              )}
            </div>

            {/* Tổng giá */}
            <div className="text-center mt-4">
              <p className="text-xl font-bold text-orange-500">
                Tổng giá: {totalPrice.toLocaleString()} đ
              </p>
            </div>
          </div>

          {/* Nút đặt tour */}
          <div className="text-center mt-10">
            <button
              onClick={handleBooking}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl text-lg font-semibold transition"
            >
              Yêu cầu đặt tour
            </button>
          </div>
        </div>
      </section>

      {/* MÔ TẢ CHI TIẾT */}
      <div className="bg-white rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-cyan-700">
          Mô tả chi tiết
        </h1>
        <TiptapEditor content={tour.description} />
      </div>
    </div>
  );
};

export default TourInfo;
