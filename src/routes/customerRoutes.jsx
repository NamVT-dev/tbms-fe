import { lazy } from "react";
import UserProfile from "../pages/UserProfile";

const MainLayout = lazy(() => import("../layouts/MainLayout"));
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginForm = lazy(() => import("../components/auth/LoginForm"));
const SignUpForm = lazy(() => import("../components/auth/SignUp"));
const TourDetailPage = lazy(() => import("../pages/TourDetailPage"));

const customerRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: "tour-details/:slug", element: <TourDetailPage /> },
    { path: "login", element: <LoginForm /> },
    { path: "register", element: <SignUpForm /> },
    { path: "profile", element: <UserProfile /> },
    // thêm các route khác ở đây
  ],
};

export default customerRoutes;
