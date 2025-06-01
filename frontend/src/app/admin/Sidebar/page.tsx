'use client';
import React from "react";

export default function Sidebar({ currentSection }: { currentSection: string }) {
  const menu = [
    { key: "profile", label: "Hồ sơ", icon: "bx bx-user-circle" },
    { key: "dashboard", label: "Bảng điều khiển", icon: "bx bx-home-circle" },
    { key: "products", label: "Quản lý sản phẩm", icon: "bx bx-cube" },
    { key: "users", label: "Quản lý khách hàng", icon: "bx bx-user" },
    { key: "categories", label: "Quản lý danh mục", icon: "bx bx-category" },
    { key: "orders", label: "Quản lý đơn hàng", icon: "bx bx-receipt" },
    { key: "posts", label: "Quản lý bài viết", icon: "bx bx-news" },
    { key: "comments", label: "Quản lý bình luận", icon: "bx bx-comment-detail" },
    { key: "reviews", label: "Quản lý đánh giá", icon: "bx bx-star" },
    { key: "discounts", label: "Quản lý mã giảm giá", icon: "bx bx-gift" },
    { key: "report", label: "Báo cáo doanh thu", icon: "bx bx-bar-chart-alt-2" },
    { key: "settings", label: "Cài đặt hệ thống", icon: "bx bx-cog" }
  ];

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__user">
        <img className="app-sidebar__user-avatar" src="/images/hay.jpg" width={50} alt="User" />
        <div>
          <p className="app-sidebar__user-name"><b>Võ Trường</b></p>
          <p className="app-sidebar__user-designation">Chào mừng bạn trở lại</p>
        </div>
      </div>
      <hr />
      <ul className="app-menu">
        {menu.map(item => (
          <li key={item.key}>
            <a
              className={`app-menu__item ${currentSection === item.key ? 'active' : ''}`}
              href={`#${item.key}`}
            >
              <i className={`app-menu__icon ${item.icon}`}></i>
              <span className="app-menu__label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
