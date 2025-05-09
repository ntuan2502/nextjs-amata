"use client";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { Spinner } from "@heroui/react";

export default function LoadingComponent() {
  const { tLabels } = useAppTranslations();
  return (
    <div className="p-6 space-y-6 w-full">
      <Spinner color="default" label={tLabels("loading")} />
    </div>
  );
}
