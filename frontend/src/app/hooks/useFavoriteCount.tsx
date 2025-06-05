import { useState, useEffect } from "react";

export default function useFavoriteCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Hàm cập nhật count khi localStorage thay đổi
    const updateCount = () => {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      setCount(stored.length);
    };

    // Lần đầu load
    updateCount();

    // Lắng nghe sự kiện storage (khi tab khác thay đổi localStorage)
    window.addEventListener("storage", updateCount);

    // Lắng nghe custom event (do chính mình phát ra khi thêm/xóa favorites)
    window.addEventListener("favoriteChanged", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("favoriteChanged", updateCount);
    };
  }, []);

  return count;
}