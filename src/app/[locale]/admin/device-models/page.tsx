import DeviceModelAdminComponent from "@/components/admin/device-models";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function DeviceModelAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <DeviceModelAdminComponent />;
}
