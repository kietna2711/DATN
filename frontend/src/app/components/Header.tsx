"use client";

import React, { useState, useEffect, useRef } from "react";
import { Affix } from "antd";
import {
  HeartOutlined,
  ShoppingOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import styles from "../styles/header.module.css";
import { Category } from "../types/categoryD";

import { useRouter } from "next/navigation"; // nếu dùng App Router
import Link from "next/link";

type Props = {
  categories: Category[];
};

const Header: React.FC<Props> = ({ categories }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSearchAction = () => {
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setMobileMenuActive(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchAction();
  };

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

  const visibleCategories = categories.filter((c) => !c.hidden);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
    // Lắng nghe sự thay đổi localStorage từ các tab khác (nếu cần)
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("user"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setUsername(userObj.username || userObj.firstName || null);
      } catch {
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
    // Lắng nghe sự thay đổi user
    const handleStorage = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          setUsername(userObj.username || userObj.firstName || null);
        } catch {
          setUsername(null);
        }
      } else {
        setUsername(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("userChanged", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userChanged", handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowUserMenu(false);
    window.location.reload();
  };

  return (
    <>
      <header className={styles.header}>
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
              onClick={handleSearchAction}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#e87ebd",
                fontSize: "1.25rem",
                cursor: "pointer",
              }}
            />
          </form>
          <div className={styles["header-icons"]}>
           
            <HeartOutlined />
            <ShoppingOutlined />
             <div
              className={styles["user-menu-wrap"]}
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
              ref={userMenuRef}
              style={{ position: "relative", display: "inline-block", marginLeft: 8 }}
            >
              {isLoggedIn && username ? (
                <>
                  <span
                    style={{
                      fontWeight: 500,
                      color: "#b94490",
                      cursor: "pointer",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      background: "#fff",
                    }}
                  >
                    Xin chào, {username}
                  </span>
                  {showUserMenu && (
                    <div className={styles["user-menu-dropdown"]}>
                      <button
                        className={styles["user-menu-btn"]}
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <UserOutlined style={{ cursor: "pointer", fontSize: 22 }} />
                  {showUserMenu && (
                    <div className={styles["user-menu-dropdown"]}>
                      <Link href="/login" className={styles["user-menu-btn"]}>
                        Đăng nhập
                      </Link>
                      <Link href="/register" className={styles["user-menu-btn"]}>
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <button className={styles["menu-btn"]} onClick={openMobileMenu}>
            <MenuOutlined />
          </button>
        </div>
      </header>

      <Affix>
        <nav className={styles.menu}>
          <div className={styles["menu-row"]}>
            <ul>
              <li><div className={styles["menu-item"]}><a href="/">Trang chủ</a></div></li>
              <li><div className={styles["menu-item"]}><a href="/products">Sản phẩm</a></div></li>

              {visibleCategories.map((item) => {
                const visibleSub = item.subcategories?.filter((sub) => !sub.hidden) || [];
                const hasSub = visibleSub.length > 0;

                return (
                  <li key={item._id} className={hasSub ? styles["has-submenu"] : ""}>
                    <div className={styles["menu-item"]}>
                      <a href={`/products?category=${item._id}`}>{item.name}</a>
                      {hasSub && <span className={styles["icon-down"]}><DownOutlined /></span>}
                    </div>

                    {hasSub && (
                      <ul className={styles.submenu}>
                        {visibleSub.map((sub) => (
                          <li key={sub._id}>
                            <a href={`/products?subcategory=${sub._id}`}>{sub.name}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </Affix>

      <div className={`${styles.overlay}${mobileMenuActive ? " " + styles.active : ""}`} onClick={handleOverlayClick}></div>

      <div className={`${styles["mobile-menu"]}${mobileMenuActive ? " " + styles.active : ""}`}>
        <div className={styles["mobile-menu-header"]}>
          <span className={styles.title}>Danh mục</span>
          <button className={styles["mobile-close-btn"]} onClick={closeMobileMenu}>
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
              onClick={handleSearchAction}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#b94490",
                fontSize: "1.07rem",
                cursor: "pointer",
              }}
            />
          </form>
        </div>

        <div className={styles["mobile-menu-list"]}>
          <ul>
            {visibleCategories.map((item, idx) => {
              const visibleSub = item.subcategories?.filter((sub) => !sub.hidden) || [];
              const hasSub = visibleSub.length > 0;

              return (
                <li
                  key={item._id}
                  className={hasSub && mobileOpenIndex === idx ? styles.open : ""}
                >
                  {hasSub ? (
                    <>
                      <a
                        href={`/products?category=${item._id}`}
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
                        {visibleSub.map((sub) => (
                          <li key={sub._id}>
                            <a href={`/products?subcategory=${sub._id}`}>{sub.name}</a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <a href={`/products?category=${item._id}`}>{item.name}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
