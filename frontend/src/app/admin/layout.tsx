"use client";
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar/page';
import Navbar from './Navbar/page';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app sidebar-mini rtl">
      <Sidebar currentSection={pathname} />
      <Navbar />
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}
