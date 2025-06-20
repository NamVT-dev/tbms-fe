import { useState, useEffect } from "react";
import { userService } from "../services/api";
import "../styles/profile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    userService
      .getMe()
      .then((response) => {
        const userData = response.data?.data?.data;
        if (!userData)
          console.error("Không tìm thấy dữ liệu người dùng", response.data);
        setUser(userData);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy dữ liệu người dùng:", error)
      );
  }, []);

  const handleFileChange = async (e) => {};

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {};

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    userService
      .updatePassword(passwords.current, passwords.new, passwords.confirm)
      .then(() => alert("Mật khẩu cập nhật thành công!"))
      .catch((error) =>
        console.error("Lỗi khi cập nhật mật khẩu:", error.response)
      );
  };

  if (!user) {
    return <p>Đang tải dữ liệu người dùng...</p>;
  }

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem link="#" text="Settings" icon="settings" active={true} />
            <NavItem link="#" text="My bookings" icon="briefcase" />
            <NavItem link="#" text="My reviews" icon="star" />
            <NavItem link="#" text="Billing" icon="credit-card" />
          </ul>
        </nav>
        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Cài đặt tài khoản</h2>
            <form className="form form-user-data" onSubmit={handleUpdate}>
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="form__input"
                  type="text"
                  value={user.name}
                  required
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Tài khoản email
                </label>
                <input
                  id="email"
                  className="form__input"
                  type="email"
                  value={user.email}
                  required
                  disabled
                />
              </div>
              <div className="form__group form__photo-upload">
                <img className="form__user-photo" src={user.photo} alt="user" />
                <input
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                />
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green">
                  Lưu cài đặt
                </button>
              </div>
            </form>
          </div>
          <div className="line">&nbsp;</div>
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Đổi mật khẩu</h2>
            <form
              className="form form-user-password"
              onSubmit={handlePasswordUpdate}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Mật khẩu hiện tại
                </label>
                <input
                  id="password-current"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  name="current"
                  required
                  minLength="8"
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  Mật khẩu mới
                </label>
                <input
                  id="password"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  name="new"
                  required
                  minLength="8"
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="password-confirm"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  name="confirm"
                  required
                  minLength="8"
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green">
                  Lưu mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

const NavItem = ({ link, text, icon, active }) => (
  <li className={active ? "side-nav--active" : ""}>
    <a href={link}>
      <svg>
        <use xlinkHref={`/images/icons.svg#icon-${icon}`} />
      </svg>
      {text}
    </a>
  </li>
);

export default UserProfile;
