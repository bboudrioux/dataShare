import api from "./index";
import type { AuthResponse } from "../types/auth.types";

export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/register", {
    email,
    password,
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};
