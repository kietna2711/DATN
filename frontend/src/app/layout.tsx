'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Category } from "./types/categoryD";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:3000/categories");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <html lang="vi">
      <body>
        {!isAdmin && <Header categories={categories} />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}