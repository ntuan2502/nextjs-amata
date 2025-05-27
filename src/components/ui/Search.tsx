"use client";

import { useAppTranslations } from "@/hooks/useAppTranslations";
import { Button, Input } from "@heroui/react";

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}
export function SearchForm({ value, onChange, onSubmit }: SearchFormProps) {
  const { tLabels, tCta } = useAppTranslations();
  return (
    <div className="flex justify-center items-center gap-2">
      <Input
        type="text"
        placeholder={tLabels("search")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
        className="w-full sm:w-96"
        autoFocus
      />
      <Button color="primary" onPress={onSubmit}>
        {tCta("submit")}
      </Button>
    </div>
  );
}
