import AddAssetAdminComponent from "@/components/admin/assets/add";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AddAssetAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <AddAssetAdminComponent />;
}
