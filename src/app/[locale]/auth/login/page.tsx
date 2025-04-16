import LoginComponent from "@/components/auth/Login";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const name = await getUserFromCookies();

  if (name) {
    return redirect("/");
  }

  return <LoginComponent />;
}
