import axiosClient from "./axiosClient";
import type { LoginResponse, User } from "@/types";

export const authApi = {
  login: (username: string, password: string): Promise<LoginResponse> =>
    axiosClient.post("/auth/login", { username, password }),

  me: (): Promise<User> => axiosClient.get("/auth/me"),
};
