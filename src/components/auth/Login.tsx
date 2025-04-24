"use client";

import { useState } from "react";
import { Button, Input, Checkbox, Link, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AcmeIcon } from "@/components/icons";
import { isValidEmail } from "@/utils/validators";
import { AuthFieldErrors, LoginPayload } from "@/types/auth";
import { useFormField } from "@/hooks/useFormField";
import SocialLogin from "@/components/auth/SocialLogin";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { useAuth } from "@/contexts/auth/useAuth";
import { AUTH_ROUTES } from "@/constants/routes";

export default function LoginComponent() {
  const { tLogin, tCta, tLabels, tErrors } = useAppTranslations();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});

  const toggleVisibility = () => setIsVisible(!isVisible);

  const emailProps = useFormField("email", email, setEmail, errors, setErrors);
  const passwordProps = useFormField(
    "password",
    password,
    setPassword,
    errors,
    setErrors
  );

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

    if (!password) {
      newErrors.password = tErrors("passwordRequired");
      hasError = true;
    }

    return { hasError, newErrors };
  }

  function handleSubmit() {
    const { hasError, newErrors } = validateForm();
    setErrors(newErrors);

    if (hasError) return;

    const payload: LoginPayload = { email, password };
    login(payload);
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <div className="flex flex-col items-center pb-6">
          <AcmeIcon size={60} />
          <p className="text-xl font-medium">{tLogin("title")}</p>
          <p className="text-small text-default-500">{tLogin("subtitle")}</p>
        </div>
        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
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
          <Input
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
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              {tLogin("remember")}
            </Checkbox>
            <Link
              className="text-default-500"
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              size="sm"
            >
              {tLogin("forgot")}
            </Link>
          </div>
          <Button className="w-full" color="primary" type="submit">
            {tLogin("submit")}
          </Button>
        </Form>
        <SocialLogin />
        <p className="text-center text-small">
          {tLogin("noAccount")}&nbsp;
          <Link href={AUTH_ROUTES.REGISTER} size="sm">
            {tCta("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
