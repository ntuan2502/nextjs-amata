"use client";

import { ENV } from "@/config";
import { ADMIN_ROUTES } from "@/constants/routes";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import axiosInstance from "@/libs/axiosInstance";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { Asset, DeviceType, DeviceModel } from "@/types/data";
import { OperatingSystem, Warranty } from "@/types/enum";
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  DatePicker,
  Divider,
  Input,
} from "@heroui/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddAssetAdminComponent() {
  const router = useRouter();
  const defaultDate = today(getLocalTimeZone());
  const [time, setTime] = useState<CalendarDate | null>(defaultDate);

  const { tAdmin, tCta, tAsset } = useAppTranslations();
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);

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
    fetchDeviceTypes();
    fetchDeviceModels();
  }, []);

  const fields = [
    { name: "internalCode", label: tAsset("code") },
    { name: "serialNumber", label: tAsset("serialNumber") },
  ];

  const handleSubmit = async () => {
    const {
      internalCode,
      serialNumber,
      deviceType,
      deviceModel,
      warranty,
      customProperties,
    } = formData;
    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/assets`, {
        internalCode,
        serialNumber,
        deviceTypeId: deviceType?.id,
        deviceModelId: deviceModel?.id,
        purchaseDate: time?.toDate("UTC").toISOString(),
        customProperties: {
          cpu: customProperties?.cpu,
          ram: customProperties?.ram,
          osType: customProperties?.osType,
          hardDrive: customProperties?.hardDrive,
          macAddress: customProperties?.macAddress,
        },
        warranty,
      });
      handleAxiosSuccess(res);
      router.push(ADMIN_ROUTES.ASSETS);
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
          <BreadcrumbItem href={ADMIN_ROUTES.ASSETS}>
            {tAdmin("assets.title")}
          </BreadcrumbItem>
          <BreadcrumbItem href={`${ADMIN_ROUTES.ASSETS}/add`}>
            {tCta("add")}
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
        selectedKey={formData.deviceType?.id?.toString()}
        defaultItems={deviceTypes}
        label={tAsset("deviceType")}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = deviceTypes.find((d) => d.id === key);
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
            const selected = deviceModels.find((d) => d.id === key);
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
        selectedKey={formData.warranty?.toString()}
        defaultItems={Object.entries(Warranty).map(([, value]) => ({
          key: value,
          label: value,
        }))}
        label={tAsset("warranty")}
        onSelectionChange={(key) => {
          if (key !== null) {
            setFormData((prev) => ({
              ...prev,
              warranty: key as Warranty,
            }));
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>

      <Divider />

      <Input
        key={tAsset("cpu")}
        label={tAsset("cpu")}
        value={formData.customProperties?.cpu}
        onValueChange={(val) =>
          setFormData((prev) => ({
            ...prev,
            customProperties: { ...prev.customProperties, cpu: val },
          }))
        }
      />
      <Input
        key={tAsset("ram")}
        label={tAsset("ram")}
        value={formData.customProperties?.ram}
        onValueChange={(val) =>
          setFormData((prev) => ({
            ...prev,
            customProperties: { ...prev.customProperties, ram: val },
          }))
        }
      />

      <Input
        key={tAsset("storage")}
        label={tAsset("storage")}
        value={formData.customProperties?.hardDrive}
        onValueChange={(val) =>
          setFormData((prev) => ({
            ...prev,
            customProperties: { ...prev.customProperties, hardDrive: val },
          }))
        }
      />

      <Autocomplete
        selectedKey={formData.customProperties?.osType ?? ""}
        defaultItems={Object.entries(OperatingSystem).map(([, value]) => ({
          key: value,
          label: value,
        }))}
        label={tAsset("osType")}
        onSelectionChange={(key) => {
          if (key !== null) {
            setFormData((prev) => ({
              ...prev,
              customProperties: {
                ...prev.customProperties,
                osType: key as OperatingSystem,
              },
            }));
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>

      <Input
        key={tAsset("macAddress")}
        label={tAsset("macAddress")}
        value={formData.customProperties?.macAddress}
        onValueChange={(val) =>
          setFormData((prev) => ({
            ...prev,
            customProperties: { ...prev.customProperties, macAddress: val },
          }))
        }
      />

      <Button color="primary" onPress={handleSubmit}>
        {tCta("submit")}
      </Button>
    </div>
  );
}
