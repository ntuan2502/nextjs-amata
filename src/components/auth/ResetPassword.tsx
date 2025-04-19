"use client";

import { useState } from "react";
import { Button, Input, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AUTH_ROUTES } from "@/constants/routes";
import { toast } from "react-toastify";
import { isValidPassword } from "@/utils/validators";
import { AuthFieldErrors } from "@/types/auth";
import { useFormField } from "@/hooks/useFormField";
import { AcmeIcon } from "@/components/icons";
import SocialLogin from "@/components/auth/SocialLogin";
import { useAppTranslations } from "@/hooks/useAppTranslations";

export default function ResetPasswordComponent() {
  const { tRegister, tResetPassword, tCta, tLabels, tErrors } =
    useAppTranslations();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const [errors, setErrors] = useState<AuthFieldErrors>({});

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const passwordProps = useFormField(
    "password",
    password,
    setPassword,
    errors,
    setErrors
  );
  const confirmPasswordProps = useFormField(
    "confirmPassword",
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors
  );

  function validateForm() {
    const newErrors: AuthFieldErrors = {};
    let hasError = false;

    if (!password) {
      newErrors.password = tErrors("passwordRequired");
      hasError = true;
    } else if (!isValidPassword(password)) {
      newErrors.password = tErrors("passwordInvalid");
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = tErrors("confirmPasswordRequired");
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = tErrors("passwordsDoNotMatch");
      hasError = true;
    }

    return { hasError, newErrors };
  }

  function handleSubmit() {
    const { hasError, newErrors } = validateForm();
    setErrors(newErrors);

    if (hasError) return;

    toast.success(
      tResetPassword("successMessage", {
        password,
        confirmPassword,
      })
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <div className="flex flex-col items-center pb-6">
          <AcmeIcon size={60} />
          <p className="text-xl font-medium">{tResetPassword("title")}</p>
          <p className="text-small text-default-500 text-center">
            {tResetPassword("subtitle")}
          </p>
        </div>
        <form className="flex flex-col gap-4">
          <Input
            autoFocus
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label={tLabels("passwordLabel")}
            name="password"
            placeholder={tLabels("passwordPlaceholder")}
            type={isVisible ? "text" : "password"}
            variant="bordered"
            {...passwordProps}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label={tLabels("confirmPasswordLabel")}
            name="confirmPassword"
            placeholder={tLabels("confirmPasswordPlaceholder")}
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            {...confirmPasswordProps}
          />
          <Button color="primary" onPress={handleSubmit}>
            {tCta("submit")}
          </Button>
        </form>
        <SocialLogin />
        <p className="text-center text-small">
          {tRegister("alreadyHaveAccount")}&nbsp;
          <Link href={AUTH_ROUTES.LOGIN} size="sm">
            {tCta("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
