"use client";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
  PolarAngleAxis,
} from "recharts";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Card,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from "@heroui/react";
import type { ButtonProps, CardProps } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ADMIN_ROUTES } from "@/constants/routes";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { ENV } from "@/config";
import axiosInstance from "@/libs/axiosInstance";
import { handleAxiosError } from "@/libs/handleAxiosFeedback";
import {
  Asset,
  Department,
  DeviceModel,
  DeviceType,
  Office,
} from "@/types/data";
import { User } from "@/types/auth";
import LoadingComponent from "@/components/ui/Loading";

type ChartData = {
  name: string;
  value: number;
  [key: string]: string | number;
};

type CircleChartProps = {
  title: string;
  color: ButtonProps["color"];
  chartData: ChartData[];
  total: number;
};

export default function DashboardAdminComponent() {
  const { tAdmin } = useAppTranslations();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [chartData, setChartData] = useState<CircleChartProps[]>([]);

  const updateChartData = useCallback(() => {
    setChartData([
      {
        title: tAdmin("offices.title"),
        color: "default",
        total: offices.length,
        chartData: [
          {
            name: tAdmin("offices.title"),
            value: offices.length,
            fill: "hsl(var(--heroui-primary))",
          },
        ],
      },
      {
        title: tAdmin("departments.title"),
        color: "primary",
        total: departments.length,
        chartData: [
          {
            name: tAdmin("departments.title"),
            value: departments.length,
            fill: "hsl(var(--heroui-primary))",
          },
        ],
      },
      {
        title: tAdmin("deviceTypes.title"),
        color: "secondary",
        total: deviceTypes.length,
        chartData: [
          {
            name: tAdmin("deviceTypes.title"),
            value: deviceTypes.length,
            fill: "hsl(var(--heroui-secondary))",
          },
        ],
      },
      {
        title: tAdmin("deviceModels.title"),
        color: "success",
        total: deviceModels.length,
        chartData: [
          {
            name: tAdmin("deviceModels.title"),
            value: deviceModels.length,
            fill: "hsl(var(--heroui-success))",
          },
        ],
      },
      {
        title: tAdmin("users.title"),
        color: "warning",
        total: users.length,
        chartData: [
          {
            name: tAdmin("users.title"),
            value: users.length,
            fill: "hsl(var(--heroui-warning))",
          },
        ],
      },
      {
        title: tAdmin("assets.title"),
        color: "danger",
        total: assets.length,
        chartData: [
          {
            name: tAdmin("assets.title"),
            value: assets.length,
            fill: "hsl(var(--heroui-danger))",
          },
        ],
      },
    ]);
  }, [
    tAdmin,
    offices.length,
    departments.length,
    deviceTypes.length,
    deviceModels.length,
    users.length,
    assets.length,
  ]);

  useEffect(() => {
    fetchDepartments();
    fetchDeviceModels();
    fetchDeviceTypes();
    fetchOffices();
    fetchUsers();
    fetchAssets();
  }, []);

  useEffect(() => {
    updateChartData();
  }, [updateChartData]);

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/departments`);
      setDepartments(res.data.data.departments);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchOffices = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      setOffices(res.data.data.offices);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchDeviceModels = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-models`);
      setDeviceModels(res.data.data.deviceModels);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/device-types`);
      setDeviceTypes(res.data.data.deviceTypes);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/users`);
      setUsers(res.data.data.users);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/assets`);
      setAssets(res.data.data.assets);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  if (
    departments.length === 0 ||
    offices.length === 0 ||
    deviceModels.length === 0 ||
    deviceTypes.length === 0 ||
    users.length === 0 ||
    assets.length === 0
  ) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {chartData.map((item, index) => (
          <CircleChartCard key={index} {...item} />
        ))}
      </dl>
    </div>
  );
}

const formatTotal = (value: number | undefined) => {
  return value?.toLocaleString() ?? "0";
};

const CircleChartCard = forwardRef<
  HTMLDivElement,
  Omit<CardProps, "children"> & CircleChartProps
>(({ className, title, color, chartData, total, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "h-[250px] border border-transparent dark:border-default-100",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-y-2 p-4 pb-0">
        <div className="flex items-center justify-between gap-x-2">
          <dt>
            <h3 className="text-small font-medium text-default-500">{title}</h3>
          </dt>
          <div className="flex items-center justify-end gap-x-2">
            {/* <Dropdown
              classNames={{
                content: "min-w-[120px]",
              }}
              placement="bottom-end"
            >
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <Icon height={16} icon="solar:menu-dots-bold" width={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                itemClasses={{
                  title: "text-tiny",
                }}
                variant="flat"
              >
                <DropdownItem key="view-details">View Details</DropdownItem>
                <DropdownItem key="export-data">Export Data</DropdownItem>
                <DropdownItem key="set-alert">Set Alert</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
          </div>
        </div>
      </div>
      <div className="flex h-full gap-x-3">
        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-none"
          height="100%"
          width="100%"
        >
          <RadialBarChart
            barSize={10}
            cx="50%"
            cy="50%"
            data={chartData}
            endAngle={-45}
            innerRadius={90}
            outerRadius={70}
            startAngle={225}
          >
            <PolarAngleAxis
              angleAxisId={0}
              domain={[0, total]}
              tick={false}
              type="number"
            />
            <RadialBar
              angleAxisId={0}
              animationDuration={1000}
              animationEasing="ease"
              background={{
                fill: "hsl(var(--heroui-default-100))",
              }}
              cornerRadius={12}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--heroui-${
                    color === "default" ? "foreground" : color
                  }))`}
                />
              ))}
            </RadialBar>
            <g>
              <text textAnchor="middle" x="50%" y="48%">
                <tspan
                  className="fill-default-500 text-tiny"
                  dy="-0.5em"
                  x="50%"
                >
                  {chartData?.[0].name}
                </tspan>
                <tspan
                  className="fill-foreground text-medium font-semibold"
                  dy="1.5em"
                  x="50%"
                >
                  {formatTotal(total)}
                </tspan>
              </text>
            </g>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

CircleChartCard.displayName = "CircleChartCard";
