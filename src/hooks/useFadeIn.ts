"use client";

import { useCallback, useRef } from "react";

/**
 * IntersectionObserver ベースのスクロール連動フェードイン。
 * 返された ref（callback ref）を対象要素に付与し、className に "fade-in-section" を追加して使う。
 * ビューポートに入ると "visible" クラスが付与される。
 */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (el: T | null) => {
      // cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("visible");
            observer.unobserve(el);
          }
        },
        { threshold },
      );

      observer.observe(el);
      observerRef.current = observer;
    },
    [threshold],
  );

  return ref;
}
