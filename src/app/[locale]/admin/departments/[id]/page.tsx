import EditDepartmentAdminComponent from "@/components/admin/departments/edit";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { ParamsWithId } from "@/types/data";
import { redirect } from "next/navigation";

export default async function EditDepartmentAdminPage({
  params,
}: ParamsWithId) {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  const { id } = await params;

  return <EditDepartmentAdminComponent id={id} />;
}
