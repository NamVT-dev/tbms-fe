import { lazy } from "react";

const PartnerDashboard = lazy(() => import("../layouts/PartnerDashboard"));
const CreateTour = lazy(() => import("../components/CreateTour"));
const PartnerTour = lazy(() => import("../components/PartnerTour"));
const EditTour = lazy(() => import("../components/EditTour"));

const partnerRoutes = {
  path: "/partner",
  children: [
    { path: "dashboard", element: <PartnerDashboard /> },
    { path: "tours", element: <PartnerTour /> },
    { path: "tours/create", element: <CreateTour /> },
    { path: "tours/edit/:id", element: <EditTour /> },
  ],
};

export default partnerRoutes;
