import { lazy } from "react";
import { Navigate } from "react-router-dom";

const AdminLayout = lazy(() => import("../layouts/admin/AdminLayout"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const DashboardPartner = lazy(() =>
  import("../pages/admin/dashboard-partner/DashboardPartner")
);
const Users = lazy(() => import("../pages/admin/Users"));
const PendingTours = lazy(() => import("../pages/admin/PendingTours"));

const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "partner-dashboard", element: <DashboardPartner /> },
    { path: "users", element: <Users /> },
    { path: "pending-tours", element: <PendingTours /> },
  ],
};

export default adminRoutes;
