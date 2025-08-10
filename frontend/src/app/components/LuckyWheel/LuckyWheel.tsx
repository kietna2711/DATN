"use client";
import React, { useRef, useState } from "react";
import "./LuckyWheel.css";

const prizes = [
  "Tặng 20 phút nội mạng",
  "Cộng 700MB DATA",
  "Giảm 30%",
  "Tặng 1$",
  "Lì xì 5k",
  "Thẻ cào",
  "Tặng lượt quay",
  "Miễn phí cước",

];

const LuckyWheel = () => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState("");

  const spinWheel = () => {
    if (isSpinning) return;

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const rotateDegree = 3600 + (360 / prizes.length) * prizeIndex;

    if (wheelRef.current) {
      setIsSpinning(true);
      wheelRef.current.style.transition = "transform 5s ease-out";
      wheelRef.current.style.transform = `rotate(-${rotateDegree}deg)`;

      setTimeout(() => {
        setIsSpinning(false);
        setResult(prizes[prizeIndex]);
      }, 5200);
    }
  };

  return (
    <div className="wheel-container">
      <div className="arrow" />
      <div className="wheel" ref={wheelRef}>
        {prizes.map((prize, index) => {
          const rotate = (360 / prizes.length) * index;
          return (
            <div
              key={index}
              className="segment"
              style={{
                transform: `rotate(${rotate}deg) skewY(-60deg)`,
              }}
            >
              <span
                style={{
                  transform: `skewY(60deg) rotate(${360 / prizes.length / 2}deg)`,
                }}
              >
                {prize}
              </span>
            </div>
          );
        })}
      </div>
      <button className="spin-btn" onClick={spinWheel}>
        QUAY NGAY
      </button>
      {result && <div className="result">🎉 {result} 🎉</div>}
    </div>
  );
};

export default LuckyWheel;
