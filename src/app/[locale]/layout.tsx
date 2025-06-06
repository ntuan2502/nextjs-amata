import NavbarComponent from "@/components/navigation/Navbar";
import "../globals.css";
import { Providers } from "./providers";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
// import FooterComponent from "@/components/footer";

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <Providers>
            <ToastContainer />
            <NavbarComponent />
            {children}
            {/* <FooterComponent /> */}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
