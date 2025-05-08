"use client";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { Spinner } from "@heroui/react";

export default function LoadingComponent() {
  const { tLabels } = useAppTranslations();
  return (
    <div className="">
      <Spinner color="default" label={tLabels("loading")} />
    </div>
  );
}
