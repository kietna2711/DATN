// app/layout.tsx (Server Component)
import "@/app/globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Category } from "./types/categoryD";

async function getCategories(): Promise<Category[]> {
  const res = await fetch("http://localhost:3000/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <html lang="vi">
      <body>
        {/* Mình không thể dùng usePathname() ở đây */}
        {/* Nếu bạn cần kiểm tra isAdmin dựa vào pathname, xử lý ở client component khác */}
        <Header categories={categories} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
