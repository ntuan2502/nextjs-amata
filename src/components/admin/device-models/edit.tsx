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
import { DeviceModel } from "@/types/data";
import { BreadcrumbItem, Breadcrumbs, Button, Input } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

export default function EditDeviceModelAdminComponent({ id }: { id: string }) {
  const { tAdmin, tCta } = useAppTranslations();
  const [formData, setFormData] = useState<Partial<DeviceModel>>({});

  const fetchDeviceModel = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-models/${id}`);
      const data: DeviceModel = res.data.data.deviceModel;
      setFormData(data);
    } catch (err) {
      handleAxiosError(err);
    }
  }, [id]);

  useEffect(() => {
    fetchDeviceModel();
  }, [fetchDeviceModel]);

  const fields = [{ name: "name", label: tAdmin("name") }];

  const handleSubmit = async () => {
    const { name } = formData;
    try {
      const res = await axiosInstance.patch(
        `${ENV.API_URL}/device-models/${id}`,
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
          <BreadcrumbItem href={ADMIN_ROUTES.DEVICE_MODELS}>
            {tAdmin("deviceModels.title")}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.DEVICE_MODELS}/${id}`}>
            {formData.name}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          value={String(formData[field.name as keyof DeviceModel] || "")}
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
