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
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { useFormField } from "@/hooks/useFormField";
import { AuthFieldErrors } from "@/types/auth";
import { isValidEmail } from "@/utils/validators";
import axiosInstance from "@/libs/axiosInstance";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { ENV } from "@/config";
import { useAuth } from "@/contexts/auth";

export default function ProfileComponent() {
  const { updateUserInContext } = useAuth();
  const defaultDate = today(getLocalTimeZone());
  const [value, setValue] = useState(defaultDate);
  const now = today(getLocalTimeZone());
  const { tProfile, tCta, tLabels, tErrors } = useAppTranslations();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [office, setOffice] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errors, setErrors] = useState<AuthFieldErrors>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/auth/profile`);
      const user = res.data.data.user;
      if (user.dob) {
        const isoString = user.dob; // "1997-02-25T00:00:00.000Z"
        const dateOnly = isoString.split("T")[0]; // "1997-02-25"
        setValue(parseDate(dateOnly));
      }

      setEmail(user.email);
      setFullname(user.name);
      setGender(user.gender);
      setPhone(user.phone);
      setAddress(user.address);
      setAvatar(user.avatar);
      setOffice(user.office.name);
    } catch (err) {
      handleAxiosError(err);
    }
  };

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

  async function handleSubmit() {
    const { hasError, newErrors } = validateForm();
    setErrors(newErrors);

    if (hasError) return;

    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/auth/profile`, {
        name: fullname,
        gender,
        phone,
        address,
        avatar,
        dob: value.toDate("UTC").toISOString(),
      });
      handleAxiosSuccess(res);
      updateUserInContext(res.data.data.user);
    } catch (err) {
      handleAxiosError(err);
    }
  }

  return (
    <main className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">{tProfile("title")}</h2>
      <p className="text-sm mb-4">{tProfile("description")}</p>

      <Input
        isRequired
        isReadOnly
        label={tLabels("emailLabel")}
        name="email"
        placeholder={tLabels("emailPlaceholder")}
        type="email"
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
        isRequired
        isReadOnly
        label={tLabels("officeLabel")}
        placeholder={tLabels("officePlaceholder")}
        type="text"
        value={office}
      />

      <RadioGroup
        label={tLabels("genderLabel")}
        value={gender}
        onValueChange={setGender}
        defaultValue="male"
        orientation="horizontal"
      >
        <Radio value="male">{tLabels("genderMale")}</Radio>
        <Radio value="female">{tLabels("genderFemale")}</Radio>
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
      <Input
        label={tLabels("phoneLabel")}
        placeholder={tLabels("phonePlaceholder")}
        type="text"
        value={phone}
        onValueChange={setPhone}
      />
      <Input
        label={tLabels("addressLabel")}
        placeholder={tLabels("addressPlaceholder")}
        type="text"
        value={address}
        onValueChange={setAddress}
      />
      <Input
        label={tLabels("avatarLabel")}
        placeholder={tLabels("avatarPlaceholder")}
        type="text"
        value={avatar}
        onValueChange={setAvatar}
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
