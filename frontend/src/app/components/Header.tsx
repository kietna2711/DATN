"use client";

import React, { useState, useEffect } from "react";
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

type Props = {
  categories: Category[];
};

const Header: React.FC<Props> = ({ categories }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);

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
      <header className={`${styles.header}`} id="header">
        <div className={styles["header-row"]}>
          <div className={styles["logo-wrap"]}>
            <a href="/">
              <img src="http://localhost:3000/images/logoXP.png" alt="Mimi Bear Logo" />
            </a>
            <div className={styles.slogan}>“Hug MimiBear-Unbox Love”</div>
          </div>
          <div className={styles["search-box"]}>
            <input type="search" placeholder="Nhập sản phẩm cần tìm ?" />
            <SearchOutlined
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#e87ebd",
                fontSize: "1.25rem",
                pointerEvents: "none",
              }}
            />
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
              {/* Mục Trang chủ */}
              <li>
                <div className={styles["menu-item"]}>
                  <a href="/">Trang chủ</a>
                </div>
              </li>

              {/* Mục Trang sản phẩm */}
              <li>
                <div className={styles["menu-item"]}>
                  <a href="/products">Trang sản phẩm</a>
                </div>
              </li>

              {/* Các mục danh mục từ API */}
              {categories.map((item) => {
                const categoryId = item._id;
                const hasSub = item.subcategories && item.subcategories.length > 0;

                return (
                  <li key={categoryId} className={hasSub ? styles["has-submenu"] : ""}>
                    <div className={styles["menu-item"]}>
                      <a href={`/products?category=${categoryId}`}>{item.name}</a>
                      {hasSub && (
                        <span className={styles["icon-down"]}>
                          <DownOutlined />
                        </span>
                      )}
                    </div>

                    {hasSub && (
                      <ul className={styles.submenu}>
                        {Array.isArray(item.subcategories) &&
                          item.subcategories.map((sub) => {
                            const subCategoryId = sub._id;
                            return (
                              <li key={subCategoryId}>
                                <a href={`/products?subcategory=${subCategoryId}`}>{sub.name}</a>
                              </li>
                            );
                          })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </Affix>

      {/* Menu dọc cho responsive */}
      <div
        className={`${styles.overlay}${mobileMenuActive ? " " + styles.active : ""}`}
        id="overlay"
        onClick={handleOverlayClick}
      ></div>
      <div
        className={`${styles["mobile-menu"]}${mobileMenuActive ? " " + styles.active : ""}`}
        id="mobileMenu"
      >
        <div className={styles["mobile-menu-header"]}>
          <span className={styles.title}>Danh mục</span>
          <button
            className={styles["mobile-close-btn"]}
            id="closeMobileMenu"
            onClick={closeMobileMenu}
          >
            <CloseOutlined />
          </button>
        </div>
        <div className={styles["mobile-account"]}>
          <UserOutlined /> Tài khoản
        </div>
        <div className={styles["mobile-search-box"]}>
          <input type="search" placeholder="Nhập sản phẩm cần tìm..." />
          <SearchOutlined
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#b94490",
              fontSize: "1.07rem",
            }}
          />
        </div>
        <div className={styles["mobile-menu-list"]}>
          <ul>
            {categories.map((item, idx) => {
              const categoryId = item._id;
              return (
                <li
                  key={categoryId}
                  className={item.subcategories && mobileOpenIndex === idx ? styles.open : ""}
                >
                  {item.subcategories && item.subcategories.length > 0 ? (
                    <>
                      <a
                        href={`/products?category=${categoryId}`}
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
                        {item.subcategories.map((sub) => {
                          const subCategoryId = sub._id;
                          return (
                            <li key={subCategoryId}>
                              <a href={`/products?subcategory=${subCategoryId}`}>{sub.name}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <a href={`/products?category=${categoryId}`}>{item.name}</a>
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
