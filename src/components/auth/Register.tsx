"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { AUTH_ROUTES } from "@/constants/routes";
import { toast } from "react-toastify";
import { isValidEmail, isValidPassword } from "@/utils/validators";
import { AuthFieldErrors } from "@/types/auth";
import { useFormField } from "@/hooks/useFormField";
import { AcmeIcon } from "@/components/icons";
import SocialLogin from "@/components/auth/SocialLogin";
import { useAppTranslations } from "@/hooks/useAppTranslations";

export default function RegisterComponent() {
  const { tRegister, tCta, tLabels, tErrors } = useAppTranslations();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const [errors, setErrors] = useState<AuthFieldErrors>({});

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  function handleAgree(status: boolean, onClose: () => void) {
    setIsAgree(status);
    onClose();
  }

  const fullnameProps = useFormField(
    "fullname",
    fullname,
    setFullname,
    errors,
    setErrors
  );
  const emailProps = useFormField("email", email, setEmail, errors, setErrors);
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

    if (!fullname.trim()) {
      newErrors.fullname = tErrors("fullnameRequired");
      hasError = true;
    }

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

    if (!isAgree) {
      toast.error(tRegister("mustAgreeTerms"));
      return;
    }

    toast.success(
      tRegister("successMessage", {
        fullname,
        email,
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
          <p className="text-xl font-medium">{tRegister("title")}</p>
          <p className="text-small text-default-500 text-center">
            {tRegister("subtitle")}
          </p>
        </div>
        <form className="flex flex-col gap-4">
          <Input
            autoFocus
            isRequired
            label={tLabels("fullnameLabel")}
            name="fullname"
            placeholder={tLabels("fullnamePlaceholder")}
            type="text"
            variant="bordered"
            {...fullnameProps}
          />
          <Input
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
          <div className="flex items-center">
            <Checkbox
              isRequired
              className="py-4"
              size="sm"
              isSelected={isAgree}
              isDisabled
            ></Checkbox>
            <div>
              <Link
                className="relative z-[1]"
                href="#"
                size="sm"
                onPress={onOpen}
              >
                {tRegister("agreeTerms")}
              </Link>
            </div>
          </div>
          <Button color="primary" onPress={handleSubmit}>
            {tRegister("submit")}
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

      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {tRegister("termsModalTitle")}
              </ModalHeader>
              <ModalBody>
                <p>{tRegister("termsModalBody")}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => handleAgree(false, onClose)}
                >
                  {tCta("cancel")}
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleAgree(true, onClose)}
                >
                  {tCta("confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
