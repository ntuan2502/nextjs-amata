import AddDepartmentAdminComponent from "@/components/admin/departments/add";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AddDepartmentAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <AddDepartmentAdminComponent />;
}
