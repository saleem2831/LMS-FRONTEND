import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:9000"
  baseURL: "https://lms-backend-s3uv.onrender.com"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;