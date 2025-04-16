import ResetPasswordComponent from "@/components/auth/ResetPassword";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  const name = await getUserFromCookies();

  if (name) {
    return redirect("/");
  }

  return <ResetPasswordComponent />;
}
