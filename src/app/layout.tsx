import NavbarComponent from "@/components/navbar";
import "./globals.css";
import { Providers } from "./providers";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <body>
        <Providers>
          <ToastContainer />
          <NavbarComponent />
          {children}
        </Providers>
      </body>
    </html>
  );
}
