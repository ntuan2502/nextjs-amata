"use client";

import { useEffect, useState } from "react";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { ENV } from "@/config";
import axiosInstance from "@/libs/axiosInstance";
import { Button } from "@heroui/react";
import axios from "axios";
import { useAuth } from "@/contexts/auth";
import { handleAxiosError } from "@/libs/handleAxiosFeedback";

type Session = {
  id: number;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string;
  lastRefreshedAt: string | null;
  ipAddress: string;
  userAgent: string;
};

export default function SessionsComponent() {
  const { user } = useAuth();
  const { tSessions } = useAppTranslations();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentAccessToken, setCurrentAccessToken] = useState<string | null>(
    null
  );
  const [random, setRandom] = useState(0);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      console.warn("No access token found");
      return;
    }

    setCurrentAccessToken(accessToken);
    fetchSessions();
  }, [random]);

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/auth/sessions`);
      setSessions(res.data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  async function logoutSession(accessToken: string) {
    setRandom(Math.random());
    return await axios.post(`${ENV.API_URL}/auth/logout-session`, {
      userId: user?.id,
      accessToken: accessToken,
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{tSessions("title")}</h2>
      <p className="text-sm mb-4">{tSessions("description")}</p>

      <div className="space-y-4">
        {sessions?.map((session) => {
          const isCurrent = session.accessToken === currentAccessToken;

          return (
            <div
              key={session.id}
              className={`border p-4 rounded-md ${
                isCurrent ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">
                  {tSessions("ipAddress")}: {session.ipAddress}
                </div>
                <div className="flex items-center gap-2">
                  {isCurrent && (
                    <span className="text-xs text-blue-600 font-medium">
                      {tSessions("currentSession")}
                    </span>
                  )}
                  {session.isActive && (
                    <Button
                      color="danger"
                      onPress={() => logoutSession(session.accessToken)}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <div>
                  {tSessions("createdAt")}:{" "}
                  {format(new Date(session.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </div>
                <div>
                  {tSessions("lastUsedAt")}:{" "}
                  {format(new Date(session.lastUsedAt), "yyyy-MM-dd HH:mm:ss")}
                </div>
                <div>
                  {tSessions("lastRefreshedAt")}:{" "}
                  {session.lastRefreshedAt
                    ? format(
                        new Date(session.lastRefreshedAt),
                        "yyyy-MM-dd HH:mm:ss"
                      )
                    : "-"}
                </div>
                <div>
                  {tSessions("status")}:{" "}
                  <span
                    className={`font-medium ${
                      session.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {session.isActive
                      ? tSessions("active")
                      : tSessions("inactive")}
                  </span>
                </div>
                <div>UserAgent: {session.userAgent}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
