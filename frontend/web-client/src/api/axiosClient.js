import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Chỉ redirect nếu user có token (đã login)
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      // Nếu không có token, cho request fail bình thường (để xử lý ở component)
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
