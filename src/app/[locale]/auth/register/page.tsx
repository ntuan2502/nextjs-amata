import RegisterComponent from "@/components/auth/Register";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const name = await getUserFromCookies();

  if (name) {
    return redirect("/");
  }

  return <RegisterComponent />;
}
