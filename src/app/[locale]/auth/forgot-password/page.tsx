import ForgotPasswordComponent from "@/components/auth/ForgotPassword";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const name = await getUserFromCookies();

  if (name) {
    return redirect("/");
  }

  return <ForgotPasswordComponent />;
}
