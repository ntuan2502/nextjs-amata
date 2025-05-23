import AddDeviceModelAdminComponent from "@/components/admin/device-models/add";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AddDeviceModelAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <AddDeviceModelAdminComponent />;
}
