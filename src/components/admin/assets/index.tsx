"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import axiosInstance from "@/libs/axiosInstance";
import { ENV } from "@/config";
import { handleAxiosError } from "@/libs/handleAxiosFeedback";
import { rowsPerPage } from "@/constants/config";
import { Asset, Office } from "@/types/data";
import LoadingComponent from "@/components/ui/Loading";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ADMIN_ROUTES } from "@/constants/routes";
import { EyeIcon } from "@/components/icons/EyeIcon";
import Link from "next/link";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";

export default function AssetsAdminComponent() {
  const { tAdmin, tAsset, tCta, tLabels } = useAppTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryOffice = searchParams.get("office") || "";
  const querySearch = searchParams.get("search") || "";
  const queryPage = parseInt(searchParams.get("page") || "1", 10);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();

  const [page, setPage] = useState(queryPage);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [tabSelected, setTabSelected] = useState<string>(queryOffice);
  const [searchQuery, setSearchQuery] = useState<string>(querySearch);

  const officeFetched = useRef(false);

  const handleTabChange = useCallback(
    (key: string) => {
      setTabSelected(key);
      setPage(1);
      const params = new URLSearchParams(searchParams);
      params.set("office", key);
      params.delete("page");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const fetchOffice = useCallback(async () => {
    if (officeFetched.current) return;
    officeFetched.current = true;

    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      const data: Office[] = res.data.data.offices;
      setOffices(data);
      if (!queryOffice && data.length > 0) {
        handleTabChange(data[0].shortName || "");
      }
    } catch (err) {
      handleAxiosError(err);
    }
  }, [queryOffice, handleTabChange]);

  const fetchAsset = async (tab: string) => {
    const filterField = tab === "ITAM" ? "user.name" : "office.shortName";
    const url = `${ENV.API_URL}/assets?include=user,office,department,deviceType,deviceModel&filter=${filterField}=${tab}`;

    try {
      const res = await axiosInstance.get(url);
      const assets = res.data.data.assets;
      setAssets(assets);
      setFilteredAssets(assets);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const filterAssets = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      const filtered = assets.filter(
        (item) =>
          item.internalCode?.toLowerCase().includes(q) ||
          item.user?.name?.toLowerCase().includes(q) ||
          item.deviceType?.name?.toLowerCase().includes(q) ||
          item.deviceModel?.name?.toLowerCase().includes(q) ||
          item.serialNumber?.toLowerCase().includes(q) ||
          item.customProperties?.osType?.toLowerCase().includes(q) ||
          item.customProperties?.cpu?.toLowerCase().includes(q) ||
          item.status?.toLowerCase().includes(q) ||
          item.warrantyDuration?.toLowerCase().includes(q)
      );
      setFilteredAssets(filtered);
      setPage(1);
    },
    [assets]
  );

  const exportToExcel = () => {
    const dataForExport = filteredAssets.map((asset) => ({
      "Asset Code": asset.internalCode,
      User: asset.user?.name || "-",
      Office: asset.office?.shortName || "-",
      "Device Type": asset.deviceType?.name || "-",
      "Device Model": asset.deviceModel?.name || "-",
      "Serial Number": asset.serialNumber,
      OS: asset.customProperties?.osType || "-",
      CPU: asset.customProperties?.cpu || "-",
      RAM: asset.customProperties?.ram || "-",
      Storage: asset.customProperties?.hardDrive || "-",
      Status: asset.status,
      "Purchase Date": new Date(asset.purchaseDate).toISOString().split("T")[0],
      "Warranty Duration": asset.warrantyDuration,
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");

    const fileName = `assets_data_${tabSelected || "all_offices"}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const handoverAsset = async (asset: Asset) => {
    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/assets/handover`, {
        assetId: asset.id,
      });
      const fullUrl = `${ENV.API_URL}${res.data.data.downloadUrl}`;
      window.open(fullUrl, "_blank");
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    fetchOffice();
  }, [fetchOffice]);

  useEffect(() => {
    if (tabSelected) {
      fetchAsset(tabSelected);
    }
  }, [tabSelected]);

  useEffect(() => {
    if (querySearch && assets.length > 0) {
      filterAssets(querySearch);
    }
  }, [querySearch, assets, filterAssets]);

  const handleSearchSubmit = () => {
    filterAssets(searchQuery);
    const params = new URLSearchParams(searchParams);
    params.set("search", searchQuery);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const pages = Math.max(Math.ceil(filteredAssets.length / rowsPerPage), 1);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredAssets.slice(start, end);
  }, [page, filteredAssets]);

  if (assets.length === 0) {
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
        </Breadcrumbs>
      </div>

      <div>
        <Tabs
          aria-label="Options"
          selectedKey={tabSelected}
          onSelectionChange={(key) => handleTabChange(String(key))}
        >
          {[...offices.map((o) => o.shortName), "ITAM"].map((key) => (
            <Tab key={key} title={key}>
              <Card>
                <CardBody>
                  <AssetTable
                    items={items}
                    page={page}
                    pages={pages}
                    onPageChange={handlePageChange}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setSelectedAsset={setSelectedAsset}
                    handleSearchSubmit={handleSearchSubmit}
                    filteredLength={filteredAssets.length}
                    exportToExcel={exportToExcel}
                    tAsset={tAsset}
                    tCta={tCta}
                    tLabels={tLabels}
                    tAdmin={tAdmin}
                    onOpen={onOpen}
                    pathname={pathname}
                    handoverAsset={handoverAsset}
                  />
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>{tAdmin("information")}</ModalHeader>
                <ModalBody className="space-y-2">
                  {selectedAsset ? (
                    <>
                      <p>
                        <strong>{tAsset("code")}:</strong>{" "}
                        {selectedAsset.internalCode}
                      </p>
                      <p>
                        <strong>{tAsset("user")}:</strong>{" "}
                        {selectedAsset.user?.name}
                      </p>
                      <p>
                        <strong>{tAsset("office")}:</strong>{" "}
                        {selectedAsset.office?.shortName}
                      </p>
                      <p>
                        <strong>{tAsset("deviceType")}:</strong>{" "}
                        {selectedAsset.deviceType?.name}
                      </p>
                      <p>
                        <strong>{tAsset("deviceModel")}:</strong>{" "}
                        {selectedAsset.deviceModel?.name}
                      </p>
                      <p>
                        <strong>{tAsset("serialNumber")}:</strong>{" "}
                        {selectedAsset.serialNumber}
                      </p>
                      <p>
                        <strong>{tAsset("os")}:</strong>{" "}
                        {selectedAsset.customProperties?.osType}
                      </p>
                      <p>
                        <strong>{tAsset("cpu")}:</strong>{" "}
                        {selectedAsset.customProperties?.cpu}
                      </p>
                      <p>
                        <strong>{tAsset("ram")}:</strong>{" "}
                        {selectedAsset.customProperties?.ram}
                      </p>
                      <p>
                        <strong>{tAsset("storage")}:</strong>{" "}
                        {selectedAsset.customProperties?.hardDrive}
                      </p>
                      <p>
                        <strong>{tAsset("status")}:</strong>{" "}
                        {selectedAsset.status}
                      </p>
                      <p>
                        <strong>{tAsset("purchaseDate")}:</strong>{" "}
                        {
                          new Date(selectedAsset.purchaseDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </p>
                      <p>
                        <strong>{tAsset("warrantyDuration")}:</strong>{" "}
                        {selectedAsset.warrantyDuration}{" "}
                        {parseInt(selectedAsset.warrantyDuration) > 1
                          ? tAsset("years")
                          : tAsset("year")}
                      </p>
                    </>
                  ) : (
                    <p>{tAdmin("no_data")}</p>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    {tCta("close")}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

interface AssetTableProps {
  items: Asset[];
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedAsset: (query: Asset) => void;
  handleSearchSubmit: () => void;
  filteredLength: number;
  exportToExcel: () => void;
  tAsset: (key: string) => string;
  tCta: (key: string) => string;
  tLabels: (key: string) => string;
  tAdmin: (key: string) => string;
  onOpen: () => void;
  pathname: string;
  handoverAsset: (query: Asset) => void;
}

export const AssetTable = ({
  items,
  page,
  pages,
  onPageChange,
  searchQuery,
  setSearchQuery,
  setSelectedAsset,
  handleSearchSubmit,
  filteredLength,
  exportToExcel,
  tAsset,
  tCta,
  tLabels,
  tAdmin,
  onOpen,
  pathname,
  handoverAsset,
}: AssetTableProps) => (
  <Table
    aria-label="Asset Table"
    bottomContent={
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={onPageChange}
          siblings={2}
        />
      </div>
    }
    classNames={{
      wrapper: "min-h-[222px]",
    }}
    topContent={
      <div className="flex-row sm:flex w-full justify-between items-center">
        <div className="flex justify-center items-center">
          <Input
            type="text"
            placeholder={tLabels("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-96"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            autoFocus
          />
          <Button color="primary" className="mx-3" onPress={handleSearchSubmit}>
            {tCta("submit")}
          </Button>
        </div>
        <p>
          {filteredLength} {tLabels("entriesFound")}
        </p>
        <Button
          className="p-4 rounded-full text-white"
          color="success"
          onPress={exportToExcel}
        >
          <Icon
            className="flex-none outline-none [&>path]:stroke-[2]"
            icon="material-symbols:download"
            width={20}
          />
          .xlsx
        </Button>
      </div>
    }
  >
    <TableHeader>
      <TableColumn>{tAsset("code")}</TableColumn>
      <TableColumn>{tAsset("user")}</TableColumn>
      <TableColumn>{tAsset("office")}</TableColumn>
      <TableColumn>{tAsset("deviceType")}</TableColumn>
      <TableColumn>{tAsset("deviceModel")}</TableColumn>
      <TableColumn>{tAsset("serialNumber")}</TableColumn>
      <TableColumn>{tAsset("os")}</TableColumn>
      <TableColumn>{tAsset("cpu")}</TableColumn>
      <TableColumn>{tAsset("ram")}</TableColumn>
      <TableColumn>{tAsset("storage")}</TableColumn>
      <TableColumn>{tAsset("status")}</TableColumn>
      <TableColumn>{tAsset("purchaseDate")}</TableColumn>
      <TableColumn>{tAsset("warrantyDuration")}</TableColumn>
      <TableColumn>{tAdmin("actions")}</TableColumn>
    </TableHeader>
    <TableBody items={items}>
      {(item) => (
        <TableRow key={item.id}>
          <TableCell>{item.internalCode}</TableCell>
          <TableCell>{item.user?.name || "-"}</TableCell>
          <TableCell>{item.office?.shortName || "-"}</TableCell>
          <TableCell>{item.deviceType?.name || "-"}</TableCell>
          <TableCell>{item.deviceModel?.name || "-"}</TableCell>
          <TableCell>{item.serialNumber}</TableCell>
          <TableCell>{item.customProperties?.osType || "-"}</TableCell>
          <TableCell>{item.customProperties?.cpu || "-"}</TableCell>
          <TableCell>{item.customProperties?.ram || "-"}</TableCell>
          <TableCell>{item.customProperties?.hardDrive || "-"}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>
            {new Date(item.purchaseDate).toISOString().split("T")[0]}
          </TableCell>
          <TableCell>
            {item.warrantyDuration}{" "}
            {parseInt(item.warrantyDuration) > 1
              ? tAsset("years")
              : tAsset("year")}
          </TableCell>
          <TableCell>
            <div className="flex gap-2 items-center">
              <Tooltip content="Handover asset">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => {
                    handoverAsset(item);
                  }}
                >
                  <EyeIcon />
                </Button>
              </Tooltip>
              <Tooltip content={tCta("view")}>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => {
                    setSelectedAsset(item);
                    onOpen();
                  }}
                >
                  <EyeIcon />
                </Button>
              </Tooltip>
              <Tooltip content={tCta("edit")}>
                <Link href={`${pathname}/${item.id}`}>
                  <EditIcon />
                </Link>
              </Tooltip>
              <Tooltip content={tCta("delete")} color="danger">
                <Button isIconOnly variant="light" color="danger">
                  <DeleteIcon />
                </Button>
              </Tooltip>
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);
