import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateTour = () => {
    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        maxGroupSize: "",
        price: "",
        priceDiscount: "",
        summary: "",
        description: "",
        imageCover: "",
        images: [],
        startDates: "",
        startLocation: {
            type: "Point",
            coordinates: [],
            address: "",
            description: "",
        },
        locations: [],
        status: "pending",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationChange = (e) => {
        setFormData({
            ...formData,
            startLocation: {
                ...formData.startLocation,
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:9999/api/auth/tour/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();
            if (response.ok) {
                alert("Tour đã được tạo thành công!");
                navigate("/partner/tours");
            } else {
                alert(data.message || "Tạo tour thất bại!");
            }
        } catch (error) {
            console.error("Create Tour Error:", error);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Tạo Tour Mới</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Tên Tour</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Thời gian (ngày)</Form.Label>
                    <Form.Control
                        type="number"
                        name="duration"
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Số lượng khách tối đa</Form.Label>
                    <Form.Control
                        type="number"
                        name="maxGroupSize"
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Giá</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Giảm giá</Form.Label>
                    <Form.Control
                        type="number"
                        name="priceDiscount"
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Tóm tắt</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="summary"
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Mô tả chi tiết</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Ảnh đại diện Tour</Form.Label>
                    <Form.Control
                        type="text"
                        name="imageCover"
                        placeholder="URL ảnh"
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Địa điểm bắt đầu</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        onChange={handleLocationChange}
                    />
                    <Form.Control
                        type="text"
                        name="description"
                        placeholder="Mô tả"
                        onChange={handleLocationChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Trạng thái Tour</Form.Label>
                    <Form.Select name="status" onChange={handleChange}>
                        <option value="pending">Chờ duyệt</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </Form.Select>
                </Form.Group>

                <div className="d-flex gap-3 mt-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/partner-dashboard")}
                    >
                        Trở Về
                    </Button>
                    <Button type="submit" variant="primary">
                        Tạo Tour
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default CreateTour;
