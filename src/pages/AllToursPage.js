import React, { useEffect, useState } from "react";
import TourList from "../components/main/TourList";
import axios from "axios";

function AllToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingsAverage, setRatingsAverage] = useState(""); // đổi từ location sang ratingsAverage
  const [keyword, setKeyword] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = (params = {}) => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}tours`, {
        params: { ...params, limit: 1000 },
      })
      .then((res) => {
        setTours(res.data.data.tours);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy tour:", err);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    const [minPrice, maxPrice] = price ? price.split("-") : [null, null];

    const params = {
      search: keyword,
      ratingsAverage:
        ratingsAverage !== "Tất cả đánh giá"
          ? Number(ratingsAverage)
          : undefined,
      minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
      maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
    };

    fetchTours(params);
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div>
      {/* Overlay Content */}
      <div className="flex justify-center pb-6 transition-transform duration-300">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-10 max-w-4xl w-full mx-4">
          {/* Title and Description */}
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Bạn lựa chọn chuyến đi nào?
            </h1>
            <p className="text-lg text-gray-700">
              Hàng trăm tour du lịch hạng sang giá tốt đang chờ bạn
            </p>
          </div>

          {/* Search Form */}
          <div className="flex flex-col md:flex-row gap-5 w-full">
            {/* Search Input */}
            <div className="flex-1">
              <label className="relative flex items-center border border-gray-300 rounded-2xl">
                <input
                  type="text"
                  placeholder="Nhập tên địa điểm"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400"
                />
              </label>
            </div>
            {/* Ratings Dropdown (thay cho Location) */}
            <div className="flex-1">
              <label className="relative flex items-center border border-gray-300 rounded-2xl">
                <select
                  value={ratingsAverage}
                  onChange={(e) => setRatingsAverage(e.target.value)}
                  className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
                >
                  <option>Tất cả đánh giá</option>
                  <option value="5">5 sao</option>
                  <option value="4">4 sao trở lên</option>
                  <option value="3">3 sao trở lên</option>
                </select>
              </label>
            </div>
            {/* Price Dropdown */}
            <div className="flex-1">
              <label className="relative flex items-center border border-gray-300 rounded-2xl">
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="p-3 w-full border-none rounded-2xl focus:ring-2 focus:ring-cyan-400 appearance-none"
                >
                  <option>Tất cả mức giá</option>
                  <option value="0-500">Dưới 500k</option>
                  <option value="500-1000">500k - 1 triệu</option>
                  <option value="1000-9999">Trên 1 triệu</option>
                  <option value="10000-99999">Trên 10 triệu</option>
                </select>
              </label>
            </div>
            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-cyan-400 text-white font-medium py-3 px-6 rounded-2xl hover:bg-cyan-500 transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
      {tours.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-lg">
          Không tìm thấy kết quả phù hợp
        </div>
      ) : (
        <TourList tours={tours} />
      )}
    </div>
  );
}

export default AllToursPage;
