import AssetTransactionsAdminComponent from "@/components/admin/asset-transactions";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function AssetTransactionsAdminPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <AssetTransactionsAdminComponent />;
}
