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
} from "@heroui/react";
import axiosInstance from "@/libs/axiosInstance";
import { ENV } from "@/config";
import { handleAxiosError } from "@/libs/handleAxiosFeedback";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { AssetTransaction } from "@/types/data";
import { rowsPerPage } from "@/constants/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import LoadingComponent from "@/components/ui/Loading";
import { ADMIN_ROUTES } from "@/constants/routes";
import Link from "next/link";
import dayjs from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function AssetTransactionsAdminComponent() {
  const { tAdmin, tCta, tAssetTransaction } = useAppTranslations();
  const [page, setPage] = useState(1);
  const [assetTransactions, setAssetTransactions] = useState<
    AssetTransaction[]
  >([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedAssetTransaction, setSelectedAssetTransaction] =
    useState<AssetTransaction | null>(null);

  useEffect(() => {
    fetchAsset();
  }, []);

  const fetchAsset = async () => {
    try {
      const res = await axiosInstance.get(
        `${ENV.API_URL}/asset-transactions?include=asset, user, department, office`
      );
      setAssetTransactions(res.data.data.assetTransactions);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const pages = Math.max(Math.ceil(assetTransactions.length / rowsPerPage), 1);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return assetTransactions.slice(start, end);
  }, [page, assetTransactions]);

  if (assetTransactions.length === 0) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.ASSET_TRANSACTION}>
            {tAdmin("assetTransactions.title")}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <Table
        aria-label={tAdmin("assetTransactions.title")}
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
        className="w-full"
        classNames={{ wrapper: "min-h-[222px] w-full" }}
      >
        <TableHeader>
          <TableColumn>{tAssetTransaction("internalCode")}</TableColumn>
          <TableColumn>{tAssetTransaction("office")}</TableColumn>
          <TableColumn>{tAssetTransaction("department")}</TableColumn>
          <TableColumn>{tAssetTransaction("user")}</TableColumn>
          <TableColumn>{tAssetTransaction("role")}</TableColumn>
          <TableColumn>{tAssetTransaction("type")}</TableColumn>
          <TableColumn>{tAssetTransaction("status")}</TableColumn>
          <TableColumn>{tAssetTransaction("signedAt")}</TableColumn>
          <TableColumn>{tAdmin("actions")}</TableColumn>
        </TableHeader>
        <TableBody items={items}>
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
                <div className="flex gap-2 items-center">
                  <Tooltip content={tCta("view")}>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => {
                        setSelectedAssetTransaction(item);
                        onOpen();
                      }}
                    >
                      <EyeIcon />
                    </Button>
                  </Tooltip>
                  {item.status === "PENDING" && (
                    <Tooltip content={tCta("confirmRequest")}>
                      <Link href={`/assets/${item.asset?.id}/confirm-request?type=${item.type}`}>
                        <Icon
                          className="pointer-events-none text-2xl"
                          icon="fa6-solid:code-merge"
                        />
                      </Link>
                    </Tooltip>
                  )}
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
                        <Icon
                          className="pointer-events-none text-2xl"
                          icon="line-md:file-filled"
                        />
                      </Button>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                  {/* <Tooltip content={tCta("edit")}>
                    <Link href={`${pathname}/${item.id}`}>
                      <EditIcon />
                    </Link>
                  </Tooltip>
                  <Tooltip content={tCta("delete")} color="danger">
                    <Button isIconOnly variant="light" color="danger">
                      <DeleteIcon />
                    </Button>
                  </Tooltip> */}
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
                {selectedAssetTransaction ? (
                  <>
                    <p>
                      <strong>{tAssetTransaction("internalCode")}:</strong>{" "}
                      {selectedAssetTransaction.asset?.internalCode}
                    </p>
                    <p>
                      <strong>{tAssetTransaction("office")}:</strong>{" "}
                      {selectedAssetTransaction.office?.name}
                    </p>
                    <p>
                      <strong>{tAssetTransaction("department")}:</strong>{" "}
                      {selectedAssetTransaction.department?.name}
                    </p>
                    <p>
                      <strong>{tAssetTransaction("user")}:</strong>{" "}
                      {selectedAssetTransaction.user?.name}
                    </p>
                    <p>
                      <strong>{tAssetTransaction("signedAt")}:</strong>{" "}
                      {selectedAssetTransaction.signedAt
                        ? dayjs(selectedAssetTransaction.signedAt).format(
                            "HH:mm:ss YYYY-MM-DD"
                          )
                        : "-"}
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
  );
}
