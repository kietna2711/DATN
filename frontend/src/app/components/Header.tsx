"use client"

import React, { useEffect, useState } from "react";
import { Dropdown,Affix } from "antd";
import {
  HeartOutlined,
  ShoppingOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import styles from "../styles/header.module.css"

const menuItems = [
  { label: "BLINDBOX", href: "#" },
  {
    label: "GẤU TEDDY",
    submenu: [
      { label: "Gấu Teddy Classic", href: "#" },
      { label: "Gấu Teddy Đặc biệt", href: "#" },
    ],
  },
  {
    label: "BỘ SƯU TẬP",
    submenu: [
      { label: "BST Valentine", href: "#" },
      { label: "BST Noel", href: "#" },
    ],
  },
  {
    label: "GẤU HOẠT HÌNH",
    submenu: [
      { label: "Gấu Brown", href: "#" },
      { label: "Gấu Trắng", href: "#" },
    ],
  },
  { label: "THÚ BÔNG", href: "#" },
  { label: "PHỤ KIỆN", href: "#" },
//   {
//     label: "HOA GẤU BÔNG",
//     submenu: [
//       { label: "Hoa Gấu Mini", href: "#" },
//       { label: "Hoa Gấu Đặc biệt", href: "#" },
//     ],
//   },
//   { label: "GÓC CỦA GẤU", href: "#" },
//   { label: "DỊCH VỤ", href: "#" },
//   { label: "TẤT CẢ SP", href: "#" },
];


const Header: React.FC = () => {
  const [headerShrink, setHeaderShrink] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setHeaderShrink(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuActive ? "hidden" : "";
  }, [mobileMenuActive]);

  const openMobileMenu = () => setMobileMenuActive(true);
  const closeMobileMenu = () => {
    setMobileMenuActive(false);
    setMobileOpenIndex(null);
  };
  const handleOverlayClick = () => closeMobileMenu();
  const handleMobileSubmenuToggle = (idx: number) => {
    setMobileOpenIndex(mobileOpenIndex === idx ? null : idx);
  };

  return (
    <>
      <header className={`${styles.header}${headerShrink ? " " + styles.shrink : ""}`} id="header">
        <div className={styles["header-row"]}>
          <div className={styles["logo-wrap"]}>
            <a href="/">
                        <img src="http://localhost:3000/images/logoXP.png" alt="Mimi Bear Logo" />
            </a>
            <div className={styles.slogan}>“Hug MimiBear-Unbox Love”</div>
          </div>
          <div className={styles["search-box"]}>
            <input type="search" placeholder="Nhập sản phẩm cần tìm ?" />
            <SearchOutlined style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#e87ebd",
              fontSize: "1.25rem",
              pointerEvents: "none"
            }} />
          </div>
          <div className={styles["header-icons"]}>
            <HeartOutlined />
            <ShoppingOutlined />
            <UserOutlined />
          </div>
          <button className={styles["menu-btn"]} id="menuBtn" onClick={openMobileMenu}>
            <MenuOutlined />
          </button>
        </div>
      </header>
      <Affix>
        <nav className={styles.menu}>
          <div className={styles["menu-row"]}>
            <ul>
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href || "#"}>{item.label}</a>
                  {item.submenu && (
                    <ul className={styles.submenu}>
                      {item.submenu.map((sub) => (
                        <li key={sub.label}>
                          <a href={sub.href}>{sub.label}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </Affix>

      <div
        className={`${styles.overlay}${mobileMenuActive ? " " + styles.active : ""}`}
        id="overlay"
        onClick={handleOverlayClick}
      ></div>
      <div className={`${styles["mobile-menu"]}${mobileMenuActive ? " " + styles.active : ""}`} id="mobileMenu">
        <div className={styles["mobile-menu-header"]}>
          <span className={styles.title}>Danh mục</span>
          <button className={styles["mobile-close-btn"]} id="closeMobileMenu" onClick={closeMobileMenu}>
            <CloseOutlined />
          </button>
        </div>
        <div className={styles["mobile-account"]}>
          <UserOutlined /> Tài khoản
        </div>
        <div className={styles["mobile-search-box"]}>
          <input type="search" placeholder="Nhập sản phẩm cần tìm..." />
          <SearchOutlined style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#b94490",
            fontSize: "1.07rem"
          }} />
        </div>
        <div className={styles["mobile-menu-list"]}>
          <ul>
            {menuItems.map((item, idx) => (
              <li
                key={item.label}
                className={item.submenu && mobileOpenIndex === idx ? styles.open : ""}
              >
                {item.submenu ? (
                  <>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        handleMobileSubmenuToggle(idx);
                      }}
                    >
                      {item.label}
                      <button
                        className={styles["submenu-toggle"]}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMobileSubmenuToggle(idx);
                        }}
                        aria-label="Mở submenu"
                        tabIndex={-1}
                        type="button"
                      >
                        <DownOutlined />
                      </button>
                    </a>
                    <ul className={styles.submenu}>
                      {item.submenu.map(sub => (
                        <li key={sub.label}>
                          <a href={sub.href}>{sub.label}</a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a href={item.href}>{item.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;