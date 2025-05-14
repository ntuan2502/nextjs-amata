"use client";
import LoadingComponent from "@/components/ui/Loading";
import { useAuth } from "@/contexts/auth";
import { useEffect } from "react";

export default function AuthCallback() {
  const { loginWithMicrosoft } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);

      const accessToken = url.searchParams.get("accessToken") ?? "";
      const refreshToken = url.searchParams.get("refreshToken") ?? "";
      const id = url.searchParams.get("id") ?? "";
      const email = url.searchParams.get("email") ?? "";
      const name = url.searchParams.get("name") ?? "";

      loginWithMicrosoft(accessToken, refreshToken, id, email, name);
    }
  }, [loginWithMicrosoft]);

  return <LoadingComponent />;
}
