import React, { useEffect, useState } from "react";
import TourList from "../components/main/TourList";
import axios from "axios";

function AllToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(" http://localhost:9999/tours?limit=1000")
      .then((res) => {
        setTours(res.data.data.tours);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy tour:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center my-8">Tất cả tour</h2>
      <TourList tours={tours} />
    </div>
  );
}

export default AllToursPage;
