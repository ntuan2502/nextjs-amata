import EditDeviceModelAdminComponent from "@/components/admin/device-models/edit";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { ParamsWithId } from "@/types/data";
import { redirect } from "next/navigation";

export default async function EditDeviceModelAdminPage({
  params,
}: ParamsWithId) {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  const { id } = await params;

  return <EditDeviceModelAdminComponent id={id} />;
}
