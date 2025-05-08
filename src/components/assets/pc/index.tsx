"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import axiosInstance from "@/libs/axiosInstance";
import { ENV } from "@/config";
import { handleAxiosError } from "@/libs/handleAxiosFeedback";
import { rowsPerPage } from "@/constants/config";

type Asset = {
  id: number;
  internalCode: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyDuration: string;
  status: string;
  user?: {
    name: string;
  };
  deviceType?: {
    name: string;
  };
  deviceModel?: {
    name: string;
  };
  customProperties?: {
    cpu?: string;
    ram?: string;
    osType?: string;
    hardDrive?: string;
    macAddress?: string;
  };
};

export default function AssetPCComponent() {
  const [page, setPage] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    fetchAsset();
  }, []);

  const fetchAsset = async () => {
    try {
      const res = await axiosInstance.get(
        `${ENV.API_URL}/assets?include=user,deviceType,deviceModel`
      );
      setAssets(res.data.data.assets);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const pages = Math.ceil(assets.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return assets.slice(start, end);
  }, [page, assets]);

  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
            siblings={2}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn>Code</TableColumn>
        <TableColumn>User</TableColumn>
        <TableColumn>Serial Number</TableColumn>
        <TableColumn>Type</TableColumn>
        <TableColumn>Model</TableColumn>
        <TableColumn>OS</TableColumn>
        <TableColumn>CPU</TableColumn>
        <TableColumn>RAM</TableColumn>
        <TableColumn>Hard Drive</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Purchase Date</TableColumn>
        <TableColumn>Warranty</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.internalCode}</TableCell>
            <TableCell>{item.user?.name || "-"}</TableCell>
            <TableCell>{item.serialNumber}</TableCell>
            <TableCell>{item.deviceType?.name}</TableCell>
            <TableCell>{item.deviceModel?.name}</TableCell>
            <TableCell>{item.customProperties?.osType || "-"}</TableCell>
            <TableCell>{item.customProperties?.cpu || "-"}</TableCell>
            <TableCell>{item.customProperties?.ram || "-"}</TableCell>
            <TableCell>{item.customProperties?.hardDrive || "-"}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>
              {new Date(item.purchaseDate).toISOString().split("T")[0]}
            </TableCell>
            <TableCell>{item.warrantyDuration} năm</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
