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

  logout: () =>
    axios.get(`${process.env.REACT_APP_BACKEND_URL}auth/logout`, {
      withCredentials: true,
    }),

  confirmEmail: (pin) =>
    axios.get(`${process.env.REACT_APP_BACKEND_URL}auth/confirmEmail/${pin}`, {
      withCredentials: true,
    }),

  resendConfirmEmail: () =>
    axios.get(`${process.env.REACT_APP_BACKEND_URL}auth/resendConfirmEmail`, {
      withCredentials: true,
    }),

  forgotPassword: (email) =>
    axios.post(`${process.env.REACT_APP_BACKEND_URL}auth/forgotPassword`, {
      email,
    }),

  resetPassword: (email, token, password, passwordConfirm) =>
    axios.post(
      `${process.env.REACT_APP_BACKEND_URL}auth/resetPassword`,
      {
        email,
        token,
        password,
        passwordConfirm,
      },
      { withCredentials: true }
    ),
};

export const userService = {
  getMe: () =>
    axios.get(`${process.env.REACT_APP_BACKEND_URL}auth/profile`, {
      withCredentials: true,
    }),

  updatePassword: (passwordCurrent, password, passwordConfirm) =>
    axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}auth/updatePassword`,
      {
        passwordCurrent,
        password,
        passwordConfirm,
      },
      {
        withCredentials: true,
      }
    ),
};

export function getTours() {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}tours`);
}

export function getTourBySlug(slug) {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}tours/detail/${slug}`);
}
