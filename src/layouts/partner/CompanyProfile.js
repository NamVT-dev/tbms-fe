import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/partner/Sidebar";
import Header from "../../layouts/partner/Header";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    photo: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:9999/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          const user = data.data.data;
          setCompanyData({
            name: user.name || "",
            description: user.description || "",
            photo: user.photo || "",
          });
        } else {
          setError("Lỗi tải profile: " + data.message);
        }
      } catch (error) {
        console.error("Lỗi tải profile:", error);
        setError("Không thể kết nối đến máy chủ");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeMB = 2;

    if (!allowedTypes.includes(file.type)) {
      setError("Chỉ cho phép ảnh JPEG hoặc PNG");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError("Ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    setCompanyData((prev) => ({ ...prev, photo: file }));
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleFullSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 🧪 Validate đầu vào
    if (!companyData.name.trim()) {
      setError("Tên công ty không được để trống");
      setIsLoading(false);
      return;
    }

    if (companyData.description.length > 1000) {
      setError("Mô tả không được vượt quá 1000 ký tự");
      setIsLoading(false);
      return;
    }

    let successProfile = false;
    let successPassword = false;

    try {
      const form = new FormData();
      form.append("name", companyData.name);
      form.append("description", companyData.description);
      form.append("photo", companyData.photo);

      const response = await fetch("http://localhost:9999/auth/profile", {
        method: "PATCH",
        body: form,
        credentials: "include",
      });

      const data = await response.json();
      successProfile = response.ok;

      if (!successProfile) {
        setError(data.message || "Lỗi cập nhật profile");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setError("Lỗi khi cập nhật profile");
      console.error(error);
      setIsLoading(false);
      return;
    }

    // Nếu có nhập mật khẩu thì xử lý
    if (passwords.current || passwords.new || passwords.confirm) {
      if (passwords.current === passwords.new) {
        setError("Mật khẩu mới phải khác mật khẩu hiện tại");
        setIsLoading(false);
        return;
      }

      if (passwords.new !== passwords.confirm) {
        setError("Xác nhận mật khẩu không khớp");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:9999/auth/updatePassword", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            passwordCurrent: passwords.current,
            password: passwords.new,
            passwordConfirm: passwords.confirm,
          }),
        });

        const data = await response.json();
        successPassword = response.ok;

        if (!successPassword) {
          setError(data.message || "Lỗi đổi mật khẩu");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        setError("Lỗi khi đổi mật khẩu");
        console.error(error);
        setIsLoading(false);
        return;
      }
    }

    if (successProfile && (successPassword || (!passwords.current && !passwords.new && !passwords.confirm))) {
      alert("Cập nhật thành công!");
      setPasswords({ current: "", new: "", confirm: "" });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Header />
        <div className="p-10">
          <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-xl mx-auto">
            <button
              onClick={() => navigate("/partner/dashboard")}
              className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              ⬅️ Quay về Dashboard
            </button>

            <h2 className="text-3xl font-bold text-black mb-6">
              👤 Hồ sơ Công Ty & Đổi Mật Khẩu
            </h2>

            <form onSubmit={handleFullSubmit} className="space-y-6">
              <div>
                <label className="block font-medium mb-1">Tên Công Ty</label>
                <input
                  type="text"
                  name="name"
                  value={companyData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Mô Tả Công Ty</label>
                <textarea
                  name="description"
                  value={companyData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Ảnh đại diện / Logo
                </label>
                <div className="flex items-center text-lg">
                  <img
                    className="w-[5rem] h-[5rem] rounded-full mr-8 object-cover"
                    src={
                      companyData?.photo instanceof File
                        ? URL.createObjectURL(companyData.photo)
                        : companyData.photo
                    }
                    alt="user"
                  />
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Đổi mật khẩu */}
              <div className="border-t pt-6">
                <label className="block font-medium mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />

                <label className="block font-medium mt-4 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  minLength={8}
                />

                <label className="block font-medium mt-4 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  minLength={8}
                />
              </div>

              {error && <p className="text-red-500 mt-4">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold mt-6"
              >
                {isLoading ? "Đang lưu..." : " Lưu tất cả thay đổi"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
