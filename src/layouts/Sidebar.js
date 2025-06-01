import React, { useState } from "react";
import { Nav, Collapse, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [openTourMenu, setOpenTourMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div
            className="sidebar bg-dark text-white p-3"
            style={{ width: "250px", height: "100vh" }}
        >
            <h4>Partner Dashboard</h4>
            <Nav className="flex-column">
                <Nav.Link href="/partner-dashboard" className="text-white">
                    Dashboard
                </Nav.Link>

                <Nav.Link
                    onClick={() => setOpenTourMenu(!openTourMenu)}
                    aria-controls="tour-submenu"
                    aria-expanded={openTourMenu}
                    className="text-white d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                >
                    Quản lý Tour <span>{openTourMenu ? "▲" : "▼"}</span>
                </Nav.Link>
                <Collapse in={openTourMenu}>
                    <div id="tour-submenu" className="ps-3">
                        <Nav.Link
                            href="/partner/tours/create"
                            className="text-white"
                        >
                            Tạo Tour mới
                        </Nav.Link>
                        <Nav.Link href="/partner/tours" className="text-white">
                            Danh sách Tour
                        </Nav.Link>
                    </div>
                </Collapse>

                <Nav.Link href="/partner/bookings" className="text-white">
                    Đơn đặt Tour
                </Nav.Link>

                <Nav.Link href="/profile" className="text-white">
                    Profile
                </Nav.Link>

                <Nav.Link href="/settings" className="text-white">
                    Settings
                </Nav.Link>

                <Button
                    variant="danger"
                    className="mt-4 w-100"
                    onClick={handleLogout}
                >
                    Đăng Xuất
                </Button>
            </Nav>
        </div>
    );
};

export default Sidebar;
