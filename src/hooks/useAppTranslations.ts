import { useTranslations } from "next-intl";

export function useAppTranslations() {
  return {
    tLogin: useTranslations("auth.login"),
    tRegister: useTranslations("auth.register"),
    tForgotPassword: useTranslations("auth.forgotPassword"),
    tResetPassword: useTranslations("auth.resetPassword"),
    tSocialLogin: useTranslations("auth.socialLogin"),
    tCta: useTranslations("cta"),
    tLabels: useTranslations("labels"),
    tErrors: useTranslations("errors"),
  };
}
