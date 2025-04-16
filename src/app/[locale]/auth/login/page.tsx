import { redirect } from "next/navigation";
import LoginComponent from "@/components/auth/Login";
import { cookies } from "next/headers";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("user");

  if (user?.name) {
    redirect("/");
  }

  return <LoginComponent />;
}
