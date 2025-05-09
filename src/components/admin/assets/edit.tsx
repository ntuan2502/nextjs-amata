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
  Department,
  Office,
  Asset,
  User,
  DeviceType,
  DeviceModel,
} from "@/types/data";
import { AssetStatus, WarrantyDuration } from "@/types/enum";
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  DatePicker,
  Input,
} from "@heroui/react";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { useCallback, useEffect, useState } from "react";

export default function EditAssetAdminComponent({ id }: { id: string }) {
  const defaultDate = today(getLocalTimeZone());
  const [time, setTime] = useState<CalendarDate | null>(defaultDate);

  const { tAdmin, tCta, tAsset } = useAppTranslations();
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);

  const fetchAsset = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `${ENV.API_URL}/assets/${id}?include=office, department, user, deviceType, deviceModel`
      );
      const data: Asset = res.data.data.asset;
      setFormData(data);
      if (data.purchaseDate) {
        setTime(parseDate(data.purchaseDate.toString().split("T")[0]));
      }
    } catch (err) {
      handleAxiosError(err);
    }
  }, [id]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/users`);
      const data: User[] = res.data.data.users;

      setUsers(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

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

  const fetchDeviceTypes = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-types`);
      const data: DeviceType[] = res.data.data.deviceTypes;

      setDeviceTypes(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchDeviceModels = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-models`);
      const data: DeviceModel[] = res.data.data.deviceModels;

      setDeviceModels(data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    fetchAsset();
    fetchUsers();
    fetchOffices();
    fetchDepartments();
    fetchDeviceTypes();
    fetchDeviceModels();
  }, [fetchAsset]);

  const fields = [
    { name: "internalCode", label: tAsset("code") },
    { name: "serialNumber", label: tAsset("serialNumber") },
  ];

  const handleSubmit = async () => {
    const {
      internalCode,
      serialNumber,
      status,
      user,
      deviceType,
      deviceModel,
      office,
      department,
      warrantyDuration,
    } = formData;
    try {
      const res = await axiosInstance.patch(`${ENV.API_URL}/assets/${id}`, {
        internalCode,
        serialNumber,
        status,
        userId: user?.id,
        officeId: office?.id,
        departmentId: department?.id,
        deviceTypeId: deviceType?.id,
        deviceModelId: deviceModel?.id,
        purchaseDate: time?.toDate("UTC").toISOString(),
        warrantyDuration,
      });
      handleAxiosSuccess(res);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  if (!formData.internalCode) {
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
            {formData.internalCode}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      {fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          value={String(formData[field.name as keyof Asset] || "")}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, [field.name]: val }))
          }
        />
      ))}

      <Autocomplete
        selectedKey={formData.status}
        defaultItems={Object.entries(AssetStatus).map(([, value]) => ({
          key: value,
          label: value,
        }))}
        label={tAsset("status")}
        onSelectionChange={(key) => {
          if (key !== null) {
            setFormData((prev) => ({
              ...prev,
              status: key as AssetStatus,
            }));
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>

      <Autocomplete
        selectedKey={formData.user?.id?.toString()}
        defaultItems={users}
        label={tAsset("user")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = users.find((o) => o.id === Number(key));
            if (selected) {
              setFormData((prev) => ({ ...prev, user: selected }));
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
        selectedKey={formData.office?.id?.toString()}
        defaultItems={offices}
        label={tAsset("office")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = offices.find((o) => o.id === Number(key));
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
        label={tAsset("department")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = departments.find((d) => d.id === Number(key));
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

      <Autocomplete
        selectedKey={formData.deviceType?.id?.toString()}
        defaultItems={deviceTypes}
        label={tAsset("deviceType")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = deviceTypes.find((d) => d.id === Number(key));
            if (selected) {
              setFormData((prev) => ({ ...prev, deviceType: selected }));
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
        selectedKey={formData.deviceModel?.id?.toString()}
        defaultItems={deviceModels}
        label={tAsset("deviceModel")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = deviceModels.find((d) => d.id === Number(key));
            if (selected) {
              setFormData((prev) => ({ ...prev, deviceModel: selected }));
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

      <DatePicker
        showMonthAndYearPickers
        label={tAsset("purchaseDate")}
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

      <Autocomplete
        selectedKey={formData.warrantyDuration?.toString()}
        defaultItems={Object.entries(WarrantyDuration).map(([, value]) => ({
          key: value,
          label: value,
        }))}
        label={tAsset("warrantyDuration")}
        onSelectionChange={(key) => {
          if (key !== null) {
            setFormData((prev) => ({
              ...prev,
              warrantyDuration: key as WarrantyDuration,
            }));
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>

      <Button color="primary" onPress={handleSubmit}>
        {tCta("submit")}
      </Button>
    </div>
  );
}
