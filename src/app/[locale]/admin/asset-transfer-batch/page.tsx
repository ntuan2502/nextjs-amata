import AssetTransferBatchAdminComponent from "@/components/admin/asset-transfer-batch";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AssetTransferBatchAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <AssetTransferBatchAdminComponent />;
}
