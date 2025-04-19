"use client";

import { useState } from "react";
import { Button, Input, Link, Form } from "@heroui/react";
import { AcmeIcon } from "@/components/icons";
import { isValidEmail } from "@/utils/validators";
import { toast } from "react-toastify";
import { AuthFieldErrors } from "@/types/auth";
import { useFormField } from "@/hooks/useFormField";
import SocialLogin from "@/components/auth/SocialLogin";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { AUTH_ROUTES } from "@/constants/routes";

export default function ForgotPasswordComponent() {
  const { tForgotPassword, tCta, tLabels, tErrors } = useAppTranslations();
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<AuthFieldErrors>({});

  const emailProps = useFormField("email", email, setEmail, errors, setErrors);

  function validateForm() {
    const newErrors: AuthFieldErrors = {};
    let hasError = false;

    if (!email.trim()) {
      newErrors.email = tErrors("emailRequired");
      hasError = true;
    } else if (!isValidEmail(email)) {
      newErrors.email = tErrors("emailInvalid");
      hasError = true;
    }

    return { hasError, newErrors };
  }

  function handleSubmit() {
    const { hasError, newErrors } = validateForm();
    setErrors(newErrors);

    if (hasError) return;

    toast.success(tForgotPassword("successMessage", { email }));
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <div className="flex flex-col items-center pb-6">
          <AcmeIcon size={60} />
          <p className="text-xl font-medium">{tForgotPassword("title")}</p>
          <p className="text-small text-default-500 text-center">
            {tForgotPassword("subtitle")}
          </p>
        </div>
        <Form className="flex flex-col gap-3" validationBehavior="native">
          <Input
            autoFocus
            isRequired
            label={tLabels("emailLabel")}
            name="email"
            placeholder={tLabels("emailPlaceholder")}
            type="email"
            variant="bordered"
            {...emailProps}
          />
          <Button className="w-full" color="primary" onPress={handleSubmit}>
            {tCta("submit")}
          </Button>
        </Form>
        <SocialLogin />
        <p className="text-center text-small">
          {tForgotPassword("rememberPassword")}&nbsp;
          <Link href={AUTH_ROUTES.LOGIN} size="sm">
            {tCta("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
