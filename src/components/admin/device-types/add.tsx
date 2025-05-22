"use client";

import { ENV } from "@/config";
import { ADMIN_ROUTES } from "@/constants/routes";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import axiosInstance from "@/libs/axiosInstance";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { DeviceType } from "@/types/data";
import { BreadcrumbItem, Breadcrumbs, Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddDeviceTypeAdminComponent() {
  const { tAdmin, tCta } = useAppTranslations();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<DeviceType>>({});

  const fields = [{ name: "name", label: tAdmin("name") }];

  const handleSubmit = async () => {
    const { name } = formData;
    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/device-types`, {
        name,
      });
      handleAxiosSuccess(res);
      router.push(ADMIN_ROUTES.DEVICE_TYPES);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.DEPARTMENTS}>
            {tAdmin("deviceTypes.title")}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.DEPARTMENTS}/add`}>
            {tCta("add")}
          </BreadcrumbItem>
        </Breadcrumbs>

      </div>

      {fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          value={String(formData[field.name as keyof DeviceType] || "")}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, [field.name]: val }))
          }
        />
      ))}

      <Button color="primary" onPress={handleSubmit}>
        {tCta("submit")}
      </Button>
    </div>
  );
}
