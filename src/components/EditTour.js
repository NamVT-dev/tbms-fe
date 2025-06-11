import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditTour = () => {
  const { id } = useParams(); //value-key
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    maxGroupSize: "",
    difficulty: "easy",
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

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9999/tours/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setFormData(data.data.tour);
        } else {
          alert("Lỗi tải thông tin tour!");
        }
      } catch (error) {
        console.error("Lỗi tải tour:", error);
      }
    };

    fetchTourDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:9999/tours/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        alert("Cập nhật tour thành công!");
        navigate("/partner/tours");
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật tour:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Chỉnh Sửa Tour</h2>

      {/* Hiển thị ảnh hiện tại */}
      {formData.imageCover && (
        <div className="text-center mb-3">
          <Image src={formData.imageCover} alt="Ảnh Tour" width="200" rounded />
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Tên Tour</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Thời gian (ngày)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Số lượng khách tối đa</Form.Label>
              <Form.Control
                type="number"
                name="maxGroupSize"
                value={formData.maxGroupSize}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Trạng thái Tour</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Chờ duyệt</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Giảm giá</Form.Label>
              <Form.Control
                type="number"
                name="priceDiscount"
                value={formData.priceDiscount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tóm tắt</Form.Label>
              <Form.Control
                as="textarea"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Mô tả chi tiết</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/partner/tours")}
          >
            Trở Về
          </Button>
          <Button type="submit" variant="primary">
            Cập Nhật Tour
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditTour;
