"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

/**
 * 文字ごとスクロールリビール。スクロール進捗に応じて1文字ずつ opacity 0.2 → 1 で点灯する。
 * 感情の核になるコピーを「読ませる」演出に。framer-motion 不使用（scroll listener のみ）。
 */
export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const chars = [...text];

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 要素の上端が画面の80%地点に来たら開始、20%地点を通過で完了
      const start = vh * 0.8;
      const end = vh * 0.2;
      const p = (start - rect.top) / (start - end + rect.height);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <p ref={ref} className={className}>
      {chars.map((ch, i) => {
        const opacity = Math.max(0.2, Math.min(1, progress * chars.length - i));
        return (
          <span key={i} style={{ opacity, transition: "opacity 0.15s linear" }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </p>
  );
}
