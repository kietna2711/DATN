import "@/app/globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Header/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
