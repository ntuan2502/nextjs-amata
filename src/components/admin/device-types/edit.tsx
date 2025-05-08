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
import { DeviceType } from "@/types/data";
import { BreadcrumbItem, Breadcrumbs, Button, Input } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

export default function EditDeviceTypeAdminComponent({ id }: { id: string }) {
  const { tAdmin, tCta } = useAppTranslations();
  const [formData, setFormData] = useState<Partial<DeviceType>>({});

  const fetchDeviceType = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-types/${id}`);
      const data: DeviceType = res.data.data.deviceType;
      setFormData(data);
    } catch (err) {
      handleAxiosError(err);
    }
  }, [id]);

  useEffect(() => {
    fetchDeviceType();
  }, [fetchDeviceType]);

  const fields = [{ name: "name", label: tAdmin("name") }];

  const handleSubmit = async () => {
    const { name } = formData;
    try {
      const res = await axiosInstance.patch(
        `${ENV.API_URL}/device-types/${id}`,
        {
          name,
        }
      );
      handleAxiosSuccess(res);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  if (!formData) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.DEVICE_TYPES}>
            {tAdmin("deviceTypes.title")}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.DEVICE_TYPES}/${id}`}>
            {formData.name}
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
