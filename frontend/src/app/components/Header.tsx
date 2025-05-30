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
import { Category } from "../types/categoryD";
import { useRouter } from "next/navigation"; // nếu dùng App Router


const Header: React.FC = () => {
  const [headerShrink, setHeaderShrink] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      setMobileMenuActive(false); // Đóng menu nếu đang mở
    }
  };
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/categories");
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  };

  fetchCategories();
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
          <form onSubmit={handleSearch} className={styles["search-box"]}>
            <input
              type="search"
              placeholder="Nhập sản phẩm cần tìm ?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <SearchOutlined
              onClick={() => {
                if (searchValue.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
                  // setSearchValue("");
                  setMobileMenuActive(false);
                }
              }}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#e87ebd",
                fontSize: "1.25rem",
                cursor: "pointer" // để hiện dấu tay khi hover
              }}
            />
          </form>


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
              {categories.map((item) => (
                <li key={item._id}>
                  <a href={`/products/${item._id}`}>{item.name}</a>
                  {item.subcategories && item.subcategories.length > 0 && (
                    <ul className={styles.submenu}>
                      {item.subcategories.map((sub) => (
                        <li key={sub._id}>
                          <a href={`/products/${sub._id}`}>{sub.name}</a>
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
        <form onSubmit={handleSearch} style={{ position: "relative" }}>
          <input
            type="search"
            placeholder="Nhập sản phẩm cần tìm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <SearchOutlined
            onClick={() => {
              if (searchValue.trim()) {
                router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
                // Không reset searchValue để giữ nguyên chữ
                setMobileMenuActive(false);
              }
            }}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#b94490",
              fontSize: "1.07rem",
              cursor: "pointer"
            }}
          />
        </form>
      </div>
        <div className={styles["mobile-menu-list"]}>
          <ul>
            {categories.map((item, idx) => (
              <li
                key={item._id}
                className={item.subcategories && mobileOpenIndex === idx ? styles.open : ""}
              >
                {item.subcategories && item.subcategories.length > 0 ? (
                  <>
                    <a
                      href={`/products/${item._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleMobileSubmenuToggle(idx);
                      }}
                    >
                      {item.name}
                      <button
                        className={styles["submenu-toggle"]}
                        onClick={(e) => {
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
                      {item.subcategories.map((sub) => (
                        <li key={sub._id}>
                          <a href={`/products/${sub._id}`}>{sub.name}</a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a href={`/products/${item._id}`}>{item.name}</a>
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