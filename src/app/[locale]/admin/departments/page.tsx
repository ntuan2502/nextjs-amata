import DepartmentsAdminComponent from "@/components/admin/departments";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function DepartmentsAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <DepartmentsAdminComponent />;
}
