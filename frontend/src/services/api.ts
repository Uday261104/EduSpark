import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import authorization from "@/core/Authorization";


const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});



// Attach access token automatically
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // If 401 and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          "http://127.0.0.1:8000/api/accounts/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccess = refreshResponse.data.access;

        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  authorization.clear();
  window.location.href = "/login";
}

export default api;
