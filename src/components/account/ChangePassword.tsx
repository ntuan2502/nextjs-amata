"use client";

import { ENV } from "@/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { useFormField } from "@/hooks/useFormField";
import axiosInstance from "@/libs/axiosInstance";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { AuthFieldErrors } from "@/types/auth";
import { isValidPassword } from "@/utils/validators";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

export default function ChangePasswordComponent() {
  const { tChangePassword, tErrors, tLabels, tCta } = useAppTranslations();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isOldVisible, setIsOldVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isConfirmNewVisible, setIsConfirmNewVisible] = useState(false);

  const toggleOldVisibility = () => setIsOldVisible(!isOldVisible);
  const toggleNewVisibility = () => setIsNewVisible(!isNewVisible);
  const toggleConfirmNewVisibility = () =>
    setIsConfirmNewVisible(!isConfirmNewVisible);

  const [errors, setErrors] = useState<AuthFieldErrors>({});

  const oldPasswordProps = useFormField(
    "oldPassword",
    oldPassword,
    setOldPassword,
    errors,
    setErrors
  );
  const newPasswordProps = useFormField(
    "newPassword",
    newPassword,
    setNewPassword,
    errors,
    setErrors
  );
  const confirmNewPasswordProps = useFormField(
    "confirmNewPassword",
    confirmNewPassword,
    setConfirmNewPassword,
    errors,
    setErrors
  );

  function validateForm() {
    const newErrors: AuthFieldErrors = {};
    let hasError = false;

    if (!oldPassword) {
      newErrors.oldPassword = tErrors("oldPasswordRequired");
      hasError = true;
    }

    if (!newPassword) {
      newErrors.newPassword = tErrors("newPasswordRequired");
      hasError = true;
    } else if (!isValidPassword(newPassword)) {
      newErrors.newPassword = tErrors("newPasswordInvalid");
      hasError = true;
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = tErrors("confirmNewPasswordRequired");
      hasError = true;
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = tErrors("passwordsDoNotMatch");
      hasError = true;
    }

    return { hasError, newErrors };
  }

  async function handleSubmit() {
    const { hasError, newErrors } = validateForm();
    setErrors(newErrors);

    if (hasError) return;

    try {
      const res = await axiosInstance.post(
        `${ENV.API_URL}/auth/change-password`,
        {
          oldPassword,
          newPassword,
        }
      );
      handleAxiosSuccess(res);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      handleAxiosError(err);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">{tChangePassword("title")}</h2>
      <p className="text-sm mb-4">{tChangePassword("description")}</p>
      <Input
        autoFocus
        isRequired
        endContent={
          <button type="button" onClick={toggleOldVisibility}>
            {isOldVisible ? (
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
        label={tLabels("oldPasswordLabel")}
        name="oldPassword"
        placeholder={tLabels("oldPasswordPlaceholder")}
        type={isOldVisible ? "text" : "password"}
        variant="bordered"
        {...oldPasswordProps}
      />
      <Input
        isRequired
        endContent={
          <button type="button" onClick={toggleNewVisibility}>
            {isNewVisible ? (
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
        label={tLabels("newPasswordLabel")}
        name="newPassword"
        placeholder={tLabels("newPasswordPlaceholder")}
        type={isNewVisible ? "text" : "password"}
        variant="bordered"
        {...newPasswordProps}
      />
      <Input
        isRequired
        endContent={
          <button type="button" onClick={toggleConfirmNewVisibility}>
            {isConfirmNewVisible ? (
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
        label={tLabels("confirmNewPasswordLabel")}
        name="confirmNewPassword"
        placeholder={tLabels("confirmNewPasswordPlaceholder")}
        type={isConfirmNewVisible ? "text" : "password"}
        variant="bordered"
        {...confirmNewPasswordProps}
      />

      <div className="pt-4">
        <Button
          onPress={handleSubmit}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl shadow hover:bg-red-600 transition"
        >
          {tCta("submit")}
        </Button>
      </div>
    </div>
  );
}
