import DashboardAdminComponent from "@/components/admin/dashboard";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function DashboardAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <DashboardAdminComponent />;
}
