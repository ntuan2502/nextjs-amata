import ChangePasswordComponent from "@/components/account/ChangePassword";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <ChangePasswordComponent />;
}
