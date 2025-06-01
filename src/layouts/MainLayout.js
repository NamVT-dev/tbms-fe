import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

const MainLayout = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen font-sans bg-white">
        {/* Header Section */}
        <Header />

        {/* Main Content Section */}
        <main className="w-full">
          <Outlet />
        </main>

        {/* Footer Section */}
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default MainLayout;
