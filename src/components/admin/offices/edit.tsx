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
import { Office } from "@/types/data";
import { BreadcrumbItem, Breadcrumbs, Button, Input } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

export default function EditOfficeAdminComponent({ id }: { id: string }) {
  const { tAdmin, tCta } = useAppTranslations();
  const [formData, setFormData] = useState<Partial<Office>>({});

  const fetchDepartment = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices/${id}`);
      const data: Office = res.data.data.office;
      setFormData(data);
    } catch (err) {
      handleAxiosError(err);
    }
  }, [id]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const fields = [
    { name: "name", label: tAdmin("name") },
    { name: "nameEn", label: tAdmin("offices.nameEn") },
    { name: "shortName", label: tAdmin("offices.shortName") },
    { name: "taxCode", label: tAdmin("offices.taxCode") },
    { name: "address", label: tAdmin("offices.address") },
  ];

  const handleSubmit = async () => {
    const { name, nameEn, shortName, taxCode, address } = formData;
    try {
      const res = await axiosInstance.patch(`${ENV.API_URL}/offices/${id}`, {
        name,
        nameEn,
        shortName,
        taxCode,
        address,
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
          <BreadcrumbItem href={ADMIN_ROUTES.OFFICES}>
            {tAdmin("offices.title")}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.OFFICES}/${id}`}>
            {formData.name}
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
