"use client";

import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  DatePicker,
  Input,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { useFormField } from "@/hooks/useFormField";
import { AuthFieldErrors } from "@/types/auth";
import { isValidEmail } from "@/utils/validators";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/auth";

export default function ProfileComponent() {
  const defaultDate = today(getLocalTimeZone());
  const [value, setValue] = useState(defaultDate);
  const now = today(getLocalTimeZone());
  const { tProfile, tCta, tLabels, tErrors } = useAppTranslations();
  const { user } = useAuth();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<AuthFieldErrors>({});

  useEffect(() => {
    setFullname(user?.name || "");
    setEmail(user?.email || " ");
  }, [user]);

  const fullnameProps = useFormField(
    "fullname",
    fullname,
    setFullname,
    errors,
    setErrors
  );
  const emailProps = useFormField("email", email, setEmail, errors, setErrors);

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

    return { hasError, newErrors };
  }

  function handleSubmit() {
    const { hasError, newErrors } = validateForm();
    setErrors(newErrors);

    if (hasError) return;

    toast.success("OK");
  }

  return (
    <main className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">{tProfile("title")}</h2>
      <p className="text-sm mb-4">{tProfile("description")}</p>

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
        label={tLabels("fullnameLabel")}
        name="fullname"
        placeholder={tLabels("fullnamePlaceholder")}
        type="text"
        variant="bordered"
        {...fullnameProps}
      />
      <Input
        label={tLabels("officeLabel")}
        placeholder={tLabels("officePlaceholder")}
        type="text"
        value="AMATA City Long Thành"
      />

      <RadioGroup
        label={tLabels("genderLabel")}
        defaultValue="male"
        orientation="horizontal"
      >
        <Radio value="male">{tLabels("genderMale")}</Radio>
        <Radio value="felame">{tLabels("genderFemale")}</Radio>
      </RadioGroup>

      <DatePicker
        showMonthAndYearPickers
        label={tLabels("birthDateLabel")}
        variant="bordered"
        firstDayOfWeek="mon"
        maxValue={today(getLocalTimeZone())}
        value={value}
        onChange={(newValue) => newValue && setValue(newValue)}
        calendarProps={{
          focusedValue: value,
          onFocusChange: setValue,
          nextButtonProps: {
            variant: "bordered",
          },
          prevButtonProps: {
            variant: "bordered",
          },
        }}
        CalendarTopContent={
          <ButtonGroup
            fullWidth
            className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
            radius="full"
            size="sm"
            variant="bordered"
          >
            <Button onPress={() => setValue(now)}>Today</Button>{" "}
          </ButtonGroup>
        }
      />

      <div className="pt-4">
        <Button
          onPress={handleSubmit}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl shadow hover:bg-red-600 transition"
        >
          {tCta("submit")}
        </Button>
      </div>
    </main>
  );
}
