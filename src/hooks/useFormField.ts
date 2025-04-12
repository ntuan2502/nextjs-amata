// hooks/useFormField.ts
import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { AuthFieldErrors } from "@/types/auth";

export function useFormField(
  field: keyof AuthFieldErrors,
  value: string,
  setValue: Dispatch<SetStateAction<string>>,
  errors: AuthFieldErrors,
  setErrors: Dispatch<SetStateAction<AuthFieldErrors>>
) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return {
    value,
    onChange,
    isInvalid: !!errors[field],
    errorMessage: errors[field],
  };
}
