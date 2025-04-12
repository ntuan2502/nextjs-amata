import NavbarComponent from "@/components/navbar";
import "./globals.css";
import { Providers } from "./providers";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body>
        <Providers>
          <NavbarComponent />
          {children}
        </Providers>
      </body>
    </html>
  );
}
