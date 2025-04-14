// hooks/useAppTranslations.ts
import { useTranslations } from "next-intl";

export function useAppTranslations() {
  return {
    tLogin: useTranslations("auth.login"),
    tRegister: useTranslations("auth.register"),
    tSocialLogin: useTranslations("auth.socialLogin"),
    tCta: useTranslations("cta"),
    tLabels: useTranslations("labels"),
    tErrors: useTranslations("errors"),
  };
}
