import React, { useState, useEffect } from "react";
import {
    Container,
    Card,
    Row,
    Col,
    Button,
    Badge,
    Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Body = () => {
    const [tours, setTours] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9999/api/auth/tour/partner",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setTours(data.data.tours);
                } else {
                    console.error("Lỗi lấy danh sách tour:", data.message);
                }
            } catch (error) {
                console.error("Lỗi tải tour:", error);
            }
        };

        fetchTours();
    }, [token]);

    const activeTours = tours.filter((tour) => tour.status === "active").length;
    const pendingTours = tours.filter(
        (tour) => tour.status === "pending"
    ).length;

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">📌 Quản Lý Tour Du Lịch</h2>

            {/* Thống kê nhanh */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow p-3 text-center bg-light">
                        <h5 className="text-primary">Tổng số tour</h5>
                        <h3>{tours.length} tour</h3>
                    </Card>
                </Col>
                <Col>
                    <Card className="shadow p-3 text-center bg-success text-white">
                        <h5>Tour đang hoạt động</h5>
                        <h3>{activeTours} tour</h3>
                    </Card>
                </Col>
                <Col>
                    <Card className="shadow p-3 text-center bg-warning text-dark">
                        <h5>Tour đang chờ duyệt</h5>
                        <h3>{pendingTours} tour</h3>
                    </Card>
                </Col>
            </Row>

            {/* Tour nổi bật */}
            <h3 className="text-center mb-3">🏆 Tour Nổi Bật</h3>
            <Row>
                {tours.slice(0, 3).map((tour) => (
                    <Col md={4} key={tour._id}>
                        <Card className="shadow-lg mb-3">
                            <Image
                                src={
                                    tour.imageCover ||
                                    "https://via.placeholder.com/300"
                                }
                                className="rounded-top"
                                fluid
                            />
                            <Card.Body>
                                <Card.Title className="fw-bold">
                                    {tour.name}
                                </Card.Title>
                                <Card.Text>
                                    <Badge bg="info">
                                        {tour.duration} ngày
                                    </Badge>{" "}
                                    <Badge bg="success">{tour.price} VND</Badge>{" "}
                                    <br />
                                    <strong>Địa điểm:</strong>{" "}
                                    {tour.startLocation?.address ||
                                        "Không có thông tin"}{" "}
                                    <br />
                                    <strong>Trạng thái:</strong> {tour.status}
                                </Card.Text>
                                <Button
                                    variant="outline-primary"
                                    onClick={() =>
                                        navigate(
                                            `/partner/tours/edit/${tour._id}`
                                        )
                                    }
                                >
                                    ✏️ Chỉnh Sửa
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Body;
