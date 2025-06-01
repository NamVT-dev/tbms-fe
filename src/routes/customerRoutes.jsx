import { lazy } from "react";
import TourDetailPage from "../pages/TourDetailPage";

const MainLayout = lazy(() => import("../layouts/MainLayout"));
const HomePage = lazy(() => import("../pages/HomePage"));

const customerRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: "tour-details/:slug", element: <TourDetailPage /> },
    // thêm các route khác ở đây
  ],
};

export default customerRoutes;
