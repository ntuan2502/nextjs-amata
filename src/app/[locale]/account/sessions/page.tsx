import SessionsComponent from "@/components/account/Sessions";
import { getUserFromCookies } from "@/libs/auth/getUserFromCookies";
import { redirect } from "next/navigation";

export default async function SessionPage () {
  const name = await getUserFromCookies();

  if (!name) {
    return redirect("/auth/login");
  }

  return <SessionsComponent />;
}
