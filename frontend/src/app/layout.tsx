'use client';

import "@/app/globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="vi">
      <body>
        {!isAdmin && <Header />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
