"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SwipeOceanLogo from "@/components/SwipeOceanLogo";

import { personalityTypes } from "@/data/personalityTypes";
import { typeAnimationName, characterAnimations } from "@/data/characterAnimations";
import { useFadeIn } from "@/hooks/useFadeIn";

const translations = {
  ja: {
    title: "Swipe Ocean",
    subtitle: "今日のキミ、どんな色？",
    aboutTitle: "Swipe Oceanってなに？",
    aboutText: "心理学の「Big Five」がベース。今の気分を5つの特性でサクッと見える化。どんな結果でも、ぜんぶキミのいいとこ！",
    aboutUsage: "気分なんてコロコロ変わる。何回やってもいい！",
    traits: ["開放性", "誠実性", "外向性", "協調性", "繊細性"],
    howTitle: "あそびかた",
    step1: "直感でスワイプ",
    step1Desc: "画像を見て「今の私っぽい」か「今はちがう」を直感でえらぶだけ",
    step2: "パターンをサクッと分析",
    step2Desc: "キミがえらんだパターンから、今の気分をよみとく",
    step3: "キミのタイプは？",
    step3Desc: "8つのタイプから、今日のキミにピッタリなやつを出す！",
    time: "だいたい1分でおわる",
    typesTitle: "8つのタイプ",
    typesSubtitle: "キミはどれだろ？",
  },
  en: {
    title: "Swipe Ocean",
    subtitle: "Hey, what color are you today?",
    aboutTitle: "What's Swipe Ocean?",
    aboutText: "Built on psychology's Big Five — it maps your mood across 5 traits, quick and easy. Whatever you get, it's all the good stuff about you!",
    aboutUsage: "Your mood's always shifting — come back whenever!",
    traits: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Sensitivity"],
    howTitle: "How to Play",
    step1: "Swipe your vibe",
    step1Desc: "See an image — feel like you today? Just swipe right or left!",
    step2: "Patterns decoded",
    step2Desc: "Your swipes spill your current vibe",
    step3: "What's your type?",
    step3Desc: "We'll find the type that's totally you today!",
    time: "About a minute, that's it",
    typesTitle: "8 Types",
    typesSubtitle: "Which one's you?",
  },
};

type Language = "ja" | "en";


export default function HomeClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]"><div className="text-slate-400">Loading...</div></div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language | null>(null);
  const [tappedChar, setTappedChar] = useState<string | null>(null);

  const isDevMode = searchParams.get("dev") === "1";
  const devParam = isDevMode ? "&dev=1" : "";

  // 案6: ?friend= パラメータ（シェアリンクからの訪問者向け）
  const friendTypeId = searchParams.get("friend");
  const friendType = friendTypeId && friendTypeId in personalityTypes
    ? personalityTypes[friendTypeId as keyof typeof personalityTypes]
    : null;

  // スクロールフェードイン用ref
  const howRef = useFadeIn();
  const typesRef = useFadeIn();
  const aboutRef = useFadeIn();

  useEffect(() => {
    const paramLang = searchParams.get("l");
    setLang(paramLang === "ja" ? "ja" : "en");
  }, [searchParams]);

  if (!lang) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const toggleLang = () => {
    const newLang = lang === "ja" ? "en" : "ja";
    setLang(newLang);
    const url = new URL(window.location.href);
    url.searchParams.set("l", newLang);
    window.history.replaceState({}, "", url.toString());
  };

  const t = translations[lang];
  const characters = Object.values(personalityTypes);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
      {/* 言語切替 */}
      <button
        onClick={toggleLang}
        className="fixed top-4 right-4 px-3 py-1 text-sm text-indigo-200 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-50 btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
      >
        {lang === "ja" ? "English" : "日本語"}
      </button>

      <main className="flex-1 flex flex-col items-center px-6 py-8 max-w-md mx-auto">
        {/* ヒーローセクション */}
        <section className="relative text-center mb-8 w-full">
          {/* ヒーロー背景イラスト */}
          <div className="absolute inset-0 -mx-6 -mt-8 overflow-hidden pointer-events-none">
            <img
              src="/images/bg/hero-top.png"
              alt=""
              className="w-full h-full object-cover opacity-[0.18]"
            />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-3">
              <SwipeOceanLogo />
            </h1>
            <p className="text-xl text-indigo-300 mb-3">
              {friendType
                ? (lang === "ja"
                  ? `友達は${friendType.nameJa}だったって！キミは何タイプ？`
                  : `Your friend got ${friendType.nameEn}! What about you?`)
                : t.subtitle
              }
            </p>
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <span className="px-2.5 py-0.5 bg-violet-500/30 text-violet-300 rounded-full text-sm font-bold">
                {lang === "ja" ? "心理学" : "Psychology"}
              </span>
              <span className="text-sm text-slate-400">
                {lang === "ja" ? "でキミの今を分析" : "to read your vibe"}
              </span>
            </div>

            {/* キャラクター集合（CTAの前に移動・大きく） */}
            <div className="flex justify-center items-end gap-2 mb-6 w-full px-2">
              <style jsx>{`
                @keyframes bounce-pop {
                  0%, 100% { transform: translateY(0) scale(1); }
                  30% { transform: translateY(-14px) scale(1.05); }
                  50% { transform: translateY(-2px) scale(0.97); }
                  70% { transform: translateY(-7px) scale(1.02); }
                }
                @keyframes char-tap {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.3); }
                  100% { transform: scale(1); }
                }
              `}</style>
              {characters.map((char, index) => (
                <div
                  key={char.id}
                  className="relative flex-1 max-w-[64px] aspect-square cursor-pointer"
                  style={{
                    animation: tappedChar === char.id
                      ? `char-tap 0.3s ease-out`
                      : `bounce-pop 1.4s ease-in-out infinite`,
                    animationDelay: tappedChar === char.id ? "0s" : characterAnimations[index].delay,
                  }}
                  onClick={() => {
                    setTappedChar(char.id);
                    setTimeout(() => setTappedChar(null), 400);
                  }}
                >
                  <img
                    src={char.image}
                    alt={lang === "ja" ? char.nameJa : char.nameEn}
                    className="w-full h-full object-contain object-bottom"
                  />
                  {/* タップ時にタイプ名表示 */}
                  {tappedChar === char.id && (
                    <span
                      className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap"
                      style={{ color: char.color }}
                    >
                      {lang === "ja" ? char.nameJa : char.nameEn}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* メインCTA */}
            <div className="w-full max-w-xs mx-auto mb-4">
              <Link
                href={`/swipe?l=${lang}${devParam}`}
                className="w-full px-4 py-4 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full text-base font-semibold hover:from-violet-400 hover:to-indigo-400 transition-all shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_10px_rgba(55,48,163,0.55),0_4px_20px_rgba(129,140,248,0.4)] flex flex-col items-center justify-center btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
                style={{ animation: "gentle-pulse 2s ease-in-out infinite" }}
              >
                <div>{lang === "ja" ? "やってみる！" : "Try it!"}</div>
                <div className="text-xs opacity-80">{lang === "ja" ? "約10秒" : "~10 sec"}</div>
              </Link>
              <style jsx>{`
                @keyframes gentle-pulse {
                  0%, 100% { box-shadow: inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -4px 10px rgba(55,48,163,0.55), 0 4px 15px rgba(129,140,248,0.3); }
                  50% { box-shadow: inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -4px 10px rgba(55,48,163,0.55), 0 4px 25px rgba(129,140,248,0.5); }
                }
              `}</style>
            </div>

          </div>
        </section>

        {/* あそびかたセクション */}
        <section ref={howRef} className="fade-in-section w-full mb-10">
          <h2 className="text-lg font-bold text-indigo-200 mb-4 text-center">{t.howTitle}</h2>
          <div className="space-y-4">
            {[
              { num: 1, title: t.step1, desc: t.step1Desc },
              { num: 2, title: t.step2, desc: t.step2Desc },
              { num: 3, title: t.step3, desc: t.step3Desc },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3 bg-white/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-5">
                <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-base font-bold flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <p className="text-base font-semibold text-indigo-200">{step.title}</p>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8タイプチラ見せセクション */}
        <section ref={typesRef} className="fade-in-section w-full mb-10">
          <h2 className="text-lg font-bold text-indigo-200 mb-1 text-center">{t.typesTitle}</h2>
          <p className="text-sm text-slate-400 mb-4 text-center">{t.typesSubtitle}</p>
          <style jsx>{`
            @keyframes explorer-bounce {
              0%, 100% { transform: translateY(0) rotate(-3deg); }
              50% { transform: translateY(-12px) rotate(3deg); }
            }
            @keyframes planner-nod {
              0%, 100% { transform: translateY(0); }
              25% { transform: translateY(-5px); }
              75% { transform: translateY(3px); }
            }
            @keyframes socialite-jump {
              0%, 100% { transform: translateY(0) scale(1); }
              25% { transform: translateY(-15px) scale(1.05); }
              50% { transform: translateY(-5px) scale(1); }
              75% { transform: translateY(-10px) scale(1.02); }
            }
            @keyframes harmonizer-float {
              0%, 100% { transform: translateY(0) translateX(0); }
              25% { transform: translateY(-8px) translateX(3px); }
              75% { transform: translateY(-4px) translateX(-3px); }
            }
            @keyframes empath-pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.03); opacity: 0.9; }
            }
            @keyframes adventurer-shake {
              0%, 100% { transform: translateX(0) rotate(0deg); }
              20% { transform: translateX(-5px) rotate(-5deg); }
              40% { transform: translateX(5px) rotate(5deg); }
              60% { transform: translateX(-3px) rotate(-3deg); }
              80% { transform: translateX(3px) rotate(3deg); }
            }
            @keyframes craftsman-focus {
              0%, 100% { transform: scale(1) rotate(0deg); }
              50% { transform: scale(1.02) rotate(2deg); }
            }
            @keyframes balancer-sway {
              0%, 100% { transform: rotate(-3deg); }
              50% { transform: rotate(3deg); }
            }
          `}</style>
          <div className="grid grid-cols-4 gap-2">
            {characters.map((type) => (
              <div
                key={type.id}
                className="flex flex-col items-center p-3 rounded-2xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: `${type.color}20` }}
              >
                <div
                  className="relative w-14 h-14 mb-1"
                  style={{ animation: `${type.id}-${typeAnimationName[type.id]} infinite` }}
                >
                  <img
                    src={type.image}
                    alt={lang === "ja" ? type.nameJa : type.nameEn}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span
                  className="text-xs font-semibold text-center leading-tight"
                  style={{ color: type.color }}
                >
                  {lang === "ja" ? type.nameJa : type.nameEn}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* LP導線 */}
        <div className="text-center mb-6">
          <Link
            href={`/about?l=${lang}`}
            className="inline-block px-5 py-2.5 text-sm font-bold text-indigo-200 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60"
          >
            {lang === "ja" ? "もっとくわしく →" : "Learn more →"}
          </Link>
        </div>

        {/* 下部CTA */}
        <section className="w-full text-center mb-10">
          <Link
            href={`/swipe?l=${lang}${devParam}`}
            className="inline-block px-10 py-4 text-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full font-semibold hover:from-violet-400 hover:to-indigo-400 transition-all shadow-[0_4px_20px_rgba(129,140,248,0.4)] btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
          >
            {lang === "ja" ? "さっそくやってみる！" : "Try it now!"}
          </Link>
        </section>

        {/* Swipe Oceanって？（補足情報） */}
        <section ref={aboutRef} className="fade-in-section w-full p-5 mb-8 bg-white/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl">
          <h2 className="text-sm font-bold text-slate-400 mb-2">
            {lang === "ja"
              ? <SwipeOceanLogo suffix="って？" />
              : <>What&apos;s <SwipeOceanLogo />?</>}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-2">{t.aboutText}</p>
          <p className="text-sm text-slate-400">{t.aboutUsage}</p>
        </section>

      </main>

      {/* フッター */}
      <footer className="py-4 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
        <a
          href="https://x.com/shumatsumonobu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-300 transition-colors"
        >
          @shumatsumonobu
        </a>
        <span>·</span>
        <Link href={`/about?l=${lang}`} className="hover:text-slate-300 transition-colors">
          About
        </Link>
      </footer>
    </div>
  );
}
