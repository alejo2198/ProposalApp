import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5018",
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const parsed = JSON.parse(user);
    config.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return config;
});

export default api;
