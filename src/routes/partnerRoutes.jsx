import { lazy } from "react";
import CompanyProfile from "../layouts/partner/CompanyProfile";

const PartnerDashboard = lazy(() =>
    import("../layouts/partner/PartnerDashboard")
);
const CreateTour = lazy(() => import("../components/partner/CreateTour"));
const PartnerTour = lazy(() => import("../components/partner/PartnerTour"));
const EditTour = lazy(() => import("../components/partner/EditTour"));
const BookingList = lazy(() => import("../components/partner/BookingList"));
const partnerRoutes = {
    path: "/partner",
    children: [
        { path: "dashboard", element: <PartnerDashboard /> },
        { path: "tours", element: <PartnerTour /> },
        { path: "tours/create", element: <CreateTour /> },
        { path: "tours/edit/:id", element: <EditTour /> },
        { path: "tours/bookinglist", element: <BookingList /> },
        { path: "profile", element: <CompanyProfile /> },
    ],
};

export default partnerRoutes;
