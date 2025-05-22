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
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { usePathname } from "next/navigation";
import { Office } from "@/types/data";
import { rowsPerPage } from "@/constants/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import LoadingComponent from "@/components/ui/Loading";
import { ADMIN_ROUTES } from "@/constants/routes";
import Link from "next/link";
import Swal from "sweetalert2";

export default function OfficesAdminComponent() {
  const { tAdmin, tCta, tSwal } = useAppTranslations();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [offices, setOffices] = useState<Office[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  useEffect(() => {
    fetchOffice();
  }, []);

  const fetchOffice = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/offices`);
      setOffices(res.data.data.offices);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const pages = Math.max(Math.ceil(offices.length / rowsPerPage), 1);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return offices.slice(start, end);
  }, [page, offices]);

  const handleDelete = async (item: Office) => {
    Swal.fire({
      title: `${tSwal("title")} ${item.name}?`,
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
            `${ENV.API_URL}/offices/${item.id}`
          );
          handleAxiosSuccess(res);
          await fetchOffice();
        } catch (err) {
          handleAxiosError(err);
        }
        Swal.fire({
          title: tSwal("confirmed.title"),
          text: `${item.name} ${tSwal("confirmed.text")}`,
          icon: "success",
        });
      }
    });
  };

  if (offices.length === 0) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.OFFICES}>
            {tAdmin("offices.title")}
          </BreadcrumbItem>
        </Breadcrumbs>
        <Button color="primary" as={Link} href={`${ADMIN_ROUTES.OFFICES}/add`}>
          {tCta("add")}
        </Button>
      </div>

      <Table
        aria-label={tAdmin("offices.title")}
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
          <TableColumn>{tAdmin("name")}</TableColumn>
          <TableColumn>{tAdmin("offices.internationalName")}</TableColumn>
          <TableColumn>{tAdmin("offices.shortName")}</TableColumn>
          {/* <TableColumn>{tAdmin("offices.taxCode")}</TableColumn>
          <TableColumn>{tAdmin("offices.address")}</TableColumn> */}
          <TableColumn>{tAdmin("actions")}</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name || "-"}</TableCell>
              <TableCell>{item.internationalName || "-"}</TableCell>
              <TableCell>{item.shortName || "-"}</TableCell>
              {/* <TableCell>{item.taxCode || "-"}</TableCell>
              <TableCell>{item.address || "-"}</TableCell> */}
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Tooltip content={tCta("view")}>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => {
                        setSelectedOffice(item);
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
                {selectedOffice ? (
                  <>
                    <p>
                      <strong>{tAdmin("name")}:</strong> {selectedOffice.name}
                    </p>
                    <p>
                      <strong>{tAdmin("offices.internationalName")}:</strong>{" "}
                      {selectedOffice.internationalName}
                    </p>
                    <p>
                      <strong>{tAdmin("offices.shortName")}:</strong>{" "}
                      {selectedOffice.shortName}
                    </p>
                    <p>
                      <strong>{tAdmin("offices.taxCode")}:</strong>{" "}
                      {selectedOffice.taxCode}
                    </p>
                    <p>
                      <strong>{tAdmin("offices.address")}:</strong>{" "}
                      {selectedOffice.address}
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
