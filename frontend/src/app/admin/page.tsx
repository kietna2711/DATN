"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Sidebar from '../admin/Sidebar/page';
import Navbar from '../admin/Navbar/page';
import Dashboard from './profile/page';
import PostCategoriesPage from '../admin/postscategories/page';


export default function AdminPage() {
  const router = useRouter();
  const [section, setSection] = useState('dashboard');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.role !== "admin") {
      router.replace("/");
    } else {
      setChecking(false); // Đã xác thực là admin, cho phép render
    }
  }, []);

  useEffect(() => {
    const updateSectionFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      setSection(hash || 'dashboard');
    };

    updateSectionFromHash(); // khởi tạo khi load
    window.addEventListener('hashchange', updateSectionFromHash); // cập nhật khi hash thay đổi

    return () => window.removeEventListener('hashchange', updateSectionFromHash);
  }, []);

  if (checking) return null; 

  return (
    <Dashboard />
  );
}
