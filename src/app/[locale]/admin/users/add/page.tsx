import AddUserAdminComponent from "@/components/admin/users/add";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AddUserAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <AddUserAdminComponent />;
}
