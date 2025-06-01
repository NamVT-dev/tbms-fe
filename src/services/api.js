import axios from "axios";

// Interceptor để xử lý 401 errors (unauthorized)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data?.message || "";
      if (
        errorMessage.includes("Token expired") ||
        errorMessage.includes("Invalid token")
      ) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const authService = {
  login: (email, password) =>
    axios.post(
      `${process.env.REACT_APP_BACKEND_URL}auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    ),
  signup: (name, email, password, passwordConfirm) =>
    axios.post(
      `${process.env.REACT_APP_BACKEND_URL}auth/signup`,
      {
        name,
        email,
        password,
        passwordConfirm,
      },
      {
        withCredentials: true,
      }
    ),
  logout: () => axios.get(`${process.env.REACT_APP_BACKEND_URL}user/logout`),
};

export const userService = {
  getMe: () =>
    axios.get(`${process.env.REACT_APP_BACKEND_URL}user/me`, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        //Authorization:"Bearer "+ localStorage.getItem('token')
      },
    }),
  updateMe: (data) =>
    axios.patch(`${process.env.REACT_APP_BACKEND_URL}user/updateMe`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePassword: (passwordCurrent, password, passwordConfirm) =>
    axios.patch(`${process.env.REACT_APP_BACKEND_URL}user/updateMyPassword`, {
      passwordCurrent,
      password,
      passwordConfirm,
    }),
};

export const bookingService = {
  getCheckoutSession: (tourId) =>
    axios.get(
      `${process.env.REACT_APP_BACKEND_URL}bookings/checkout-session/${tourId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "ngrok-skip-browser-warning": true,
        },
      }
    ),
  getMyBookings: () =>
    axios.get(`${process.env.REACT_APP_BACKEND_URL}bookings/my-tours`),
};
