// app/providers.tsx
"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";

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

  return (
    <AuthProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
      </NextThemesProvider>
    </AuthProvider>
  );
}
