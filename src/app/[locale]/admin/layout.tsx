"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { useAppTranslations } from "@/hooks/useAppTranslations";
import { ADMIN_ROUTES } from "@/constants/routes/admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale } = useParams();
  const prefixedHref = (href: string) => `/${locale}${href}`;
  const { tAdmin } = useAppTranslations();

  const sidebarItems = [
    { label: tAdmin("dashboard"), href: ADMIN_ROUTES.DASHBOARD },
    { label: tAdmin("offices.title"), href: ADMIN_ROUTES.OFFICES },
    {
      label: tAdmin("departments.title"),
      href: ADMIN_ROUTES.DEPARTMENTS,
    },
    {
      label: tAdmin("deviceTypes.title"),
      href: ADMIN_ROUTES.DEVICE_TYPES,
    },
    {
      label: tAdmin("deviceModels.title"),
      href: ADMIN_ROUTES.DEVICE_MODELS,
    },
    { label: tAdmin("users.title"), href: ADMIN_ROUTES.USERS },
    {
      label: tAdmin("assets.title"),
      href: ADMIN_ROUTES.ASSETS,
    },
    {
      label: tAdmin("assetTransactions.title"),
      href: ADMIN_ROUTES.ASSET_TRANSACTION,
    },
    {
      label: tAdmin("assetTransferBatch.title"),
      href: ADMIN_ROUTES.ASSET_TRANSFER_BATCH,
    },
  ];

  return (
    <div className="flex">
      <aside className="bg-card border-r inset-y-0 flex flex-col transition-all duration-300 left-0 w-64">
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item) => {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                    ${
                      pathname.includes(prefixedHref(item.href))
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-accent hover:text-foreground"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      {children}
    </div>
  );
}
