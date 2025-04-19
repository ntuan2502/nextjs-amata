"use client";

import { useAppTranslations } from "@/hooks/useAppTranslations";

export default function ChangePasswordPage() {
  const { tChangePassword } = useAppTranslations();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{tChangePassword("title")}</h2>
      <p className="text-sm mb-4">{tChangePassword("description")}</p>
      {/* Form profile ở đây */}
    </div>
  );
}
