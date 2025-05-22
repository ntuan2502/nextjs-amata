import { ButtonProps } from "@heroui/react";
import {
  Gender,
  TransactionRole,
  TransactionStatus,
  TransactionType,
  Warranty,
} from "./enum";

export type Office = {
  id: string;
  name: string;
  internationalName?: string;
  shortName?: string;
  taxCode: string;
  address?: string;
};

export type Department = {
  id: string;
  name: string;
};
export type DeviceModel = {
  id: string;
  name: string;
};
export type DeviceType = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  gender?: Gender;
  dob?: Date;
  address?: string;
  avatar?: string;
  office?: Office;
  department?: Department;
};

export type Asset = {
  id: string;
  internalCode: string;
  serialNumber: string;
  purchaseDate: string;
  warranty: Warranty;
  deviceType?: DeviceType;
  deviceModel?: DeviceModel;
  customProperties?: {
    cpu?: string;
    ram?: string;
    osType?: string;
    hardDrive?: string;
    macAddress?: string;
  };
};

export type AssetTransaction = {
  id: string;
  note?: string;

  signature?: string;
  signedAt?: Date;

  role?: TransactionRole;
  type?: TransactionType;
  status?: TransactionStatus;

  user?: User;
  fromUser?: User;
  toUser?: User;
  
  asset?: Asset;
  department?: Department;
  office?: Office;

  handoverFilePath?: string;
};

export type ParamsWithId = {
  params: Promise<{
    id: string;
  }>;
};

export type ChartData = {
  name: string;
  value: number;
  [key: string]: string | number;
};

export type CircleChartProps = {
  title: string;
  color: ButtonProps["color"];
  chartData: ChartData[];
  total: number;
};
