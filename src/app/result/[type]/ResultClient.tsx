"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import type { SwipeResult, ImageMeta, CheckScores, PersonalityTypeId } from "@/types";
import { personalityTypes, determinePersonalityType } from "@/data/personalityTypes";
import { traitInfo } from "@/data/traitInfo";
import { useFadeIn } from "@/hooks/useFadeIn";

// デバッグ用のダミースコア
const debugScores: CheckScores = {
  openness: 0.7,
  conscientiousness: 0.6,
  extraversion: 0.5,
  agreeableness: 0.8,
  neuroticism: 0.4,
};

// 有効なタイプIDかチェック
const validTypeIds: PersonalityTypeId[] = [
  "explorer", "planner", "socialite", "harmonizer",
  "empath", "adventurer", "craftsman", "balancer"
];

// 翻訳データ
const translations = {
  ja: {
    title: "結果",
    yourType: "今のキミのタイプ",
    scores: "キミのスコア",
    tryAgain: "もう一回あそぶ！",
    noResults: "まだやってないっぽい！",
    pleaseTest: "まずはスワイプしてみよ！",
    startTest: "やってみる！",
    loading: "結果よみこみ中...",
  },
  en: {
    title: "Results",
    yourType: "Your Current Type",
    scores: "Your Scores",
    tryAgain: "Play again!",
    noResults: "You haven't played yet!",
    pleaseTest: "Swipe a few first!",
    startTest: "Try it!",
    loading: "Loading your results...",
  },
};


type Language = "ja" | "en";

// 配列からランダムにN個選ぶ（Fisher-Yatesシャッフル）
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// スコアを計算する関数
function calculateScores(
  results: SwipeResult[],
  images: ImageMeta[]
): CheckScores {
  const scores: CheckScores = {
    openness: 0.5,
    conscientiousness: 0.5,
    extraversion: 0.5,
    agreeableness: 0.5,
    neuroticism: 0.5,
  };

  results.forEach((result) => {
    const image = images.find((img) => img.id === result.imageId);
    if (!image) return;

    const trait = image.trait;
    const direction = image.direction;
    const isMe = result.choice === "me";

    if (isMe) {
      if (direction === "high") {
        scores[trait] += 0.1;
      } else {
        scores[trait] -= 0.1;
      }
    } else {
      if (direction === "high") {
        scores[trait] -= 0.05;
      } else {
        scores[trait] += 0.05;
      }
    }
  });

  Object.keys(scores).forEach((key) => {
    const trait = key as keyof CheckScores;
    scores[trait] = Math.max(0, Math.min(1, scores[trait]));
  });

  return scores;
}

// シャインアニメーションのキーフレーム
const shineKeyframes = `
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
`;

// スコアカードのコンポーネント
function ScoreCard({
  trait,
  score,
  lang,
}: {
  trait: keyof typeof traitInfo;
  score: number;
  lang: "ja" | "en";
}) {
  const info = traitInfo[trait];
  const value = Math.round(score * 10);
  const percentage = Math.round(score * 100);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-indigo-400/10 rounded-2xl p-4 mb-4">
      <style dangerouslySetInnerHTML={{ __html: shineKeyframes }} />
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <img
              src={info.icon}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h4
              className="text-base font-bold"
              style={{ color: info.color }}
            >
              {lang === "ja" ? info.labelJa : info.labelEn}
            </h4>
            <p className="text-sm text-slate-400">
              {lang === "ja" ? info.descJa : info.descEn}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span
            className="text-2xl font-bold"
            style={{ color: info.color }}
          >
            {value}
          </span>
          <span className="text-sm text-slate-400">/10</span>
        </div>
      </div>
      <div className="w-full bg-indigo-400/10 rounded-full h-3">
        <div
          className={`relative bg-gradient-to-r ${info.gradientClass} h-3 rounded-full transition-all duration-500 overflow-hidden`}
          style={{
            width: `${percentage}%`,
            boxShadow: `0 0 12px ${info.color}60, 0 0 4px ${info.color}40`,
          }}
        >
          <div
            className="absolute inset-0 w-1/2"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              animation: "shine 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// タイプ別アニメーション定義
const typeAnimations: Record<string, { keyframes: string; animation: string }> = {
  explorer: {
    keyframes: `
      @keyframes anim-explorer {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
    `,
    animation: "anim-explorer 3s ease-in-out infinite",
  },
  planner: {
    keyframes: `
      @keyframes anim-planner {
        0%, 100% { transform: translateY(0); }
        25% { transform: translateY(-5px); }
        75% { transform: translateY(3px); }
      }
    `,
    animation: "anim-planner 2.5s ease-in-out infinite",
  },
  socialite: {
    keyframes: `
      @keyframes anim-socialite {
        0%, 100% { transform: translateY(0) scale(1); }
        30% { transform: translateY(-18px) scale(1.05); }
        50% { transform: translateY(0) scale(0.97); }
        70% { transform: translateY(-10px) scale(1.02); }
      }
    `,
    animation: "anim-socialite 1.5s ease-in-out infinite",
  },
  harmonizer: {
    keyframes: `
      @keyframes anim-harmonizer {
        0%, 100% { transform: scaleX(1) scaleY(1); }
        25% { transform: scaleX(1.06) scaleY(0.95); }
        50% { transform: scaleX(0.97) scaleY(1.03); }
        75% { transform: scaleX(1.03) scaleY(0.98); }
      }
    `,
    animation: "anim-harmonizer 2.5s ease-in-out infinite",
  },
  empath: {
    keyframes: `
      @keyframes anim-empath {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.03); opacity: 0.92; }
      }
    `,
    animation: "anim-empath 3s ease-in-out infinite",
  },
  adventurer: {
    keyframes: `
      @keyframes anim-adventurer {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        40% { transform: translateX(8px) rotate(5deg); }
        60% { transform: translateX(5px) rotate(3deg); }
      }
    `,
    animation: "anim-adventurer 2s ease-in-out infinite",
  },
  craftsman: {
    keyframes: `
      @keyframes anim-craftsman {
        0%, 100% { transform: translateY(0); }
        15% { transform: translateY(-6px); }
        30% { transform: translateY(0); }
        45% { transform: translateY(-4px); }
        60% { transform: translateY(0); }
      }
    `,
    animation: "anim-craftsman 2.5s ease-in-out infinite",
  },
  balancer: {
    keyframes: `
      @keyframes anim-balancer {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
    `,
    animation: "anim-balancer 2.5s ease-in-out infinite",
  },
};

// レーダーチャートコンポーネント
function RadarChart({ scores, lang }: { scores: CheckScores; lang: "ja" | "en" }) {
  const traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"] as const;
  const labels = traits.map(t => lang === "ja" ? traitInfo[t].labelJa : traitInfo[t].labelEn);

  const centerX = 150;
  const centerY = 150;
  const maxRadius = 85;

  const getPoint = (index: number, value: number) => {
    const angle = (index * 72 - 90) * (Math.PI / 180);
    const radius = maxRadius * value;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPaths = gridLevels.map(level => {
    const points = traits.map((_, i) => getPoint(i, level));
    return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ") + " Z";
  });

  const dataPoints = traits.map((trait, i) => getPoint(i, scores[trait]));
  const dataPath = dataPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ") + " Z";

  const labelPoints = traits.map((_, i) => getPoint(i, 1.45));

  return (
    <div className="flex flex-col items-center mb-6">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {gridPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="rgba(129,140,248,0.25)"
            strokeWidth="1"
          />
        ))}

        {traits.map((_, i) => {
          const point = getPoint(i, 1);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke="rgba(129,140,248,0.25)"
              strokeWidth="1"
            />
          );
        })}

        {/* 今回データ */}
        <path
          d={dataPath}
          fill="rgba(167, 139, 250, 0.25)"
          stroke="#a78bfa"
          strokeWidth="2"
        />

        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#a78bfa"
          />
        ))}

        {labelPoints.map((point, i) => {
          const trait = traits[i];
          const info = traitInfo[trait];
          const isTop = i === 0;
          const isBottom = i === 2 || i === 3;
          const yOffset = isTop ? -8 : isBottom ? 8 : 0;

          return (
            <foreignObject
              key={i}
              x={point.x - 30}
              y={point.y - 20 + yOffset}
              width="60"
              height="40"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative w-5 h-5">
                  <img
                    src={info.icon}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <span
                  className="text-[10px] font-semibold leading-tight"
                  style={{ color: info.color }}
                >
                  {labels[i]}
                </span>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

interface ResultClientProps {
  typeFromUrl: string;
}

export default function ResultClient({ typeFromUrl }: ResultClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]"><div className="text-slate-400">Loading...</div></div>}>
      <ResultClientContent typeFromUrl={typeFromUrl} />
    </Suspense>
  );
}

function ResultClientContent({ typeFromUrl }: ResultClientProps) {
  const searchParams = useSearchParams();
  const [scores, setScores] = useState<CheckScores | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>("ja");
  const [devOverrideType, setDevOverrideType] = useState<PersonalityTypeId | null>(null);
  const [randomScenarioIndices, setRandomScenarioIndices] = useState<number[]>([]);
  const [randomRecommendationIndex, setRandomRecommendationIndex] = useState(0);
  const [shareText, setShareText] = useState<string | null>(null);
  const [isVisitor, setIsVisitor] = useState(false);

  // スクロールフェードイン用ref
  const adviceRef = useFadeIn();
  const scenarioRef = useFadeIn();
  const recommendRef = useFadeIn();
  const scoresRef = useFadeIn();

  const t = translations[lang];
  const isDevMode = searchParams.get("dev") === "1";

  // URLからタイプIDを取得（有効な場合のみ）
  const urlTypeId = validTypeIds.includes(typeFromUrl as PersonalityTypeId)
    ? (typeFromUrl as PersonalityTypeId)
    : null;

  useEffect(() => {
    const paramLang = searchParams.get("l");
    setLang(paramLang === "ja" ? "ja" : "en");

    // ランダム選択を初期化（シナリオ5個→3個、おすすめ3セット→1セット）
    const scenarioPool = [0, 1, 2, 3, 4];
    setRandomScenarioIndices(pickRandom(scenarioPool, 3));
    setRandomRecommendationIndex(Math.floor(Math.random() * 3));

    // スコアの読み込み: localStorage > デバッグスコア
    const resultsJson = localStorage.getItem("swipeResults");
    const imagesJson = localStorage.getItem("selectedImages");
    if (resultsJson && imagesJson) {
      const results: SwipeResult[] = JSON.parse(resultsJson);
      const images: ImageMeta[] = JSON.parse(imagesJson);
      setScores(calculateScores(results, images));
    } else if (urlTypeId) {
      setScores(debugScores);
    }

    // 訪問者判定（スワイプ結果がない = シェアリンクからの訪問者）
    if (!resultsJson) {
      setIsVisitor(true);
    }

    setLoading(false);
  }, [urlTypeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
        <div className="text-slate-400">{t.loading}</div>
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
        <h1 className="text-2xl font-bold mb-4 text-indigo-100">{t.noResults}</h1>
        <p className="text-slate-400 mb-8">{t.pleaseTest}</p>
        <Link
          href={`/?l=${lang}${isDevMode ? "&dev=1" : ""}`}
          className="px-6 py-3 bg-white/10 text-indigo-200 rounded-full hover:bg-white/20 transition-colors btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
        >
          {t.startTest}
        </Link>
      </div>
    );
  }

  // パーソナリティタイプを判定（devモードオーバーライド > URL指定 > スコアから判定）
  const typeId = devOverrideType || urlTypeId || determinePersonalityType(scores);
  const personalityType = personalityTypes[typeId];

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col items-center py-8 px-4 bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
      {/* 背景イラスト */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/images/bg/hero-top.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.10 }}
        />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up-bounce {
          0% { transform: translateY(50px); opacity: 0; }
          60% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes name-pop {
          0% { opacity: 0; transform: scale(0.55) translateY(14px); }
          55% { opacity: 1; transform: scale(1.18) translateY(0); }
          75% { transform: scale(0.97); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes name-glow {
          0%, 100% { text-shadow: 0 0 0 rgba(0,0,0,0); }
          50% { text-shadow: 0 0 38px var(--type-color); }
        }
        @keyframes char-glow {
          0% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
          35% { box-shadow: 0 0 64px 18px var(--type-color); }
          60% { box-shadow: 0 0 64px 18px var(--type-color); }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
        }
        @keyframes reveal-mote {
          0% { transform: translate(0, 24px) scale(0.2); opacity: 0; }
          30% { opacity: 0.8; }
          100% { transform: translate(var(--mx, 0), var(--my, -120px)) scale(1); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-mote { display: none !important; }
          .reveal-enter, .reveal-glow, .reveal-name { animation: none !important; }
        }
      `}} />

      {/* Dev Mode ドロップダウン */}
      {isDevMode && (
        <div className="fixed top-4 left-4 z-20">
          <select
            value={devOverrideType || typeId}
            onChange={(e) => setDevOverrideType(e.target.value as PersonalityTypeId)}
            className="px-3 py-1.5 text-sm bg-yellow-500/20 border-2 border-yellow-500/50 rounded-lg font-medium text-yellow-300 cursor-pointer hover:bg-yellow-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
          >
            <option value="" disabled>DEV</option>
            {validTypeIds.map((id) => (
              <option key={id} value={id}>
                {lang === "ja" ? personalityTypes[id].nameJa : personalityTypes[id].nameEn} ({id})
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={() => {
          const newLang = lang === "ja" ? "en" : "ja";
          setLang(newLang);
          const url = new URL(window.location.href);
          url.searchParams.set("l", newLang);
          window.history.replaceState({}, "", url.toString());
        }}
        className="fixed top-4 right-4 px-3 py-1 text-sm text-indigo-200 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-50 btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
      >
        {lang === "ja" ? "English" : "日本語"}
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <style dangerouslySetInnerHTML={{ __html: typeAnimations[typeId].keyframes }} />

          {/* キャラ登場演出（カラーオーラ・リビール） */}
          <div className="relative flex justify-center mb-2">
            {/* キャラ本体（タイプ色グロー付き） */}
            <div className="reveal-enter relative z-10" style={{ animation: "slide-up-bounce 0.6s ease-out" }}>
              <div
                className="reveal-glow relative w-72 h-72 rounded-2xl"
                style={{
                  ["--type-color" as string]: personalityType.color,
                  animation: `${typeAnimations[typeId].animation}, char-glow 1.6s ease-out 0.3s both`,
                }}
              >
                <img
                  src={personalityType.backgroundImage}
                  alt={lang === "ja" ? personalityType.nameJa : personalityType.nameEn}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            {/* カラーの粒（前面でキラッと舞う） */}
            {[
              { left: 26, bottom: 34, mx: -22, my: -90, size: 7, dur: 1.3, delay: 0.32 },
              { left: 72, bottom: 78, mx: 16, my: -74, size: 6, dur: 1.45, delay: 0.50 },
              { left: 46, bottom: 52, mx: -8, my: -98, size: 8, dur: 1.2, delay: 0.64 },
              { left: 86, bottom: 96, mx: 20, my: -66, size: 5, dur: 1.35, delay: 0.42 },
            ].map((m, i) => (
              <span
                key={i}
                aria-hidden
                className="reveal-mote pointer-events-none absolute z-20 rounded-full"
                style={{
                  left: `${m.left}%`,
                  bottom: m.bottom,
                  width: m.size,
                  height: m.size,
                  background: "#ffffff",
                  boxShadow: `0 0 9px 2px ${personalityType.color}`,
                  ["--mx" as string]: `${m.mx}px`,
                  ["--my" as string]: `${m.my}px`,
                  animation: `reveal-mote ${m.dur}s ease-out ${m.delay}s both`,
                }}
              />
            ))}
          </div>

          <div className="mb-4">
            <p className="text-base text-slate-400 mb-1">
              {lang === "ja" ? "今日のキミは" : "Today you're"}
            </p>
            <h1
              className="reveal-name text-[clamp(2.5rem,12vw,5rem)] font-bold leading-none"
              style={{
                color: personalityType.color,
                ["--type-color" as string]: personalityType.color,
                animation: "name-pop 0.6s ease-out 0.5s both, name-glow 1.1s ease-out 0.7s both",
              }}
            >
              {lang === "ja" ? personalityType.nameJa : personalityType.nameEn}
            </h1>

            {/* 案7: 今のキミメッセージ */}
            <p className="text-xs text-slate-400 mt-2">
              {lang === "ja"
                ? "これは\"今のキミ\"。気分が変われば、また変わる！"
                : "This is you right now. Mood shifts, type shifts — that's the fun part!"}
            </p>
          </div>

          <p className="text-base text-indigo-200 leading-relaxed px-2">
            {lang === "ja" ? personalityType.descriptionJa : personalityType.descriptionEn}
          </p>

          <div
            ref={adviceRef}
            className="fade-in-section mt-5 mx-2 p-5 bg-white/5 backdrop-blur-xl border border-indigo-400/10 rounded-2xl"
            style={{ borderLeft: `3px solid ${personalityType.color}` }}
          >
            <p className="text-base font-semibold text-indigo-300 mb-1">
              {lang === "ja" ? "こんな一面もある！" : "There's more to you!"}
            </p>
            <p className="text-base text-slate-400 leading-relaxed">
              {lang === "ja" ? personalityType.adviceJa : personalityType.adviceEn}
            </p>
          </div>

          {/* あるあるセクション */}
          <div
            ref={scenarioRef}
            className="fade-in-section mt-5 mx-2 p-5 bg-white/5 backdrop-blur-xl border border-indigo-400/10 rounded-2xl"
            style={{ borderLeft: `3px solid ${personalityType.color}` }}
          >
            <p className="text-base font-semibold text-indigo-300 mb-2">
              {lang === "ja" ? "こんなこと、ない？" : "Sound familiar?"}
            </p>
            <ul className="space-y-1.5">
              {randomScenarioIndices.map((idx) => {
                const scenario = lang === "ja"
                  ? personalityType.scenariosJa[idx]
                  : personalityType.scenariosEn[idx];
                return scenario ? (
                  <li key={idx} className="text-base text-slate-400 flex items-start gap-2">
                    <span className="text-slate-400 flex-shrink-0">▸</span>
                    <span>{scenario}</span>
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          {/* おすすめセクション */}
          {(() => {
            const rec = lang === "ja"
              ? personalityType.recommendationsJa[randomRecommendationIndex]
              : personalityType.recommendationsEn[randomRecommendationIndex];
            if (!rec) return null;
            return (
              <div
                ref={recommendRef}
                className="fade-in-section mt-5 mx-2 p-5 bg-white/5 backdrop-blur-xl border border-indigo-400/10 rounded-2xl"
                style={{ borderLeft: `3px solid ${personalityType.color}` }}
              >
                <p
                  className="text-base font-semibold mb-3"
                  style={{ color: personalityType.color }}
                >
                  {lang === "ja" ? "おすすめ" : "Pick"}
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-base">
                    <span className="flex-shrink-0">💡</span>
                    <span className="text-indigo-200">{rec.activity}</span>
                  </div>
                  <div className="flex items-start gap-2 text-base">
                    <span className="flex-shrink-0">🎵</span>
                    <span className="text-indigo-200">{rec.music}</span>
                  </div>
                  <div className="flex items-start gap-2 text-base">
                    <span className="flex-shrink-0">📖</span>
                    <span className="text-indigo-200">{rec.book} — <span className="text-slate-400">{rec.bookAuthor}</span></span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 案6: 訪問者にはCTA、通常ユーザーにはシェアボタン */}
          <div className="mt-6 flex justify-center">
            {isVisitor ? (
              <Link
                href={`/?friend=${typeId}&l=${lang}`}
                className="px-8 py-4 text-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full font-semibold hover:from-violet-400 hover:to-indigo-400 transition-all shadow-[0_4px_20px_rgba(129,140,248,0.4)] btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
              >
                {lang === "ja" ? "自分もやってみる！" : "Try it yourself!"}
              </Link>
            ) : (
              <button
                onClick={() => {
                  const currentName = lang === "ja" ? personalityType.nameJa : personalityType.nameEn;
                  const text = lang === "ja"
                    ? `今日のキミは「${currentName}」タイプ！\n\n#SwipeOcean #今日の気分`
                    : `I'm "${currentName}" today!\n\n#SwipeOcean #MoodCheck`;
                  const url = `https://swipeocean.surf/result/${typeId}`;
                  window.open(
                    `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                    "_blank",
                    "noopener,noreferrer,width=550,height=420"
                  );
                  setShareText(lang === "ja" ? "シェアした！" : "Shared!");
                  setTimeout(() => setShareText(null), 1000);
                }}
                className="flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full font-semibold hover:from-violet-400 hover:to-indigo-400 transition-all shadow-[0_4px_20px_rgba(129,140,248,0.4)] btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                {shareText || (lang === "ja" ? "結果をシェア" : "Share Result")}
              </button>
            )}
          </div>
        </div>

        {!isVisitor && <div ref={scoresRef} className="fade-in-section mb-8">
          <h2 className="text-2xl font-bold mb-4 text-violet-400">
            {t.scores}
          </h2>

          <RadarChart scores={scores} lang={lang} />

          <ScoreCard trait="openness" score={scores.openness} lang={lang} />
          <ScoreCard trait="conscientiousness" score={scores.conscientiousness} lang={lang} />
          <ScoreCard trait="extraversion" score={scores.extraversion} lang={lang} />
          <ScoreCard trait="agreeableness" score={scores.agreeableness} lang={lang} />
          <ScoreCard trait="neuroticism" score={scores.neuroticism} lang={lang} />
        </div>}

        <div className="flex justify-center mb-8">
          <Link
            href={`/?l=${lang}${isDevMode ? "&dev=1" : ""}`}
            className="px-10 py-4 text-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full hover:from-violet-400 hover:to-indigo-400 transition-all font-semibold shadow-[0_4px_20px_rgba(129,140,248,0.4)] btn-press focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#0a0a1f]"
          >
            {t.tryAgain}
          </Link>
        </div>

        <footer className="text-xs text-slate-500 text-center flex items-center justify-center gap-2">
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
    </div>
  );
}
