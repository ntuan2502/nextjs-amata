"use client";

import { useParams, usePathname } from "next/navigation";
import clsx from "clsx";
import { ReactNode } from "react";
import { Link } from "@heroui/react";
import { ACCOUNT_ROUTES } from "@/constants/routes/account";
import { useAppTranslations } from "@/hooks/useAppTranslations";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale } = useParams();
  const prefixedHref = (href: string) => `/${locale}${href}`;
  const { tAccount } = useAppTranslations();

  const sidebarItems = [
    { label: tAccount("profile.title"), href: ACCOUNT_ROUTES.PROFILE },
    { label: tAccount("sessions.title"), href: ACCOUNT_ROUTES.SESSIONS },
    {
      label: tAccount("changePassword.title"),
      href: ACCOUNT_ROUTES.CHANGE_PASSWORD,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden">
        <aside className="md:w-1/4 w-full border-b md:border-b-0 md:border-r">
          <ul className="flex md:flex-col flex-row overflow-x-auto text-sm font-medium">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "block p-4 transition whitespace-nowrap",
                    pathname === prefixedHref(item.href)
                      ? "text-red-600 font-semibold"
                      : ""
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
