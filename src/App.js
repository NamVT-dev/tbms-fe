import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PartnerDashboard from "./layouts/PartnerDashboard";
import CreateTour from "./components/CreateTour";
import PartnerTour from "./components/PartnerTour";
import EditTour from "./components/EditTour";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/partner-dashboard"
                    element={<PartnerDashboard />}
                />
                <Route path="/partner/tours/create" element={<CreateTour />} />
                <Route path="/partner/tours" element={<PartnerTour />} />
                <Route path="/partner/tours/edit/:id" element={<EditTour />} />
            </Routes>
        </Router>
    );
}

export default App;
