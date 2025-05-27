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
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  Breadcrumbs,
  BreadcrumbItem,
  Tab,
  Tabs,
} from "@heroui/react";
import axiosInstance from "@/libs/axiosInstance";
import { ENV } from "@/config";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { usePathname } from "next/navigation";
import { Asset, AssetTransaction, Office } from "@/types/data";
import { rowsPerPage } from "@/constants/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import LoadingComponent from "@/components/ui/Loading";
import { ADMIN_ROUTES } from "@/constants/routes";
import Link from "next/link";
import dayjs from "dayjs";
import { wordToNumber } from "@/utils/function";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import { SearchForm } from "@/components/ui/Search";

export default function AssetsAdminComponent() {
  const { tAdmin, tCta, tAsset, tAssetTransaction, tSwal } =
    useAppTranslations();
  const pathname = usePathname();
  const [page, setPage] = useState<number>(1);
  const [offices, setOffices] = useState<Office[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetTransactions, setAssetTransactions] = useState<
    AssetTransaction[]
  >([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tabSelected, setTabSelected] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOffices();
    fetchAssets();
  }, []);

  useEffect(() => {
    if (offices.length > 0 && !tabSelected) {
      setTabSelected(offices[0].id);
    }
    setPage(1);
  }, [offices, tabSelected]);

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const fetchOffices = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      setOffices(res.data.data.offices);
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssetTransactions = async (assetId: string) => {
    try {
      const res = await axiosInstance.get(
        `${ENV.API_URL}/asset-transactions?include=asset,user,office,department&filter=assetId=${assetId}`
      );
      setAssetTransactions(res.data.data.assetTransactions);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const exportToExcel = () => {
    const officeSeleted = offices.find((o) => o.id === tabSelected);
    const exportData = filteredData.map((item) => ({
      [tAsset("code")]: item.internalCode || "",
      [tAsset("deviceType")]: item.deviceType?.name || "",
      [tAsset("deviceModel")]: item.deviceModel?.name || "",
      [tAsset("serialNumber")]: item.serialNumber || "",
      [tAsset("office")]: item.assetTransactions?.[0]?.user?.office?.name || "",
      [tAsset("user")]: item.assetTransactions?.[0]?.user?.name || "",
      [tAsset("department")]:
        item.assetTransactions?.[0]?.user?.department?.name || "",
      [tAsset("cpu")]: item.customProperties?.cpu || "",
      [tAsset("ram")]: item.customProperties?.ram || "",
      [tAsset("storage")]: item.customProperties?.hardDrive || "",
      [tAsset("os")]: item.customProperties?.osType || "",
      [tAsset("purchaseDate")]: item.purchaseDate
        ? dayjs(item.purchaseDate).format("YYYY-MM-DD")
        : "",
      [tAsset("warranty")]: wordToNumber(item.warranty),
      [tAsset("endOfWarranty")]: item.purchaseDate
        ? dayjs(item.purchaseDate)
            .add(wordToNumber(item.warranty) || 3, "year")
            .format("YYYY-MM-DD")
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

    XLSX.writeFile(
      workbook,
      `AssetsReport_${officeSeleted?.shortName}_${dayjs().format(
        "YYYYMMDD_HHmmss"
      )}.xlsx`
    );
  };

  const filteredData = useMemo(() => {
    if (!tabSelected) return assets;

    return assets.filter((item) => {
      const belongsToSelectedOffice =
        item.assetTransactions?.[0]?.user?.office?.id === tabSelected;

      const keyword = searchQuery.toLowerCase();

      const matchesSearch =
        item.internalCode?.toLowerCase().includes(keyword) ||
        item.serialNumber?.toLowerCase().includes(keyword) ||
        item.deviceModel?.name?.toLowerCase().includes(keyword) ||
        item.deviceType?.name?.toLowerCase().includes(keyword) ||
        item.assetTransactions?.[0]?.user?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.assetTransactions?.[0]?.user?.department?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.customProperties?.cpu?.toLowerCase().includes(keyword) ||
        item.customProperties?.ram?.toLowerCase().includes(keyword) ||
        item.customProperties?.osType?.toLowerCase().includes(keyword) ||
        item.customProperties?.hardDrive?.toLowerCase().includes(keyword) ||
        item.customProperties?.macAddress?.toLowerCase().includes(keyword);

      return belongsToSelectedOffice && matchesSearch;
    });
  }, [assets, tabSelected, searchQuery]);

  const pages = Math.max(Math.ceil(filteredData.length / rowsPerPage), 1);
  const filteredCount = useMemo(() => filteredData.length, [filteredData]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [page, filteredData]);

  const handleDelete = async (item: Asset) => {
    Swal.fire({
      title: `${tSwal("title")} ${item.internalCode}?`,
      text: tSwal("text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: tSwal("confirmButtonText"),
      cancelButtonText: tSwal("cancelButtonText"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(
            `${ENV.API_URL}/assets/${item.id}`
          );
          handleAxiosSuccess(res);
          setAssets((prev) => prev.filter((o) => o.id !== item.id));

          Swal.fire({
            title: tSwal("confirmed.title"),
            text: `${item.internalCode} ${tSwal("confirmed.text")}`,
            icon: "success",
          });
        } catch (err) {
          handleAxiosError(err);
        }
      }
    });
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="px-6 mt-4 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.ASSETS}>
            {tAdmin("assets.title")}
          </BreadcrumbItem>
        </Breadcrumbs>
        <Button color="primary" as={Link} href={`${ADMIN_ROUTES.ASSETS}/add`}>
          {tCta("add")}
        </Button>
      </div>

      <p className="mb-4">
        {filteredCount} {tAdmin("entriesFound")}
      </p>

      <Tabs
        aria-label="Office Tabs"
        selectedKey={tabSelected}
        onSelectionChange={(key) => setTabSelected(String(key))}
        className="flex flex-wrap"
      >
        {offices.map((office) => (
          <Tab key={office.id} title={office.shortName}>
            <DataTable
              tAdmin={tAdmin}
              page={page}
              pages={pages}
              setPage={setPage}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleSearchSubmit={handleSearchSubmit}
              tAsset={tAsset}
              items={items}
              tCta={tCta}
              pathname={pathname}
              setSelectedAsset={setSelectedAsset}
              fetchAssetTransactions={fetchAssetTransactions}
              onOpen={onOpen}
              handleDelete={handleDelete}
              exportToExcel={exportToExcel}
            />
          </Tab>
        ))}
      </Tabs>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="5xl"
      >
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
                      <strong>{tAsset("office")}:</strong>{" "}
                      {selectedAsset.assetTransactions?.[0]?.user?.office?.name}
                    </p>
                    <p>
                      <strong>{tAsset("user")}:</strong>{" "}
                      {selectedAsset.assetTransactions?.[0]?.user?.name}
                    </p>
                    <p>
                      <strong>{tAsset("department")}:</strong>{" "}
                      {
                        selectedAsset.assetTransactions?.[0]?.user?.department
                          ?.name
                      }
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
                      <strong>{tAsset("os")}:</strong>{" "}
                      {selectedAsset.customProperties?.osType}
                    </p>
                    <p>
                      <strong>{tAsset("purchaseDate")}:</strong>{" "}
                      {dayjs(selectedAsset.purchaseDate).format("YYYY-MM-DD")}
                    </p>
                    <p>
                      <strong>{tAsset("warranty")}:</strong>{" "}
                      {wordToNumber(selectedAsset.warranty)}
                    </p>
                    <p>
                      <strong>{tAsset("endOfWarranty")}:</strong>{" "}
                      {dayjs(selectedAsset.purchaseDate)
                        .add(wordToNumber(selectedAsset.warranty) || 3, "year")
                        .format("YYYY-MM-DD")}
                    </p>
                  </>
                ) : (
                  <p>{tAdmin("noData")}</p>
                )}
                <Table
                  aria-label={tAdmin("assetTransactions.title")}
                  className="w-full"
                  classNames={{ wrapper: "min-h-[222px] w-full" }}
                >
                  <TableHeader>
                    <TableColumn>
                      {tAssetTransaction("internalCode")}
                    </TableColumn>
                    <TableColumn>{tAssetTransaction("office")}</TableColumn>
                    <TableColumn>{tAssetTransaction("department")}</TableColumn>
                    <TableColumn>{tAssetTransaction("user")}</TableColumn>
                    <TableColumn>{tAssetTransaction("role")}</TableColumn>
                    <TableColumn>{tAssetTransaction("type")}</TableColumn>
                    <TableColumn>{tAssetTransaction("status")}</TableColumn>
                    <TableColumn>{tAssetTransaction("signedAt")}</TableColumn>
                    <TableColumn>{tAssetTransaction("file")}</TableColumn>
                  </TableHeader>
                  <TableBody items={assetTransactions}>
                    {(item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.asset?.internalCode || "-"}</TableCell>
                        <TableCell>{item.office?.name || "-"}</TableCell>
                        <TableCell>{item.department?.name || "-"}</TableCell>
                        <TableCell>{item.user?.name || "-"}</TableCell>
                        <TableCell>{item.role || "-"}</TableCell>
                        <TableCell>{item.type || "-"}</TableCell>
                        <TableCell>{item.status || "-"}</TableCell>
                        <TableCell>
                          {item.signedAt
                            ? dayjs(item.signedAt).format("HH:mm:ss YYYY-MM-DD")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {item.handoverFilePath ? (
                            <Tooltip content={tCta("view")}>
                              <Button
                                isIconOnly
                                variant="light"
                                onPress={() => {
                                  window.open(
                                    ENV.API_URL + item.handoverFilePath,
                                    "_blank"
                                  );
                                }}
                              >
                                <EyeIcon />
                              </Button>
                            </Tooltip>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
  );
}

interface DataTableProps {
  tAdmin: (key: string) => string;
  page: number;
  pages: number;
  setPage: (page: number) => void;
  searchInput: string;
  setSearchInput: (query: string) => void;
  handleSearchSubmit: () => void;
  tAsset: (key: string) => string;
  items: Asset[];
  tCta: (key: string) => string;
  pathname: string;
  setSelectedAsset: (asset: Asset) => void;
  fetchAssetTransactions: (assetId: string) => void;
  onOpen: () => void;
  handleDelete: (item: Asset) => void;
  exportToExcel: () => void;
}

function DataTable({
  tAdmin,
  page,
  pages,
  setPage,
  searchInput,
  setSearchInput,
  handleSearchSubmit,
  tAsset,
  items,
  tCta,
  pathname,
  setSelectedAsset,
  fetchAssetTransactions,
  onOpen,
  handleDelete,
  exportToExcel,
}: DataTableProps) {
  return (
    <Table
      aria-label={tAdmin("assets.title")}
      bottomContent={
        <div className="flex justify-center mt-4">
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
      topContent={
        <div className="flex-row sm:flex w-full justify-between items-center">
          <SearchForm
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
          />
          <Button
            className="p-4 rounded-full text-white"
            color="success"
            onPress={exportToExcel}
          >
            .xlsx
          </Button>
        </div>
      }
      className="w-full"
      classNames={{ wrapper: "min-h-[222px] w-full" }}
    >
      <TableHeader>
        <TableColumn>{tAsset("code")}</TableColumn>
        <TableColumn>{tAsset("deviceType")}</TableColumn>
        <TableColumn>{tAsset("deviceModel")}</TableColumn>
        <TableColumn>{tAsset("serialNumber")}</TableColumn>
        <TableColumn>{tAsset("office")}</TableColumn>
        <TableColumn>{tAsset("user")}</TableColumn>
        <TableColumn>{tAsset("department")}</TableColumn>
        <TableColumn>{tAsset("cpu")}</TableColumn>
        <TableColumn>{tAsset("ram")}</TableColumn>
        <TableColumn>{tAsset("storage")}</TableColumn>
        <TableColumn>{tAsset("os")}</TableColumn>
        <TableColumn>{tAsset("purchaseDate")}</TableColumn>
        <TableColumn>{tAsset("warranty")}</TableColumn>
        <TableColumn>{tAsset("endOfWarranty")}</TableColumn>
        <TableColumn>{tAdmin("actions")}</TableColumn>
      </TableHeader>
      <TableBody items={items} emptyContent={tAdmin("noData")}>
        {(item) => (
          <TableRow
            key={item.id}
            className={
              dayjs(item.purchaseDate)
                .add(wordToNumber(item.warranty) || 3, "year")
                .format("YYYY-MM-DD") <= dayjs().format("YYYY-MM-DD")
                ? "bg-red-200"
                : ""
            }
          >
            <TableCell>{item.internalCode}</TableCell>
            <TableCell>{item.deviceType?.name || "-"}</TableCell>
            <TableCell>{item.deviceModel?.name || "-"}</TableCell>
            <TableCell>{item.serialNumber}</TableCell>
            <TableCell>
              {item.assetTransactions?.[0]?.user?.office?.shortName || "-"}
            </TableCell>
            <TableCell>
              {item.assetTransactions?.[0]?.user?.name || "-"}
            </TableCell>
            <TableCell>
              {item.assetTransactions?.[0]?.user?.department?.name || "-"}
            </TableCell>
            <TableCell>{item.customProperties?.cpu || "-"}</TableCell>
            <TableCell>{item.customProperties?.ram || "-"}</TableCell>
            <TableCell>{item.customProperties?.hardDrive || "-"}</TableCell>
            <TableCell>{item.customProperties?.osType || "-"}</TableCell>
            <TableCell>
              {dayjs(item.purchaseDate).format("YYYY-MM-DD")}
            </TableCell>
            <TableCell>{wordToNumber(item.warranty)}</TableCell>
            <TableCell>
              {dayjs(item.purchaseDate)
                .add(wordToNumber(item.warranty) || 3, "year")
                .format("YYYY-MM-DD")}
            </TableCell>
            <TableCell>
              <div className="flex gap-2 items-center">
                <Tooltip content={tCta("createRequest")}>
                  <Link href={`${pathname}/${item.id}/create-request`}>
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="fa6-solid:code-merge"
                    />
                  </Link>
                </Tooltip>
                <Tooltip content={tCta("view")}>
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => {
                      setSelectedAsset(item);
                      fetchAssetTransactions(item.id);
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
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(item)}
                  >
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
}
