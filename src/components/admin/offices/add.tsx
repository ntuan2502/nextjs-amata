"use client";

import { ENV } from "@/config";
import { ADMIN_ROUTES } from "@/constants/routes";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import axiosInstance from "@/libs/axiosInstance";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { Office } from "@/types/data";
import { BreadcrumbItem, Breadcrumbs, Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddOfficeAdminComponent() {
  const { tAdmin, tCta } = useAppTranslations();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Office>>({});

  const fields = [
    { name: "name", label: tAdmin("name") },
    { name: "internationalName", label: tAdmin("offices.internationalName") },
    { name: "shortName", label: tAdmin("offices.shortName") },
    { name: "taxCode", label: tAdmin("offices.taxCode") },
    { name: "address", label: tAdmin("offices.address") },
  ];

  const handleSubmit = async () => {
    const { name, internationalName, shortName, taxCode, address } = formData;
    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/offices`, {
        name,
        internationalName,
        shortName,
        taxCode,
        address,
      });
      handleAxiosSuccess(res);
      router.push(ADMIN_ROUTES.OFFICES);
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
          <BreadcrumbItem href={ADMIN_ROUTES.OFFICES}>
            {tAdmin("offices.title")}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.OFFICES}/add`}>
            {tCta("add")}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          value={String(formData[field.name as keyof Office] || "")}
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
