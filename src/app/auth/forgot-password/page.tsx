"use client";

import { useState } from "react";
import { Button, Input, Link, Form } from "@heroui/react";
import { AcmeIcon } from "@/components/icons";
import { ROUTES } from "@/constants/routes";
import { emailErrorMessage, isValidEmail } from "@/utils/validators";
import { toast } from "react-toastify";
import { AuthFieldErrors } from "@/types/auth";
import { useFormField } from "@/hooks/useFormField";
import AuthSocialLogin from "@/components/auth/AuthSocialLogin";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<AuthFieldErrors>({});

  const emailProps = useFormField("email", email, setEmail, errors, setErrors);

  function validateForm() {
    const newErrors: AuthFieldErrors = {};
    let hasError = false;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (!isValidEmail(email)) {
      newErrors.email = emailErrorMessage;
      hasError = true;
    }

    return { hasError, newErrors };
  }

  function handleSubmit() {
    const { hasError, newErrors } = validateForm();
    setErrors(newErrors);

    if (hasError) return;

    toast.success(`Forgot password for user with values: Email: ${email}`);
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <div className="flex flex-col items-center pb-6">
          <AcmeIcon size={60} />
          <p className="text-xl font-medium">Forgot your password?</p>
          <p className="text-small text-default-500 text-center">
            Enter your email address below and we will send you instructions to
            reset your password.
          </p>
        </div>
        <Form className="flex flex-col gap-3" validationBehavior="native">
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            {...emailProps}
          />
          <Button className="w-full" color="primary" onPress={handleSubmit}>
            Submit
          </Button>
        </Form>
        <AuthSocialLogin />
        <p className="text-center text-small">
          Remember your password?&nbsp;
          <Link href={ROUTES.AUTH.LOGIN} size="sm">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
