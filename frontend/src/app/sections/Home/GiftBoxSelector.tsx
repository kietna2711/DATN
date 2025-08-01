"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/styles/Gifbox.module.css";

interface GiftOption {
  _id: string;
  id: string;
  title: string;
  description: string;
  color: string;
  occasion?: string; // dịp tặng quà
}

const occasions = [
  { id: "birthday", label: "🎂 Sinh nhật" },
  { id: "valentine", label: "💖 Valentine" },
  { id: "christmas", label: "🎄 Giáng sinh" },
  { id: "anniversary", label: "💍 Kỷ niệm" },
  { id: "graduation", label: "🎓 Tốt nghiệp" },
];

const GiftBoxSelector: React.FC = () => {
  const [giftOptions, setGiftOptions] = useState<GiftOption[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);

 useEffect(() => {
  fetch("http://localhost:3000/gift-options")
    .then((res) => res.json())
    .then((data) => {
      console.log("Gift options data:", data); // kiểm tra dữ liệu
      setGiftOptions(Array.isArray(data) ? data : []);
    })
    .catch((err) => console.error("Lỗi lấy dữ liệu:", err));
}, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>🎁 Bọc Hộp Quà Xinh</h2>

      <div className={styles.occasions}>
        <span className={styles.occasionsLabel}>Chọn dịp tặng quà:</span>
        {occasions.map((o) => (
          <button
            key={o.id}
            className={`${styles.occasionBtn} ${occasion === o.id ? styles.occasionSelected : ""}`}
            onClick={() => setOccasion(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {giftOptions
          .filter((gift) => !occasion || gift.occasion === occasion)
          .map((gift) => (
            <div
              key={gift._id}
              className={`${styles.giftCard} ${styles[gift.color]} ${
                selected === gift.id ? styles.selected : ""
              }`}
              onClick={() => setSelected(gift.id)}
            >
              <h3 className={styles.title}>{gift.title}</h3>
              <p className={styles.description}>{gift.description}</p>
              <div className={styles.occasionTag}>
                {occasions.find((o) => o.id === gift.occasion)?.label}
              </div>
            </div>
          ))}
      </div>

      {selected && (
        <div className={styles.result}>
          <p>
            🎉 Bạn đã chọn:{" "}
            <span className={styles.selectedText}>
              {giftOptions.find((g) => g.id === selected)?.title}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default GiftBoxSelector;