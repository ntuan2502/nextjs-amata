// app/providers.tsx
"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import { ReactNode } from "react";

// Only if using TypeScript
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>;
}
