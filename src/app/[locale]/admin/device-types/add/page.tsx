import AddDeviceTypeAdminComponent from "@/components/admin/device-types/add";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AddDeviceTypeAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <AddDeviceTypeAdminComponent />;
}
