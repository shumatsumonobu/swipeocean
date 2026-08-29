"use client";

import { useEffect, useRef } from "react";
import allImages from "@/data/images.json";

// 2行ぶんのスワイプ画像（上段11枚 / 下段10枚）。tripleして継ぎ目なくループさせる
const ROW1 = allImages.slice(0, 11);
const ROW2 = allImages.slice(11, 21);

function Tile({ src }: { src: string }) {
  return (
    <img
      src={`/images/swipe/${src}`}
      alt=""
      loading="lazy"
      draggable={false}
      className="h-[130px] w-[130px] sm:h-[160px] sm:w-[160px] flex-shrink-0 rounded-2xl object-cover select-none"
    />
  );
}

/**
 * スクロール連動マーキー（2列・逆方向）。
 * ページのスクロール位置に応じて上段が右へ、下段が左へ流れる。
 * framer-motion 不使用。スクロール中は state を更新せず、ref で 2行の transform を直接書く
 * （63枚の img を毎フレーム再レンダーしないため、低スペック端末でもスムーズ）。
 */
export default function SwipeMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      // セクションがビューポートに入ってからの相対スクロール量
      const shift = (window.scrollY - sectionTop + window.innerHeight) * 0.3 - 200;
      // -33.333% で中央コピーを基準位置に（左右に1コピーずつ余白があるのでエッジ抜けしない）
      if (row1Ref.current) row1Ref.current.style.transform = `translateX(calc(-33.333% + ${shift}px))`;
      if (row2Ref.current) row2Ref.current.style.transform = `translateX(calc(-33.333% - ${shift}px))`;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const row1 = [...ROW1, ...ROW1, ...ROW1];
  const row2 = [...ROW2, ...ROW2, ...ROW2];

  return (
    <div
      ref={sectionRef}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-6"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        ref={row1Ref}
        className="flex gap-3 mb-3"
        style={{ transform: "translateX(-33.333%)", willChange: "transform" }}
      >
        {row1.map((img, i) => (
          <Tile key={`r1-${i}`} src={img.src} />
        ))}
      </div>
      <div
        ref={row2Ref}
        className="flex gap-3"
        style={{ transform: "translateX(-33.333%)", willChange: "transform" }}
      >
        {row2.map((img, i) => (
          <Tile key={`r2-${i}`} src={img.src} />
        ))}
      </div>
    </div>
  );
}
