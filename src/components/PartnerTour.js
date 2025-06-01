import React, { useState, useEffect } from "react";
import { Table, Container, Button, Badge, Image, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PartnerTour = () => {
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Bạn chưa đăng nhập!");
          return;
        }

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
          alert("Lỗi lấy danh sách tour: " + data.message);
        }
      } catch (error) {
        console.error("Lỗi lấy tour:", error);
      }
    };

    fetchTours();
  }, []);

  const filteredTours = tours
    .filter((tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
  const deleteTour = async (tourId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa tour này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:9999/api/auth/tour/${tourId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Xóa tour thành công!");
        setTours(tours.filter((tour) => tour._id !== tourId));
      } else {
        alert("Lỗi xóa tour: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi xóa tour:", error);
    }
  };
  return (
    <Container className="mt-4">
      <h2 className="text-center">Danh Sách Tour Của Bạn</h2>
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate("/partner/dashboard")}
      >
        Trở Về Dashboard
      </Button>

      {/* 🔍 Tìm kiếm và sắp xếp */}
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="🔎 Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="outline-primary"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "⬆️ Giá tăng dần" : "⬇️ Giá giảm dần"}
        </Button>
      </div>

      <Table striped bordered hover className="text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Tên Tour</th>
            <th>Thời Gian</th>
            <th>Kích thước nhóm</th>
            <th>Giá gốc</th>
            <th>Giá giảm</th>
            <th>Địa điểm bắt đầu</th>
            <th>Ảnh đại diện</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredTours.map((tour, index) => (
            <tr key={tour._id}>
              <td>{index + 1}</td>
              <td className="fw-bold">{tour.name}</td>
              <td>{tour.duration} ngày</td>
              <td>{tour.maxGroupSize} người</td>
              <td className="text-success">{tour.price} VND</td>
              <td className="text-danger">
                {tour.priceDiscount
                  ? `${tour.priceDiscount} VND`
                  : "Không giảm giá"}
              </td>
              <td>{tour.startLocation?.address || "Không có thông tin"}</td>
              <td>
                {tour.imageCover ? (
                  <Image
                    src={tour.imageCover}
                    alt="Ảnh Tour"
                    width="80"
                    height="50"
                    rounded
                  />
                ) : (
                  "Không có ảnh"
                )}
              </td>
              <td>
                {tour.status === "active" ? (
                  <Badge bg="success">Hoạt động</Badge>
                ) : tour.status === "pending" ? (
                  <Badge bg="warning">Chờ duyệt</Badge>
                ) : (
                  <Badge bg="secondary">Không hoạt động</Badge>
                )}
              </td>
              <td>
                <div className="d-flex gap-2 justify-content-center">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => navigate(`/partner/tours/edit/${tour._id}`)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteTour(tour._id)}
                  >
                    Xóa
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PartnerTour;
