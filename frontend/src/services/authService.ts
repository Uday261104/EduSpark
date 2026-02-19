import api from "./api";
import authorization from "@/core/Authorization";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface LoginResponse {
  access: string;
  refresh: string;
  role: string;
  permissions: string[];
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
  "/accounts/login/",
    {
      email,
      password,
    }
  );

  const { access, refresh, permissions } = response.data;

  // Store tokens
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

  // Initialize authorization
  authorization.initialize(permissions);

  return response.data;
};
