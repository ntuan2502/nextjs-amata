"use client";

import { useAppTranslations } from "@/hooks/useAppTranslations";

export default function SessionsPage() {
  const { tSessions } = useAppTranslations();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{tSessions("title")}</h2>
      <p className="text-sm mb-4">{tSessions("description")}</p>
      {/* Form profile ở đây */}
    </div>
  );
}
