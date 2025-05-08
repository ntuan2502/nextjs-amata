import DeviceTypeAdminComponent from "@/components/admin/device-types";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function DeviceTypeAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <DeviceTypeAdminComponent />;
}
