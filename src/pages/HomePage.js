import React, { useContext } from "react";
import HeroSection from "../components/main/HeroSection";
import TourList from "../components/main/TourList";
import { TourContext } from "../contexts/TourContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { tours } = useContext(TourContext);
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      {/* Tour List Section */}
      <TourList tours={tours} paginated={false} />
      <div className="flex justify-center mt-4 mb-12">
        <button
          className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600"
          onClick={() => navigate("/all-tours")}
        >
          Xem tất cả tour
        </button>
      </div>
    </>
  );
}

export default HomePage;
