"use client";

import LoadingComponent from "@/components/ui/Loading";
import { ENV } from "@/config";
import { ADMIN_ROUTES } from "@/constants/routes";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import axiosInstance from "@/libs/axiosInstance";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { Department, Office, User } from "@/types/data";
import { Gender } from "@/types/enum";
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  DatePicker,
  Input,
  Radio,
  RadioGroup,
} from "@heroui/react";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

export default function EditUserAdminComponent({ id }: { id: string }) {
  const defaultDate = today(getLocalTimeZone());
  const [time, setTime] = useState<CalendarDate | null>(defaultDate);
  const { tAdmin, tCta, tLabels } = useAppTranslations();
  const [formData, setFormData] = useState<Partial<User>>({});
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/users/${id}`);
      const data: User = res.data.data.user;
      setFormData(data);
      if (data.dob) {
        setTime(parseDate(dayjs(data.dob).format("YYYY-MM-DD")));
      }
    } catch (err) {
      handleAxiosError(err);
    }
  }, [id]);

  const fetchOffices = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      const offices = res.data.data.offices;

      setOffices(offices);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/departments`);
      const departments = res.data.data.departments;

      setDepartments(departments);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchOffices();
    fetchDepartments();
  }, [fetchUser]);

  const fields = [
    { name: "email", label: tAdmin("users.email") },
    { name: "name", label: tAdmin("name") },
    { name: "phone", label: tAdmin("users.phone") },
    { name: "address", label: tAdmin("users.address") },
    { name: "avatar", label: tAdmin("users.avatar") },
  ];

  const handleSubmit = async () => {
    const { email, name, phone, address, avatar, gender, office, department } =
      formData;
    try {
      const res = await axiosInstance.patch(`${ENV.API_URL}/users/${id}`, {
        email,
        name,
        phone,
        address,
        avatar,
        gender,
        officeId: office?.id,
        departmentId: department?.id,
        dob: time?.toDate("UTC").toISOString(),
      });
      handleAxiosSuccess(res);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  if (!formData.id) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.USERS}>
            {tAdmin("users.title")}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.USERS}/${id}`}>
            {formData.name}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      {fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          value={String(formData[field.name as keyof User] || "")}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, [field.name]: val }))
          }
        />
      ))}
      <DatePicker
        showMonthAndYearPickers
        label={tLabels("birthDateLabel")}
        firstDayOfWeek="mon"
        value={time}
        onChange={setTime}
        calendarProps={{
          nextButtonProps: {
            variant: "bordered",
          },
          prevButtonProps: {
            variant: "bordered",
          },
        }}
      />
      <RadioGroup
        label={tLabels("genderLabel")}
        value={formData.gender}
        onValueChange={(val) =>
          setFormData((prev) => ({ ...prev, gender: val as Gender }))
        }
        defaultValue={Gender.MALE}
        orientation="horizontal"
      >
        <Radio value={Gender.MALE}>{tLabels("genderMale")}</Radio>
        <Radio value={Gender.FEMALE}>{tLabels("genderFemale")}</Radio>
      </RadioGroup>

      <Autocomplete
        selectedKey={formData.office?.id?.toString()}
        defaultItems={offices}
        label={tAdmin("users.office")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = offices.find((o) => o.id === key);
            if (selected) {
              setFormData((prev) => ({ ...prev, office: selected }));
            }
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.id.toString()}>
            {item.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
      <Autocomplete
        selectedKey={formData.department?.id?.toString()}
        defaultItems={departments}
        label={tAdmin("users.department")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = departments.find((d) => d.id === key);
            if (selected) {
              setFormData((prev) => ({ ...prev, department: selected }));
            }
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.id.toString()}>
            {item.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
      <Button color="primary" onPress={handleSubmit}>
        {tCta("submit")}
      </Button>
    </div>
  );
}
