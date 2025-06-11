import React from "react";
import { FaClock, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

const TourInfo = ({ tour, onSelectLocation }) => {
  const handleScrollToMap = (location) => {
    const mapElement = document.getElementById("tour-map");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
    if (onSelectLocation) {
      onSelectLocation(location);
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

      {/* Right: Thông tin chuyến đi + Đặt ngay */}
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
        </div>

        <button className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-xl text-lg transition w-full">
          Đặt ngay
        </button>
      </div>
    </section>
  );
};

export default TourInfo;
