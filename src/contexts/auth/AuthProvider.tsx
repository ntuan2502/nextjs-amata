"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axiosInstance from "@/libs/axiosInstance";

import { ENV } from "@/config";
import { AuthContext, AuthContextType } from "./AuthContext";
import { User } from "@/types/auth";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login: AuthContextType["login"] = async (payload) => {
    try {
      const res = await axiosInstance.post(
        `${ENV.API_URL}/auth/login`,
        payload
      );

      const { user, accessToken, refreshToken } = res.data.data;

      Cookies.set("accessToken", accessToken, { path: "/" });
      Cookies.set("refreshToken", refreshToken, { path: "/" });
      Cookies.set("user", JSON.stringify(user), { path: "/" });

      setUser(user);
      router.push("/");

      handleAxiosSuccess(res);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/auth/logout`);

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      setUser(null);
      router.push("/auth/login");

      handleAxiosSuccess(res);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
