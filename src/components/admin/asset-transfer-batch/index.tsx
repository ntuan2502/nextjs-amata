"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@heroui/react";
import axiosInstance from "@/libs/axiosInstance";
import { ENV } from "@/config";
import { handleAxiosError } from "@/libs/handleAxiosFeedback";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { AssetTransferBatch } from "@/types/data";
import { rowsPerPage } from "@/constants/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import LoadingComponent from "@/components/ui/Loading";
import { ADMIN_ROUTES } from "@/constants/routes";
import dayjs from "dayjs";
import { SearchForm } from "@/components/ui/Search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { TransactionDirection, TransactionStatus } from "@/types/enum";

export default function AssetTransferBatchAdminComponent() {
  const { tAdmin, tCta, tAssetTransaction } = useAppTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [assetTransferBatch, setAssetTransferBatch] = useState<
    AssetTransferBatch[]
  >([]);
  const [selectedAssetTransferBatch, setSelectedAssetTransferBatch] =
    useState<AssetTransferBatch | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAssetTransferBatch();
  }, []);

  // ✅ Hàm update URL theo thứ tự: page -> search
  const updateURL = useCallback(
    (newSearch: string, newPage: number) => {
      const params = new URLSearchParams();

      params.set("page", newPage.toString());
      if (newSearch) params.set("search", newSearch);

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(url, { scroll: false });
    },
    [pathname, router]
  );

  // ✅ Đồng bộ state với URL (theo thứ tự page -> search)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search") ?? "";

    const pageToSet = pageParam ? Number(pageParam) : 1;

    if (!pageParam) {
      const params = new URLSearchParams();
      params.set("page", "1");
      if (searchParam) params.set("search", searchParam);

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(url, { scroll: false });
      return;
    }

    setPage(pageToSet);
    setSearchInput(searchParam);
    setSearchQuery(searchParam);
  }, [searchParams, pathname, router]);

  const fetchAssetTransferBatch = async () => {
    try {
      const res = await axiosInstance.get(
        `${ENV.API_URL}/asset-transfer-batch`
      );
      setAssetTransferBatch(res.data.data.assetTransferBatch);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
    updateURL(searchInput, 1);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return assetTransferBatch;
    const keyword = searchQuery.toLowerCase();
    return assetTransferBatch.filter((item) => {
      return (
        item.note?.toLowerCase().includes(keyword) ||
        dayjs(item.createdAt).format("HH:mm:ss YYYY-MM-DD").includes(keyword)
      );
    });
  }, [assetTransferBatch, searchQuery]);

  const pages = Math.max(Math.ceil(filteredData.length / rowsPerPage), 1);
  const filteredCount = useMemo(() => filteredData.length, [filteredData]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [page, filteredData]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="px-6 mt-4 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.ASSET_TRANSFER_BATCH}>
            {tAdmin("assetTransferBatch.title")}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <p className="mb-4">
        {filteredCount} {tAdmin("entriesFound")}
      </p>

      <Table
        aria-label={tAdmin("assetTransferBatch.title")}
        bottomContent={
          <div className="flex justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(newPage) => {
                if (newPage !== page) {
                  setPage(newPage);
                  updateURL(searchQuery, newPage);
                }
              }}
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
          </div>
        }
        className="w-full"
        classNames={{ wrapper: "min-h-[222px] w-full" }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Data</TableColumn>
          <TableColumn>Note</TableColumn>
          <TableColumn>{tAdmin("actions")}</TableColumn>
        </TableHeader>
        <TableBody items={items} emptyContent={tAdmin("noData")}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id || "-"}</TableCell>
              <TableCell>
                {item.assetTransactions
                  .filter(
                    (tx) =>
                      tx.status === TransactionStatus.COMPLETED &&
                      tx.direction === TransactionDirection.INCOMING
                  )
                  .map((tx) => tx.asset?.internalCode ?? "")
                  .join(", ")}
              </TableCell>
              <TableCell>{item.note || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Tooltip content={tCta("view")}>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => {
                        setSelectedAssetTransferBatch(item);
                        onOpen();
                      }}
                    >
                      <EyeIcon />
                    </Button>
                  </Tooltip>
                  {item.assetTransactions.some(
                    (tx) => tx.status === "PENDING"
                  ) && (
                    <Tooltip content={tCta("confirmRequest")}>
                      <Link
                        href={`/asset-transfer-batch/${item.id}/confirm-request?type=TRANSFER`}
                      >
                        <Icon
                          className="pointer-events-none text-2xl"
                          icon="fa6-solid:code-merge"
                        />
                      </Link>
                    </Tooltip>
                  )}
                  {item.handover && (
                    <Tooltip content={tAssetTransaction("file")}>
                      <Link
                        href={ENV.API_URL + item.handover.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon
                          className="pointer-events-none text-2xl"
                          icon="line-md:file-filled"
                        />
                      </Link>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
                {selectedAssetTransferBatch ? (
                  <>
                    <p>
                      <strong>ID:</strong> {selectedAssetTransferBatch.id}
                    </p>
                    <p>
                      <strong>Note:</strong> {selectedAssetTransferBatch.note}
                    </p>
                  </>
                ) : (
                  <p>{tAdmin("noData")}</p>
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
  );
}
