"use client";

import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { LoginPayload, User } from "@/types/auth";
import axios from "axios";
import { env } from "@/lib/env";

type AuthContextType = {
  user: User | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

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

  const login = async (payload: LoginPayload) => {
    const res = await axios.post<{
      user: User;
      access_token: string;
      refresh_token: string;
    }>(`${env.api_url}/auth/login`, payload);
    const { user, access_token, refresh_token } = res.data;
    Cookies.set("access_token", access_token, { path: "/" });
    Cookies.set("refresh_token", refresh_token, { path: "/" });
    Cookies.set("user", JSON.stringify(user), { path: "/" });
    setUser(user);
    router.push("/");
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
