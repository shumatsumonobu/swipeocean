"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { personalityTypes } from "@/data/personalityTypes";
import { traitInfo, traitKeys } from "@/data/traitInfo";
import { typeAnimationName, characterAnimations } from "@/data/characterAnimations";
import { useFadeIn } from "@/hooks/useFadeIn";
import allImages from "@/data/images.json";
import type { CheckScores } from "@/types";
import SwipeOceanLogo from "@/components/SwipeOceanLogo";
import SwipeMarquee from "@/components/SwipeMarquee";
import AnimatedText from "@/components/AnimatedText";

// ─── Types ───────────────────────────────────────────────
type Language = "ja" | "en";

// ─── OCEAN letter colors ─────────────────────────────────
const oceanLetters = [
  { letter: "O", color: "#a855f7" },
  { letter: "C", color: "#22c55e" },
  { letter: "E", color: "#f97316" },
  { letter: "A", color: "#ec4899" },
  { letter: "N", color: "#3b82f6" },
];

// ─── Types list ──────────────────────────────────────────
const typeIds = Object.keys(personalityTypes) as (keyof typeof personalityTypes)[];
const types = Object.values(personalityTypes);

// ─── Translations ────────────────────────────────────────
const translations = {
  ja: {
    // Hero
    heroTitle: "今日のキミ、どんな色？",
    heroSub1: "画像をスワイプするだけ。たった10枚でOK",
    heroSub2: "今の自分がわかるパーソナリティチェック",
    heroSub3: "どんな結果でもいい。気分が変われば、色も変わる",
    heroCta1: "やってみる！",
    heroCta1Sub: "10枚・サクッと",
    // Section 2
    howTitle: "あそびかた",
    howStep1Title: "スワイプするだけ",
    howStep1Desc: "画像を見て、直感で右か左にスワイプ。考えなくてOK！",
    howStep2Title: "パターンを読みとる",
    howStep2Desc: "キミのスワイプパターンから、5つの特性がわかる",
    howStep3Title: "今日のキミのタイプ！",
    howStep3Desc: "8つのタイプから、今のキミにピッタリなやつを出す！",
    howMidCta: "もう始める？",
    // Section 3
    typesTitle: "8つのタイプ、ぜんぶいい",
    typesSub: "今日はどれだろう？ 気分しだいで変わる",
    // Section 4
    oceanTitle: "Big Five（OCEAN）ってなに？",
    oceanIntro: "心理学でいちばん使われてるパーソナリティモデル。5つの特性のバランスで、今のキミの「色」がわかる",
    oceanKey: "スコアに「いい」「悪い」はない。全部キミの個性！",
    mbtiCopy: "MBTIは知ってる？OCEANは、もっとサイエンスなやつ。しかも結果は今の気分しだい。今のキミが出る！",
    // Section 5
    scoreTitle: "ロジック全公開！スコアのしくみ",
    scoreIntro: "ブラックボックスなし。キミのスコアがどう決まるか、ぜんぶ見せる！",
    score5aTitle: "スワイプでスコアが動く",
    score5aNote: "直感で「今の私っぽい！」をえらぶほど、スコアに大きく反映される！",
    // Section 6
    philoTitle: "キミはひとつじゃない",
    philoSub: "気分が変われば、タイプも変わる。それでいい",
    // Section 7
    ctaTitle: "さあ、キミの色を見つけよう！",
    ctaSub: "10枚スワイプで、今日の色がわかる",
    ctaCta1: "やってみる！",
    ctaCta1Sub: "10枚・サクッと",
  },
  en: {
    heroTitle: "Hey, what color are you today?",
    heroSub1: "Just swipe images. 10 cards, that's it.",
    heroSub2: "A personality check that shows today's you.",
    heroSub3: "Whatever you get, it's all good. Your mood shifts, your color shifts.",
    heroCta1: "Try it!",
    heroCta1Sub: "10 cards · quick",
    howTitle: "How It Works",
    howStep1Title: "Just Swipe",
    howStep1Desc: "See an image — swipe right or left by instinct. No thinking needed!",
    howStep2Title: "Your Vibe, Decoded",
    howStep2Desc: "Your swipe patterns reveal 5 personality traits.",
    howStep3Title: "Today's You!",
    howStep3Desc: "We'll match you with the type that's totally you today!",
    howMidCta: "Ready to start?",
    typesTitle: "8 Types — All Good",
    typesSub: "Which one are you today? It shifts with your mood.",
    oceanTitle: "What's Big Five (OCEAN)?",
    oceanIntro: "The most trusted personality model in psychology. Your balance across 5 traits reveals your current color.",
    oceanKey: "No score is good or bad — they're all part of what makes you, you!",
    mbtiCopy: "Know MBTI? OCEAN is the science-backed version. And it reads your mood right now — this is you today.",
    scoreTitle: "Full Transparency: How Scoring Works",
    scoreIntro: "No black boxes. Here's exactly how your score is calculated!",
    score5aTitle: "How Swipes Change Your Score",
    score5aNote: "The more you go with your gut on 'That's me!', the bigger the impact on your score!",
    philoTitle: "You're Not Just One Thing",
    philoSub: "Your mood changes, your type changes. And that's okay.",
    ctaTitle: "Ready to find your color?",
    ctaSub: "10 swipes to find today's color",
    ctaCta1: "Try it!",
    ctaCta1Sub: "10 cards · quick",
  },
};

// ─── Score change cards for Section 5 ────────────────────
const scoreCards = [
  { swipeJa: "「今の私っぽい！」→", swipeEn: "\"That's me!\" →", value: "+0.1", color: "text-green-400", arrow: "↑", size: "text-2xl", noteJa: "大きく動く！", noteEn: "Big impact!" },
  { swipeJa: "← 「今はちがう」", swipeEn: "← \"Not me\"", value: "+0.05", color: "text-cyan-400", arrow: "↗", size: "text-lg", noteJa: "ちょっとだけ動く", noteEn: "Small nudge" },
];

// ═════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════
export default function AboutClient() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ─── Hero: Single character rotation ───────────────────
  const [heroTypeIdx, setHeroTypeIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  // ─── Gimmick 4: Type card flip ────────────────────────────
  const [flippedType, setFlippedType] = useState<string | null>(null);
  const [flippedScenario, setFlippedScenario] = useState<Record<string, number>>({});
  const [autoFlipPrev, setAutoFlipPrev] = useState<string | null>(null);
  const [manualFlip, setManualFlip] = useState(false);
  const autoFlipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Gimmick 6: SNS share preview ────────────────────────
  const [previewTypeIdx, setPreviewTypeIdx] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  // ─── Gimmick 1+2: Mini swipe + live radar ───────────────
  const [miniCards] = useState(() => {
    // Pick 3 random images (different traits)
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    const picked: typeof allImages = [];
    const usedTraits = new Set<string>();
    for (const img of shuffled) {
      if (!usedTraits.has(img.trait) && picked.length < 3) {
        picked.push(img);
        usedTraits.add(img.trait);
      }
    }
    return picked;
  });
  const [miniIndex, setMiniIndex] = useState(0);
  const [miniScores, setMiniScores] = useState<CheckScores>({
    openness: 0.5, conscientiousness: 0.5, extraversion: 0.5, agreeableness: 0.5, neuroticism: 0.5,
  });
  const [miniDrag, setMiniDrag] = useState(0);
  const [miniFeedback, setMiniFeedback] = useState<string | null>(null);
  const miniDragging = useRef(false);
  const miniStartX = useRef(0);
  const [miniDone, setMiniDone] = useState(false);

  // Fade-in refs
  const heroRef = useFadeIn();
  const howRef = useFadeIn();
  const typesRef = useFadeIn();
  const oceanRef = useFadeIn();
  const scoreRef = useFadeIn();
  const philoRef = useFadeIn();
  const ctaRef = useFadeIn();

  // ─── Gimmick 5: Count-up animation ──────────────────────
  const [scoreAnimProgress, setScoreAnimProgress] = useState(0);
  const scoreCountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scoreCountRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const duration = 600;
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setScoreAnimProgress(p);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── Language detection: ?l= param only, default en ───
  useEffect(() => {
    const paramLang = searchParams.get("l");
    setLang(paramLang === "ja" ? "ja" : "en");
  }, [searchParams]);

  // ─── Scroll progress bar ───────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Hero character rotation ──────────────────────────
  useEffect(() => {
    if (heroPaused) return;
    const timer = setInterval(() => {
      setHeroTypeIdx((prev) => (prev + 1) % typeIds.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [heroPaused]);

  // ─── Hero dot click handler ──────────────────────────
  const heroTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHeroDot = useCallback((index: number) => {
    setHeroTypeIdx(index);
    setHeroPaused(true);
    if (heroTimerRef.current) clearTimeout(heroTimerRef.current);
    heroTimerRef.current = setTimeout(() => setHeroPaused(false), 5000);
  }, []);

  // ─── Gimmick 1: Mini swipe handlers ──────────────────
  const handleMiniPointerDown = useCallback((e: React.PointerEvent) => {
    miniDragging.current = true;
    miniStartX.current = e.clientX;
    setMiniDrag(0);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleMiniPointerMove = useCallback((e: React.PointerEvent) => {
    if (!miniDragging.current) return;
    setMiniDrag(e.clientX - miniStartX.current);
  }, []);

  const handleMiniPointerUp = useCallback(() => {
    if (!miniDragging.current) return;
    miniDragging.current = false;
    const threshold = 50;
    const card = miniCards[miniIndex];
    if (!card || miniDone) { setMiniDrag(0); return; }

    if (Math.abs(miniDrag) > threshold) {
      const isMe = miniDrag > 0;
      const trait = card.trait as keyof CheckScores;
      const delta = isMe
        ? (card.direction === "high" ? 0.1 : -0.1)
        : (card.direction === "high" ? -0.05 : 0.05);

      setMiniScores((prev) => ({
        ...prev,
        [trait]: Math.max(0, Math.min(1, prev[trait] + delta)),
      }));

      const traitLabel = lang === "ja" ? traitInfo[trait].labelJa : traitInfo[trait].labelEn;
      const sign = delta >= 0 ? "+" : "";
      setMiniFeedback(`${traitLabel} ${sign}${delta.toFixed(2)}`);
      setTimeout(() => setMiniFeedback(null), 1200);

      if (miniIndex >= miniCards.length - 1) {
        setMiniDone(true);
      } else {
        setMiniIndex((i) => i + 1);
      }
    }
    setMiniDrag(0);
  }, [miniCards, miniIndex, miniDrag, miniDone, lang]);

  // ─── Gimmick 4: Auto flip rotation ─────────────────────
  useEffect(() => {
    // 手動フリップ中は自動停止
    if (manualFlip) return;

    const flipRandom = () => {
      const candidates = typeIds.filter((id) => id !== autoFlipPrev);
      const pick = candidates[Math.floor(Math.random() * candidates.length)];

      setFlippedType(pick);
      setFlippedScenario((prev) => ({
        ...prev,
        [pick]: Math.floor(Math.random() * personalityTypes[pick].scenariosJa.length),
      }));
      setAutoFlipPrev(pick);

      // 2.5秒後に戻す
      autoFlipTimerRef.current = setTimeout(() => {
        setFlippedType(null);
      }, 2500);
    };

    const interval = setInterval(flipRandom, 4000);
    return () => {
      clearInterval(interval);
      if (autoFlipTimerRef.current) clearTimeout(autoFlipTimerRef.current);
    };
  }, [manualFlip, autoFlipPrev]);

  // ─── Gimmick 6: SNS preview rotation ──────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewTypeIdx((prev) => (prev + 1) % typeIds.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // ─── Language toggle ───────────────────────────────────
  const toggleLang = () => {
    const newLang = lang === "ja" ? "en" : "ja";
    setLang(newLang);
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set("l", newLang);
    window.history.replaceState({}, "", url.toString());
  };

  // ─── Loading ───────────────────────────────────────────
  if (!lang) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const t = translations[lang];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650] overflow-x-hidden">
      {/* ─── Scroll Progress Bar (Gimmick 8) ─── */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60]">
        <div
          className="h-full transition-[width] duration-100"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, #3b82f6, #22c55e, #f97316, #ec4899, #a855f7, #ef4444, #facc15, #06b6d4)",
          }}
        />
      </div>

      {/* ─── Language Toggle ─── */}
      <button
        onClick={toggleLang}
        className="fixed top-4 right-4 px-3 py-1 text-sm text-indigo-200 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-50 btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
      >
        {lang === "ja" ? "English" : "日本語"}
      </button>

      <main className="max-w-md md:max-w-2xl mx-auto px-6">

        {/* ═══════════════════════════════════════════════ */}
        {/* Section 1: Hero                                */}
        {/* ═══════════════════════════════════════════════ */}
        <section ref={heroRef} className="fade-in-section min-h-screen flex flex-col items-center justify-center text-center relative py-8">
          {/* Background */}
          <div className="absolute inset-0 -mx-6 overflow-hidden pointer-events-none">
            <img src="/images/bg/hero-top.png" alt="" className="w-full h-full object-cover opacity-[0.18]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Brand name */}
            <p
              className="text-sm tracking-widest mb-6"
              style={{ animation: "fadeSlideUp 0.6s ease-out 0.1s both" }}
            >
              <SwipeOceanLogo />
            </p>

            {/* Hero Character Card — 1体ローテーション */}
            {(() => {
              const heroType = types[heroTypeIdx];
              const heroTypeId = typeIds[heroTypeIdx];
              return (
                <div
                  className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden mb-3 border"
                  style={{
                    backgroundColor: `${heroType.color}10`,
                    borderColor: `${heroType.color}30`,
                    animation: "fadeSlideUp 0.6s ease-out 0.2s both",
                  }}
                >
                  {/* Background scene */}
                  <div className="absolute inset-0 pointer-events-none">
                    <img src={heroType.backgroundImage} alt="" className="w-full h-full object-cover opacity-[0.15]" />
                  </div>
                  {/* Character */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    <div
                      className="w-32 h-32 sm:w-40 sm:h-40 transition-opacity duration-500"
                      style={{ animation: `${typeAnimationName[heroTypeId]} infinite` }}
                    >
                      <img src={heroType.image} alt={lang === "ja" ? heroType.nameJa : heroType.nameEn} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  {/* Bottom color bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: heroType.color }} />
                </div>
              );
            })()}

            {/* Type name */}
            <p
              className="text-sm font-bold mb-2 transition-colors duration-500"
              style={{ color: types[heroTypeIdx].color }}
            >
              {lang === "ja" ? types[heroTypeIdx].nameJa : types[heroTypeIdx].nameEn}
            </p>

            {/* 8-color dot indicators */}
            <div className="flex justify-center gap-2 mb-4">
              {typeIds.map((id, i) => (
                <button
                  key={id}
                  onClick={() => handleHeroDot(i)}
                  className="rounded-full transition-all duration-300 focus:outline-none focus:scale-150"
                  style={{
                    backgroundColor: personalityTypes[id].color,
                    width: i === heroTypeIdx ? "12px" : "8px",
                    height: i === heroTypeIdx ? "12px" : "8px",
                    opacity: i === heroTypeIdx ? 1 : 0.4,
                  }}
                  aria-label={lang === "ja" ? personalityTypes[id].nameJa : personalityTypes[id].nameEn}
                />
              ))}
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent mb-4"
              style={{ animation: "fadeSlideUp 0.6s ease-out 0.3s both" }}
            >
              {t.heroTitle}
            </h1>

            {/* Subcopy */}
            <div style={{ animation: "fadeSlideUp 0.6s ease-out 0.5s both" }}>
              <p className="text-base sm:text-xl font-bold text-white mb-1">{t.heroSub1}</p>
              <p className="text-base sm:text-lg text-indigo-200">{t.heroSub2}</p>
            </div>

            {/* CTA */}
            <div className="mt-8" style={{ animation: "fadeSlideUp 0.6s ease-out 0.7s both" }}>
              <Link
                href={`/swipe?l=${lang}`}
                className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/25 btn-press flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
                style={{ animation: "gentle-pulse 2s ease-in-out infinite" }}
              >
                <span>{t.heroCta1}</span>
                <span className="text-xs opacity-80">{t.heroCta1Sub}</span>
              </Link>
            </div>

            {/* Philosophy message (below CTA for rhythm) */}
            {t.heroSub3 && (
              <p
                className="text-sm sm:text-base text-indigo-200/80 mt-6 max-w-xs text-center"
                style={{ animation: "fadeSlideUp 0.6s ease-out 0.9s both" }}
              >
                {t.heroSub3}
              </p>
            )}

          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* Section 1.5: Swipe image marquee (showcase)    */}
        {/* ═══════════════════════════════════════════════ */}
        <SwipeMarquee />

        {/* ═══════════════════════════════════════════════ */}
        {/* Section 2: How It Works                        */}
        {/* ═══════════════════════════════════════════════ */}
        <section ref={howRef} className="fade-in-section py-12">
          <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-bold text-indigo-100 text-center mb-8">{t.howTitle}</h2>

          <div className="space-y-6">
            {[
              { num: 1, title: t.howStep1Title, desc: t.howStep1Desc, icon: "/images/swipe-hints/swipe-right.png" },
              { num: 2, title: t.howStep2Title, desc: t.howStep2Desc, icon: "/images/traits/trait_openness.png" },
              { num: 3, title: t.howStep3Title, desc: t.howStep3Desc, icon: "/images/characters/type_explorer.png" },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-indigo-100 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-300">{step.desc}</p>
                </div>
                <div className="flex-shrink-0 w-12 h-12">
                  <img src={step.icon} alt="" className="w-full h-full object-contain" loading="lazy" />
                </div>
              </div>
            ))}
          </div>

          {/* Gimmick 1+2: Mini Swipe + Live Radar */}
          <div className="mt-10 bg-white/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-5">
            <p className="text-sm font-bold text-indigo-200 text-center mb-4">
              {lang === "ja" ? "ためしにスワイプしてみよ！" : "Try swiping!"}
            </p>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Mini swipe card */}
              <div className="flex-1 flex flex-col items-center">
                {!miniDone && miniCards[miniIndex] ? (
                  <>
                    <div className="relative select-none touch-none">
                      {/* Drag hints */}
                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                        {miniDrag < -20 && "←"}
                      </div>
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                        {miniDrag > 20 && "→"}
                      </div>

                      <div
                        className="w-40 h-40 rounded-xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing transition-shadow"
                        style={{
                          transform: `translateX(${miniDrag}px) rotate(${miniDrag * 0.15}deg)`,
                          boxShadow: miniDrag > 20
                            ? "0 0 20px rgba(167,139,250,0.4)"
                            : miniDrag < -20
                              ? "0 0 20px rgba(100,116,139,0.4)"
                              : undefined,
                        }}
                        onPointerDown={handleMiniPointerDown}
                        onPointerMove={handleMiniPointerMove}
                        onPointerUp={handleMiniPointerUp}
                      >
                        <img
                          src={`/images/swipe/${miniCards[miniIndex].src}`}
                          alt=""
                          className="w-full h-full object-cover pointer-events-none"
                          draggable={false}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 select-none">
                      {lang === "ja"
                        ? `← 今はちがう ・ 今の私っぽい →  （${miniIndex + 1}/${miniCards.length}）`
                        : `← Not me · That's me! →  (${miniIndex + 1}/${miniCards.length})`}
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-indigo-200 mb-3">
                      {lang === "ja"
                        ? <>たった3枚でも形が変わった！<br />10枚やったら、もっと変わる！</>
                        : <>Just 3 swipes changed the shape!<br />10 cards will reveal even more!</>}
                    </p>
                    <Link
                      href={`/swipe?l=${lang}`}
                      className="inline-block px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/25 btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
                    >
                      {lang === "ja" ? "もっとやってみる？" : "Want to try more?"}
                    </Link>
                  </div>
                )}

                {/* Feedback popup */}
                {miniFeedback && (
                  <div className="mt-2 px-3 py-1 bg-violet-500/20 border border-violet-400/30 rounded-full text-xs font-bold text-violet-300" style={{ animation: "fadeSlideUp 0.3s ease-out" }}>
                    {miniFeedback}
                  </div>
                )}
              </div>

              {/* Mini radar chart (Gimmick 2) */}
              <div className="flex-shrink-0">
                <svg viewBox="0 0 200 200" className="w-40 h-40">
                  {/* Grid */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
                    <polygon
                      key={level}
                      points={traitKeys.map((_, i) => {
                        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                        const r = level * 70;
                        return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                      }).join(" ")}
                      fill="none"
                      stroke="rgba(129,140,248,0.15)"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Data polygon */}
                  <polygon
                    points={traitKeys.map((trait, i) => {
                      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                      const r = miniScores[trait] * 70;
                      return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                    }).join(" ")}
                    fill="rgba(167,139,250,0.25)"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                  {/* Points */}
                  {traitKeys.map((trait, i) => {
                    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                    const r = miniScores[trait] * 70;
                    return (
                      <circle
                        key={trait}
                        cx={100 + r * Math.cos(angle)}
                        cy={100 + r * Math.sin(angle)}
                        r="3"
                        fill={traitInfo[trait].color}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                  {/* Labels */}
                  {traitKeys.map((trait, i) => {
                    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                    const r = 90;
                    return (
                      <text
                        key={trait}
                        x={100 + r * Math.cos(angle)}
                        y={100 + r * Math.sin(angle) + (i >= 2 && i <= 3 ? 4 : 0)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={traitInfo[trait].color}
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {(lang === "ja" ? traitInfo[trait].labelJa : traitInfo[trait].labelEn).slice(0, 3)}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Mid CTA */}
          <div className="text-center mt-8">
            <Link
              href={`/swipe?l=${lang}`}
              className="inline-block px-5 py-2.5 text-sm font-bold text-indigo-200 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60"
            >
              {t.howMidCta}
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* Section 3: 8 Types                             */}
        {/* ═══════════════════════════════════════════════ */}
        <section ref={typesRef} className="fade-in-section py-12">
          <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-bold text-indigo-100 text-center mb-2">{t.typesTitle}</h2>
          <p className="text-center text-slate-400 mb-8">{t.typesSub}</p>

          {/* Horizontal scroll carousel */}
          <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 -mx-2 px-2 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible select-none">
            {types.map((type) => {
              const isFlipped = flippedType === type.id;
              const scenarios = lang === "ja" ? type.scenariosJa : type.scenariosEn;
              const scenarioIdx = (flippedScenario[type.id] ?? 0) % scenarios.length;
              return (
                <div
                  key={type.id}
                  className="snap-center flex-shrink-0 w-56 md:w-auto cursor-pointer relative"
                  onClick={() => {
                    // 自動フリップを一時停止
                    if (autoFlipTimerRef.current) clearTimeout(autoFlipTimerRef.current);
                    setManualFlip(true);

                    if (isFlipped) {
                      setFlippedType(null);
                      // 手動で戻したら5秒後に自動再開
                      setTimeout(() => setManualFlip(false), 5000);
                    } else {
                      setFlippedType(type.id);
                      setFlippedScenario((prev) => ({
                        ...prev,
                        [type.id]: Math.floor(Math.random() * scenarios.length),
                      }));
                    }
                  }}
                >
                    {/* Front */}
                    <div
                      className={`rounded-2xl p-4 border relative min-h-[230px] transition-opacity duration-300 ${isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                      style={{
                        backgroundColor: `${type.color}10`,
                        borderColor: `${type.color}30`,
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                        <img src={type.backgroundImage} alt="" className="w-full h-full object-cover opacity-[0.15]" loading="lazy" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 mb-3" style={{ animation: `${typeAnimationName[type.id]} infinite` }}>
                          <img src={type.image} alt={lang === "ja" ? type.nameJa : type.nameEn} className="w-full h-full object-contain" loading="lazy" />
                        </div>
                        <h3 className="text-lg font-bold mb-1" style={{ color: type.color }}>
                          {lang === "ja" ? type.nameJa : type.nameEn}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {(lang === "ja" ? type.descriptionJa : type.descriptionEn).split(/[。.!]/)[0]}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-2">
                          {lang === "ja" ? "👆 タップで裏返る" : "👆 Tap to flip"}
                        </p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl" style={{ backgroundColor: type.color }} />
                    </div>

                    {/* Back — あるある */}
                    <div
                      className={`rounded-2xl p-4 border absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                      style={{
                        backgroundColor: `${type.color}15`,
                        borderColor: `${type.color}40`,
                      }}
                    >
                      <div className="w-12 h-12 mb-3">
                        <img src={type.image} alt="" className="w-full h-full object-contain" loading="lazy" />
                      </div>
                      <p className="text-xs font-bold mb-2" style={{ color: type.color }}>
                        {lang === "ja" ? "あるある" : "Relatable?"}
                      </p>
                      <p className="text-sm text-indigo-100 leading-relaxed">
                        {scenarios[scenarioIdx]}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-3">
                        {lang === "ja" ? "タップで戻る" : "Tap to flip back"}
                      </p>
                    </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* Section 4: OCEAN                               */}
        {/* ═══════════════════════════════════════════════ */}
        <section ref={oceanRef} className="fade-in-section py-12 -mx-6 px-6 bg-gradient-to-b from-[#0a0f2a] to-[#131a3f] rounded-3xl">
          <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-bold text-indigo-100 text-center mb-4">{t.oceanTitle}</h2>
          <p className="text-center text-slate-300 mb-8">{t.oceanIntro}</p>

          {/* O-C-E-A-N letters */}
          <div className="flex justify-center gap-4 mb-8">
            {oceanLetters.map((l) => (
              <span key={l.letter} className="text-4xl font-black" style={{ color: l.color }}>
                {l.letter}
              </span>
            ))}
          </div>

          {/* 5 Trait cards */}
          <div className="space-y-3 mb-8">
            {traitKeys.map((key) => {
              const info = traitInfo[key];
              return (
                <div
                  key={key}
                  className="bg-white/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10">
                    <img src={info.icon} alt="" className="w-full h-full object-contain" loading="lazy" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: info.color }}>
                      {lang === "ja" ? info.labelJa : info.labelEn}
                    </h3>
                    <p className="text-xs text-slate-300">{lang === "ja" ? info.descJa : info.descEn}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key message */}
          <div className="bg-violet-500/15 border border-violet-400/30 rounded-2xl p-4 text-center mb-8">
            <p className="text-lg font-bold text-violet-300">{t.oceanKey}</p>
          </div>

          <p className="text-sm text-slate-300 text-center mt-6">{t.mbtiCopy}</p>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* Section 5: How Scoring Works                   */}
        {/* ═══════════════════════════════════════════════ */}
        <section ref={scoreRef} className="fade-in-section py-12">
          <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-bold text-indigo-100 text-center mb-4">{t.scoreTitle}</h2>
          <p className="text-sm text-slate-400 text-center mb-8">{t.scoreIntro}</p>

          {/* Example images */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* High direction + right swipe = +0.1 */}
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 border border-indigo-400/20 relative">
                <img src="/images/swipe/openness_high_01.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-2 right-2 bg-green-500/80 text-white text-xs font-bold px-2 py-0.5 rounded-full">→</div>
              </div>
              <p className="text-xs text-slate-400 mb-1">
                {lang === "ja" ? "「今の私っぽい！」→" : "\"That's me!\" →"}
              </p>
              <p className="text-sm font-bold text-green-400">
                {lang === "ja" ? "開放性 +0.1" : "Openness +0.1"}
              </p>
            </div>
            {/* Low direction + left swipe = +0.05 */}
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 border border-indigo-400/20 relative">
                <img src="/images/swipe/extraversion_low_01.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-2 left-2 bg-slate-500/80 text-white text-xs font-bold px-2 py-0.5 rounded-full">←</div>
              </div>
              <p className="text-xs text-slate-400 mb-1">
                {lang === "ja" ? "← 「今はちがう」" : "← \"Not me\""}
              </p>
              <p className="text-sm font-bold text-cyan-400">
                {lang === "ja" ? "外向性 +0.05" : "Extraversion +0.05"}
              </p>
            </div>
          </div>

          {/* Score change cards */}
          <h3 className="text-xl font-bold text-indigo-200 mb-4">{t.score5aTitle}</h3>
          <div ref={scoreCountRef} className="grid grid-cols-2 gap-3 mb-4">
            {scoreCards.map((card, i) => {
              const numVal = parseFloat(card.value.replace("−", "-"));
              const animated = (numVal * scoreAnimProgress).toFixed(2);
              const display = numVal >= 0 ? `+${animated}` : animated;
              return (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-4 text-center">
                  <p className="text-sm font-bold text-slate-300 mb-2">{lang === "ja" ? card.swipeJa : card.swipeEn}</p>
                  <p className={`font-bold ${card.color} ${card.size} mb-1`}>
                    {card.arrow} {display}
                  </p>
                  <p className="text-xs text-slate-500">{lang === "ja" ? card.noteJa : card.noteEn}</p>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-slate-300">{t.score5aNote}</p>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* Section 6: Philosophy                          */}
        {/* ═══════════════════════════════════════════════ */}
        <section ref={philoRef} className="fade-in-section py-10 -mx-6 px-6 bg-gradient-to-b from-[#120a25] to-[#1a1045] rounded-3xl">
          <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-bold text-indigo-100 text-center mb-2">{t.philoTitle}</h2>
          <AnimatedText text={t.philoSub} className="text-center text-slate-300" />
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* Section 7: Final CTA                           */}
        {/* ═══════════════════════════════════════════════ */}
        <section ref={ctaRef} className="fade-in-section flex flex-col items-center justify-center text-center py-12">
          {/* 8 Characters (bigger) */}
          <div className="flex justify-center gap-1 sm:gap-3 mb-8">
            {types.map((type, i) => (
              <div
                key={type.id}
                className="w-10 h-10 sm:w-14 sm:h-14"
                style={{
                  animation: `bounce-pop 0.5s ease-out ${characterAnimations[i].delay} both`,
                }}
              >
                <img src={type.image} alt={lang === "ja" ? type.nameJa : type.nameEn} className="w-full h-full object-contain" loading="lazy" />
              </div>
            ))}
          </div>

          {/* Gimmick 6: SNS Share Preview */}
          <div className="mb-8 w-full max-w-xs mx-auto">
            <p className="text-xs text-slate-400 mb-3 text-center">
              {lang === "ja" ? "友達のタイムラインにはこう見える！" : "This is how it looks on your friends' feed!"}
            </p>
            <div className="relative rounded-2xl border border-white/10 bg-black/30 p-2 shadow-xl">
              <div className="relative aspect-[1200/630] rounded-xl overflow-hidden">
                {typeIds.map((id, i) => (
                  <img
                    key={id}
                    src={`/images/ogp/${id}-${lang}.png`}
                    alt={lang === "ja" ? personalityTypes[id].nameJa : personalityTypes[id].nameEn}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: i === previewTypeIdx ? 1 : 0 }}
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="flex justify-center gap-1.5 mt-2">
                {typeIds.map((id, i) => (
                  <div
                    key={id}
                    className="rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: personalityTypes[id].color,
                      width: i === previewTypeIdx ? "10px" : "6px",
                      height: i === previewTypeIdx ? "10px" : "6px",
                      opacity: i === previewTypeIdx ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-2">
            {lang === "ja" ? "8タイプ、キミはどの色？" : "8 types — what's your color?"}
          </p>
          <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-bold text-indigo-100 mb-2">{t.ctaTitle}</h2>
          <p className="text-base text-indigo-200 mb-8">{t.ctaSub}</p>

          <div>
            <Link
              href={`/swipe?l=${lang}`}
              className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/25 btn-press flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
              style={{ animation: "gentle-pulse 2s ease-in-out infinite" }}
            >
              <span>{t.ctaCta1}</span>
              <span className="text-xs opacity-80">{t.ctaCta1Sub}</span>
            </Link>
          </div>

          {/* Share LP button */}
          <button
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) {
                try { await navigator.share({ title: "Swipe Ocean", url }); } catch { /* cancelled */ }
              } else {
                await navigator.clipboard.writeText(url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
              }
            }}
            className="mt-4 text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200 transition-colors btn-press focus:outline-none focus:ring-1 focus:ring-violet-400/40"
          >
            {shareCopied
              ? (lang === "ja" ? "コピーした！" : "Copied!")
              : (lang === "ja" ? "友達に教える 📲" : "Share with friends 📲")}
          </button>
        </section>

      </main>

      <footer className="py-4 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
        <a
          href="https://x.com/shumatsumonobu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-300 transition-colors focus:outline-none focus:ring-1 focus:ring-violet-400/40 rounded"
        >
          @shumatsumonobu
        </a>
        <span>·</span>
        <Link href={`/?l=${lang}`} className="hover:text-slate-300 transition-colors focus:outline-none focus:ring-1 focus:ring-violet-400/40 rounded">
          {lang === "ja" ? "ホーム" : "Home"}
        </Link>
      </footer>
    </div>
  );
}
