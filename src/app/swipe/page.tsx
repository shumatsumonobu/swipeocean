"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import imagesData from "@/data/images.json";
import type { ImageMeta, SwipeResult } from "@/types";
import { personalityTypes } from "@/data/personalityTypes";

// 翻訳データ
const translations = {
  ja: {
    title: "直感でいこ！",
    hintLeft: "今はちがう",
    hintRight: "今の私っぽい！",
    hint: "← → キーでもいける",
    loading: "ちょっとまって...",
    done: "おつかれ！",
  },
  en: {
    title: "Go with your gut!",
    hintLeft: "Not me",
    hintRight: "That's me!",
    hint: "← → keys work too!",
    loading: "Getting ready...",
    done: "Nice, done!",
  },
};

type Language = "ja" | "en";

// 各特性から均等に画像を選出する関数（high/lowバランスも考慮）
function selectBalancedImages(images: ImageMeta[], perTrait: number): ImageMeta[] {
  const traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
  const selected: ImageMeta[] = [];

  for (const trait of traits) {
    const highImages = images.filter(img => img.trait === trait && img.direction === "high");
    const lowImages = images.filter(img => img.trait === trait && img.direction === "low");

    // high/lowから半分ずつ（奇数の場合はランダムにどちらかを1枚多く）
    const highFirst = Math.random() < 0.5;
    const highCount = highFirst ? Math.ceil(perTrait / 2) : Math.floor(perTrait / 2);
    const lowCount = perTrait - highCount;

    const shuffledHigh = [...highImages].sort(() => Math.random() - 0.5);
    const shuffledLow = [...lowImages].sort(() => Math.random() - 0.5);

    selected.push(...shuffledHigh.slice(0, highCount));
    selected.push(...shuffledLow.slice(0, lowCount));
  }

  // 全体をシャッフルして返す
  return selected.sort(() => Math.random() - 0.5);
}

export default function SwipePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]"><div className="text-slate-400">Loading...</div></div>}>
      <SwipeContent />
    </Suspense>
  );
}

function SwipeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get("dev") === "1";
  const perTrait = 2; // 1特性あたり2枚 × 5特性 = 10枚
  const imageCount = perTrait * 5; // 10枚

  const [currentIndex, setCurrentIndex] = useState(imageCount - 1);
  const [selectedImages, setSelectedImages] = useState<ImageMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>("ja");
  const [showDone, setShowDone] = useState(false);
  const [doneChar, setDoneChar] = useState<string>("");

  // ヒントキャラリアクション用
  const [hintReaction, setHintReaction] = useState<"left" | "right" | null>(null);

  const t = translations[lang];

  // クライアント側でのみ画像を選出
  useEffect(() => {
    setSelectedImages(selectBalancedImages(imagesData as ImageMeta[], perTrait));
    setCurrentIndex(perTrait * 5 - 1);
    setIsLoading(false);
  }, [perTrait]);

  // 言語判定: ?l= param only, default en
  useEffect(() => {
    const paramLang = searchParams.get("l");
    setLang(paramLang === "ja" ? "ja" : "en");
  }, [searchParams]);

  // 結果をrefで管理（非同期問題を回避）
  const resultsRef = useRef<SwipeResult[]>([]);

  const canSwipe = currentIndex >= 0;

  // スワイプ完了時のハンドラ
  const handleSwipe = useCallback((direction: string, image: ImageMeta, index: number) => {
    // ヒントキャラリアクション
    setHintReaction(direction === "right" ? "right" : "left");
    setTimeout(() => setHintReaction(null), 400);

    const choice = direction === "right" ? "me" : "not_me";
    const newResult: SwipeResult = {
      imageId: image.id,
      choice: choice as "me" | "not_me",
    };
    resultsRef.current = [...resultsRef.current, newResult];
    setCurrentIndex(index - 1);

    // 最後のカードの場合
    if (index === 0) {
      localStorage.setItem("swipeResults", JSON.stringify(resultsRef.current));
      localStorage.setItem("selectedImages", JSON.stringify(selectedImages));

      // 完了演出
      const chars = Object.values(personalityTypes);
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      setDoneChar(randomChar.image);
      setShowDone(true);
      setTimeout(() => {
        router.push(`/result?l=${lang}${isDevMode ? "&dev=1" : ""}`);
      }, 1500);
    }
  }, [router, selectedImages, isDevMode, lang]);

  // ドラッグ状態
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyOut, setFlyOut] = useState<"left" | "right" | null>(null);
  const dragStartX = useRef(0);

  const SWIPE_THRESHOLD = 50; // px

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (flyOut) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartX.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
  }, [flyOut]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX.current);
  }, [isDragging]);

  // スワイプ確定処理（タッチ・キーボード共通）
  const commitSwipe = useCallback((direction: "left" | "right") => {
    if (!canSwipe || flyOut) return;
    setFlyOut(direction);
    const idx = currentIndex;
    setTimeout(() => {
      handleSwipe(direction, selectedImages[idx], idx);
      setFlyOut(null);
      setDragOffset(0);
    }, 300);
  }, [canSwipe, currentIndex, flyOut, handleSwipe, selectedImages]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      const direction = dragOffset > 0 ? "right" : "left";
      commitSwipe(direction);
    } else {
      setDragOffset(0);
    }
  }, [isDragging, dragOffset, commitSwipe]);

  // キーボード操作対応（PCユーザー向け）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        commitSwipe("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        commitSwipe("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commitSwipe]);

  // ページのスクロールを防止
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
        <div className="text-slate-400">{t.loading}</div>
      </div>
    );
  }

  // プログレス計算
  const totalImages = selectedImages.length;
  const remaining = currentIndex + 1;
  const progressPercent = totalImages > 0 ? ((totalImages - remaining) / totalImages) * 100 : 0;

  // ドラッグ中の色フィードバック
  const dragGlow = isDragging && Math.abs(dragOffset) > 20
    ? dragOffset > 0
      ? "0 0 20px rgba(139,92,246,0.4)"
      : "0 0 20px rgba(100,116,139,0.3)"
    : undefined;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650] p-4">
      {/* スワイプ背景イラスト */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/images/bg/hero-top.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.10 }}
        />
      </div>
      {/* 完了演出 */}
      {showDone && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a1f]/90 backdrop-blur-sm">
          <style jsx>{`
            @keyframes pop-in {
              0% { transform: scale(0) rotate(-10deg); opacity: 0; }
              60% { transform: scale(1.2) rotate(5deg); opacity: 1; }
              100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
          `}</style>
          <img
            src={doneChar}
            alt=""
            className="w-24 h-24 mb-4"
            style={{ animation: "pop-in 0.5s ease-out" }}
          />
          <p className="text-2xl font-bold text-indigo-200">{t.done}</p>
        </div>
      )}

      {/* 戻るリンク */}
      <Link
        href={`/?l=${lang}${isDevMode ? "&dev=1" : ""}`}
        className="absolute top-4 left-4 z-50 px-3 py-1 text-sm text-indigo-200 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
      >
        ← {lang === "ja" ? "戻る" : "Back"}
      </Link>

      {/* 言語切替 */}
      <button
        onClick={() => {
          const newLang = lang === "ja" ? "en" : "ja";
          setLang(newLang);
          const url = new URL(window.location.href);
          url.searchParams.set("l", newLang);
          window.history.replaceState({}, "", url.toString());
        }}
        className="absolute top-4 right-4 z-50 px-3 py-1 text-sm text-indigo-200 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
      >
        {lang === "ja" ? "English" : "日本語"}
      </button>

      {/* タイトル */}
      <h1 className="text-2xl font-bold text-indigo-200 mb-1 relative z-10">
        {t.title}
      </h1>

      {/* スワイプの意味ヒント */}
      <div className="flex items-center justify-center gap-8 mb-3 relative z-10">
        <div className="flex items-center gap-1">
          {/* 左矢印（モーションライン付き） */}
          <svg width="28" height="14" viewBox="0 0 28 14" fill="none" className="text-slate-400">
            <path d="M7 2L2 7L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="4" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            <line x1="23" y1="7" x2="26" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
          </svg>
          <span className="text-base text-slate-400 font-medium">{t.hintLeft}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base text-indigo-300 font-medium">{t.hintRight}</span>
          {/* 右矢印（モーションライン付き） */}
          <svg width="28" height="14" viewBox="0 0 28 14" fill="none" className="text-violet-400">
            <line x1="2" y1="7" x2="5" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
            <line x1="7" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            <line x1="14" y1="7" x2="24" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M21 2L26 7L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* 進捗表示（のこり枚数 + プログレスバー） */}
      {selectedImages.length > 0 && (
        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-violet-400">
              {remaining}
            </span>
            <span className="text-lg text-slate-400">/ {totalImages}</span>
          </div>
          {/* プログレスバー */}
          <div className="w-40 h-1.5 bg-indigo-400/10 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
              style={{
                width: `${progressPercent}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* カードエリア */}
      <div className="relative mb-8 w-full" style={{ maxWidth: '400px', height: '384px' }}>
        {/* 左側ヒント（Not Me） */}
        <div
          className="absolute z-20 pointer-events-none transition-transform duration-300"
          style={{
            top: '50%',
            left: 4,
            transform: `translate(-25%, -50%) ${hintReaction === "left" ? "translateY(-15px) scale(1.2)" : isDragging && dragOffset < -20 ? "scale(1.05)" : ""}`,
            width: 96,
            height: 96,
          }}
        >
          <img
            src="/images/swipe-hints/swipe-left.png"
            alt=""
            className="w-full h-full object-contain select-none"
            tabIndex={-1}
            draggable={false}
          />
        </div>

        {/* 右側ヒント（Me） */}
        <div
          className="absolute z-20 pointer-events-none transition-transform duration-300"
          style={{
            top: '50%',
            right: 4,
            transform: `translate(25%, -50%) ${hintReaction === "right" ? "translateY(-15px) scale(1.2)" : isDragging && dragOffset > 20 ? "scale(1.05)" : ""}`,
            width: 96,
            height: 96,
          }}
        >
          <img
            src="/images/swipe-hints/swipe-right.png"
            alt=""
            className="w-full h-full object-contain select-none"
            tabIndex={-1}
            draggable={false}
          />
        </div>

        {/* カード（中央に配置） */}
        <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', width: 'min(320px, calc(100vw - 48px))', height: '384px' }}>
          {selectedImages.map((image, index) => {
            if (index > currentIndex) return null; // スワイプ済み
            const isTop = index === currentIndex;

            let tx = 0, rot = 0, opacity = 1;
            if (isTop && flyOut) {
              tx = flyOut === "left" ? -1500 : 1500;
              rot = flyOut === "left" ? -30 : 30;
              opacity = 0;
            } else if (isTop && isDragging) {
              tx = dragOffset;
              rot = dragOffset * 0.1;
            }

            return (
              <div
                key={image.id}
                className="absolute w-full h-full select-none"
                style={{
                  zIndex: index,
                  transform: isTop ? `translateX(${tx}px) rotate(${rot}deg)` : undefined,
                  opacity: isTop ? opacity : 1,
                  transition: (isTop && !isDragging) ? "transform 0.3s ease-out, opacity 0.3s ease-out" : undefined,
                  touchAction: "none",
                }}
                {...(isTop ? {
                  onPointerDown: handlePointerDown,
                  onPointerMove: handlePointerMove,
                  onPointerUp: handlePointerUp,
                } : {})}
              >
                <div
                  className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                  style={{ boxShadow: isTop && dragGlow ? dragGlow : undefined }}
                >
                  <img
                    src={`/images/swipe/${image.src}`}
                    alt="Personality test image"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* キーボード操作ヒント */}
      <div className="text-xs text-slate-400 relative z-10">
        {t.hint}
      </div>

      {/* フッター */}
      <footer className="absolute bottom-4 text-xs text-slate-500 text-center">
        <a
          href="https://x.com/shumatsumonobu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-300 transition-colors"
        >
          @shumatsumonobu
        </a>
      </footer>
    </div>
  );
}
