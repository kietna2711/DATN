'use client';
import { useState, useEffect } from 'react';
import Dashboard from '../admin/Dashboard/page';
import Profile from '../admin/profile/page';
import ProductList from '../admin/Products/page';
import UserManagement from '../admin/user/page';
import OrderManagement from '../admin/order/page';
import ReviewManagement from '../admin/Evaluate/page';
import CommentManagement from '../admin/comment/page';
import PostManagement from '../admin/article/page';
import DiscountManagement from '../admin/discount/page';
import CategoryManagement from '../admin/categories/page';
import ReportManagement from '../admin/report/page';
import Sidebar from '../admin/Sidebar/page';
import Navbar from '../admin/Navbar/page';
import PostCategoriesPage from '../admin/postscategories/page';

export default function AdminPage() {
  const [section, setSection] = useState('dashboard');

  useEffect(() => {
    const updateSectionFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      setSection(hash || 'dashboard');
    };

    updateSectionFromHash(); // khởi tạo khi load
    window.addEventListener('hashchange', updateSectionFromHash); // cập nhật khi hash thay đổi

    return () => window.removeEventListener('hashchange', updateSectionFromHash);
  }, []);

  return (
    <div className="app sidebar-mini rtl">
      <Sidebar currentSection={section} />
      <Navbar />
      <div className="app-content">
        {section === 'dashboard' && <Dashboard />}
        {section === 'profile' && <Profile />}
        {section === 'products' && <ProductList />}
        {section === 'users' && <UserManagement />}
        {section === 'orders' && <OrderManagement />}
        {section === 'reviews' && <ReviewManagement />}
        {section === 'comments' && <CommentManagement />}
        {section === 'posts' && <PostManagement />}
        {section === 'postscategories' && <PostCategoriesPage />}
        {section === 'discounts' && <DiscountManagement />}
        {section === 'categories' && <CategoryManagement />}
        {section === 'report' && <ReportManagement />}
      </div>
    </div>
  );
}
