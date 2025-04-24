import { createContext } from "react";
import { LoginPayload, User } from "@/types/auth";

export type AuthContextType = {
  user: User | null;
  login: (payload: LoginPayload) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
