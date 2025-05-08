export type Office = {
  id: number;
  name: string;
  internationalName?: string;
  shortName?: string;
  taxCode: string;
  address?: string;
};

export type Department = {
  id: number;
  name: string;
};
export type DeviceModel = {
  id: number;
  name: string;
};
export type DeviceType = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: Date;
  address?: string;
  avatar?: string;
  office?: Office;
  department?: Department;
};

export type Asset = {
  id: number;
  internalCode: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyDuration: string;
  status: string;
  user?: User;
  office?: Office;
  department?: Department;
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

export type ParamsWithId = {
  params: Promise<{
    id: string;
  }>;
};
