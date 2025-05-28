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
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Department } from "@/types/data";
import { rowsPerPage } from "@/constants/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import LoadingComponent from "@/components/ui/Loading";
import { ADMIN_ROUTES } from "@/constants/routes";
import Link from "next/link";
import Swal from "sweetalert2";
import { SearchForm } from "@/components/ui/Search";

export default function DepartmentsAdminComponent() {
  const { tAdmin, tCta, tSwal } = useAppTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDepartments();
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

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/departments`);
      setDepartments(res.data.data.departments);
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
    if (!searchQuery) return departments;
    const keyword = searchQuery.toLowerCase();
    return departments.filter((item) => {
      return item.name?.toLowerCase().includes(keyword);
    });
  }, [departments, searchQuery]);

  const pages = Math.max(Math.ceil(filteredData.length / rowsPerPage), 1);
  const filteredCount = useMemo(() => filteredData.length, [filteredData]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [page, filteredData]);

  const handleDelete = async (item: Department) => {
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
            `${ENV.API_URL}/departments/${item.id}`
          );
          handleAxiosSuccess(res);
          setDepartments((prev) => prev.filter((o) => o.id !== item.id));

          Swal.fire({
            title: tSwal("confirmed.title"),
            text: `${item.name} ${tSwal("confirmed.text")}`,
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
          <BreadcrumbItem href={ADMIN_ROUTES.DEPARTMENTS}>
            {tAdmin("departments.title")}
          </BreadcrumbItem>
        </Breadcrumbs>
        <Button
          color="primary"
          as={Link}
          href={`${ADMIN_ROUTES.DEPARTMENTS}/add`}
        >
          {tCta("add")}
        </Button>
      </div>

      <p className="mb-4">
        {filteredCount} {tAdmin("entriesFound")}
      </p>

      <Table
        aria-label={tAdmin("departments.title")}
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
          <TableColumn>{tAdmin("name")}</TableColumn>
          <TableColumn>{tAdmin("actions")}</TableColumn>
        </TableHeader>
        <TableBody items={items} emptyContent={tAdmin("noData")}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Tooltip content={tCta("view")}>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => {
                        setSelectedDepartment(item);
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
                {selectedDepartment ? (
                  <>
                    <p>
                      <strong>{tAdmin("name")}:</strong>{" "}
                      {selectedDepartment.name}
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
