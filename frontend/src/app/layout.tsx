import "@/app/globals.css";
import Footer from "./components/Footer";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
