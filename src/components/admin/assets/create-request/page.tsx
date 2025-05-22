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
import {
  Asset,
  Office,
  Department,
  User,
  AssetTransaction,
} from "@/types/data";
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { ReactSignature } from "@/components/cuicui/application-ui/signature/react-signature/react-signature";
import { base64ToFile } from "@/utils/function";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";

export default function CreateRequestAssetAdminComponent({
  id,
}: {
  id: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { tAdmin, tCta, tAsset } = useAppTranslations();
  const [formData, setFormData] = useState<Partial<AssetTransaction>>({});
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleDownload = (url: string) => {
    formData.signature = url;
  };

  const fetchAsset = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `${ENV.API_URL}/assets/${id}?include=deviceType, deviceModel`
      );
      const data: Asset = res.data.data.asset;
      setFormData((prev) => ({ ...prev, asset: data }));
    } catch (err) {
      handleAxiosError(err);
    }
  }, [id]);

  const fetchOffices = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      const data: Office[] = res.data.data.offices;

      setOffices(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/departments`);
      const data: Department[] = res.data.data.departments;

      setDepartments(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/users`);
      const data: User[] = res.data.data.users;

      setUsers(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    fetchAsset();
    fetchOffices();
    fetchDepartments();
    fetchUsers();
  }, [fetchAsset]);

  const handleSubmit = async () => {
    const { asset, department, office, fromUser, toUser, signature, note } =
      formData;
    if (!signature)
      return toast.error("Chưa có chữ ký hoặc chưa xác nhận chữ ký");
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("assetId", asset?.id || "");
      formDataToSend.append("officeId", office?.id || "");
      formDataToSend.append("departmentId", department?.id || "");
      formDataToSend.append("fromUserId", fromUser?.id || "");
      formDataToSend.append("toUserId", toUser?.id || "");
      formDataToSend.append("note", note || "");

      if (signature) {
        // Tạo file từ base64
        const file = base64ToFile(signature, "signature.png");
        formDataToSend.append("fromSignature", file);
      }

      const res = await axiosInstance.post(
        `${ENV.API_URL}/asset-transactions/create-request`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleAxiosSuccess(res);
      router.push(ADMIN_ROUTES.ASSET_TRANSACTION);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  if (!formData.asset?.internalCode) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.ASSETS}>
            {tAdmin("assets.title")}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.ASSETS}/${id}`}>
            {formData.asset.internalCode}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.ASSETS}/${id}/create-request`}>
            {tAdmin("assets.createRequest")}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <Input
        isRequired
        isDisabled
        label={tAsset("code")}
        type="text"
        value={formData.asset.internalCode}
      />

      <Autocomplete
        defaultItems={offices}
        label={tAdmin("offices.title")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = offices.find((d) => d.id === key);
            if (selected) {
              setFormData((prev) => ({ ...prev, office: selected }));
            }
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>

      <Autocomplete
        defaultItems={departments}
        label={tAdmin("departments.title")}
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
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>

      <Autocomplete
        selectedKey={user?.id}
        defaultItems={users}
        label={tAdmin("users.title")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = users.find((d) => d.id === key);
            if (selected) {
              setFormData((prev) => ({ ...prev, fromUser: selected }));
            }
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>

      <Autocomplete
        defaultItems={users}
        label={tAdmin("users.title")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = users.find((d) => d.id === key);
            if (selected) {
              setFormData((prev) => ({ ...prev, toUser: selected }));
            }
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>

      <Textarea
        label="Description"
        placeholder="Enter your description"
        value={formData.note || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, note: e.target.value }))
        }
      />

      <ReactSignature onDownload={handleDownload} />

      <Button color="primary" onPress={handleSubmit}>
        {tCta("submit")}
      </Button>
    </div>
  );
}
