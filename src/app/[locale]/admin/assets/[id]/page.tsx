import EditAssetAdminComponent from "@/components/admin/assets/edit";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { ParamsWithId } from "@/types/data";
import { redirect } from "next/navigation";

export default async function EditAssetAdminPage({ params }: ParamsWithId) {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  const { id } = await params;

  return <EditAssetAdminComponent id={id} />;
}
