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
import { User } from "@/types/data";
import { rowsPerPage } from "@/constants/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import LoadingComponent from "@/components/ui/Loading";
import { ADMIN_ROUTES } from "@/constants/routes";
import Link from "next/link";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react/dist/iconify.js";
import dayjs from "dayjs";

export default function UsersAdminComponent() {
  const { tAdmin, tCta, tSwal } = useAppTranslations();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(
        `${ENV.API_URL}/users?include=office, department`
      );
      setUsers(res.data.data.users);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const pages = Math.max(Math.ceil(users.length / rowsPerPage), 1);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, users]);

  const handleDelete = async (item: User) => {
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
            `${ENV.API_URL}/users/${item.id}`
          );
          handleAxiosSuccess(res);
          await fetchUser();
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

  if (users.length === 0) {
    return <LoadingComponent />;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem href={ADMIN_ROUTES.DASHBOARD}>
            {tAdmin("dashboard")}
          </BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_ROUTES.USERS}>
            {tAdmin("users.title")}
          </BreadcrumbItem>
        </Breadcrumbs>
        <Button color="primary" as={Link} href={`${ADMIN_ROUTES.USERS}/add`}>
          {tCta("add")}
        </Button>
      </div>

      <Table
        aria-label={tAdmin("users.title")}
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
          <TableColumn>{tAdmin("users.email")}</TableColumn>
          <TableColumn>{tAdmin("users.phone")}</TableColumn>
          <TableColumn>{tAdmin("users.office")}</TableColumn>
          <TableColumn>{tAdmin("users.department")}</TableColumn>
          <TableColumn>{tAdmin("actions")}</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name || "-"}</TableCell>
              <TableCell>{item.email || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {item.phone || "-"}
                  <Link href={`https://zalo.me/${item.phone}`} target="_blank">
                    <Icon
                      className="cursor-pointer text-2xl text-default-400 px-1 "
                      icon="simple-icons:zalo"
                    />
                  </Link>
                </div>
              </TableCell>
              <TableCell>{item.office?.name || "-"}</TableCell>
              <TableCell>{item.department?.name || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Tooltip content={tCta("view")}>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => {
                        setSelectedUser(item);
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
                {selectedUser ? (
                  <>
                    <p>
                      <strong>{tAdmin("name")}:</strong> {selectedUser.name}
                    </p>
                    <p>
                      <strong>{tAdmin("users.email")}:</strong>{" "}
                      {selectedUser.email}
                    </p>
                    <p>
                      <strong>{tAdmin("users.phone")}:</strong>{" "}
                      {selectedUser.phone}
                    </p>
                    <p>
                      <strong>{tAdmin("users.office")}:</strong>{" "}
                      {selectedUser.office?.name}
                    </p>
                    <p>
                      <strong>{tAdmin("users.department")}:</strong>{" "}
                      {selectedUser.department?.name}
                    </p>
                    <p>
                      <strong>{tAdmin("users.gender")}:</strong>{" "}
                      {selectedUser.gender}
                    </p>
                    <p>
                      <strong>{tAdmin("users.dob")}:</strong>{" "}
                      {dayjs(selectedUser.dob).format("YYYY-MM-DD")}
                    </p>
                    <p>
                      <strong>{tAdmin("users.address")}:</strong>{" "}
                      {selectedUser.address}
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
