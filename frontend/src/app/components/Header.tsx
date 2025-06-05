"use client";

import React, { useState, useEffect, useRef } from "react";
import { Affix, Badge } from "antd";
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
import { getProducts } from "../services/productService";
import { useRouter } from "next/navigation";
import { Products } from "../types/productD";
import { useAppSelector } from "../store/store";

type Props = {
  categories: Category[];
};

const Header: React.FC<Props> = ({ categories }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Products[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

// Lấy số sản phẩm khác nhau trong giỏ hàng (không phải tổng quantity)
const cartCount = useAppSelector((state) => state.cart.items.length);
  // Debounce search input
  useEffect(() => {
    if (!searchValue.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const allProducts = await getProducts();
        const filtered = allProducts.filter(
          (product: Products) =>
            product.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [searchValue]);

  // Đóng suggestion khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  const handleSearchAction = () => {
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setMobileMenuActive(false);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchAction();
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/products/${id}`);
    setShowSuggestions(false);
    setSearchValue("");
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
              ref={inputRef}
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
            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestionBox} ref={suggestionBoxRef}>
                <ul className={styles.suggestionList}>
                  {suggestions.map((prod) => (
                    <li
                      key={prod._id}
                      className={styles.suggestionItem}
                      onClick={() => handleSuggestionClick(prod._id)}
                    >
                      <img
                        src={`http://localhost:3000/images/${prod.images[0]}`}
                        alt={prod.name}
                        className={styles.suggestionImg}
                      />
                      <span>{prod.name}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.suggestionFooter} onClick={handleSearchAction}>
                  <span>Xem thêm</span>
                </div>
              </div>
            )}
          </form>
          <div className={styles["header-icons"]}>
            <HeartOutlined />
            <a href="/cart">
              {cartCount > 0 ? (
                <Badge
                  count={cartCount}
                  color="#e87ebd"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#e87ebd",
                    boxShadow: "0 0 0 2px #fff",
                  }}
                >
                  <ShoppingOutlined
                    style={{
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: "#e87ebd",
                    }}
                  />
                </Badge>
              ) : (
                <ShoppingOutlined
                  style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#e87ebd",
                  }}
                />
              )}
            </a>
            <a href="/login">
              <UserOutlined style={{ cursor: "pointer" }} />
            </a>
          </div>
          <button className={styles["menu-btn"]} onClick={openMobileMenu}>
            <MenuOutlined />
          </button>
        </div>
      </header>

      <Affix style={{ zIndex: 100 }}>
        <nav className={styles.menu}>
          <div className={styles["menu-row"]}>
            <ul>
              <li>
                <div className={styles["menu-item"]}>
                  <a href="/">Trang chủ</a>
                </div>
              </li>
              <li>
                <div className={styles["menu-item"]}>
                  <a href="/products">Sản phẩm</a>
                </div>
              </li>
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
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestionBox} ref={suggestionBoxRef}>
              <ul className={styles.suggestionList}>
                {suggestions.map((prod) => (
                  <li
                    key={prod._id}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(prod._id)}
                  >
                    <img
                      src={`http://localhost:3000/images/${prod.images[0]}`}
                      alt={prod.name}
                      className={styles.suggestionImg}
                    />
                    <span>{prod.name}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.suggestionFooter} onClick={handleSearchAction}>
                <span>Xem thêm</span>
              </div>
            </div>
          )}
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