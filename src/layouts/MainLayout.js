import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Header Section */}
      <Header />

      {/* Main Content Section */}
      <main className="container mx-auto px-16 py-8">
        <Outlet />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default MainLayout;
