import { Suspense } from "react";
import type { Metadata } from "next";
import AboutClient from "./AboutClient";

type Props = { searchParams: Promise<{ l?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const lang = params.l === "ja" ? "ja" : "en";
  const isJa = lang === "ja";

  return {
    title: "About — Swipe Ocean",
    description: isJa
      ? "画像をスワイプして、今日の自分を知ろう。Big Five（OCEAN）ベースの1分パーソナリティチェック"
      : "Swipe images, discover your personality. A 1-minute personality check based on Big Five (OCEAN).",
    openGraph: {
      title: "About — Swipe Ocean",
      description: isJa
        ? "画像をスワイプして、今日の自分を知ろう"
        : "Swipe images, discover your personality.",
      type: "website",
      siteName: "Swipe Ocean",
      images: [
        {
          url: `/images/ogp/about-${lang}.png`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About — Swipe Ocean",
      description: isJa
        ? "画像をスワイプして、今日の自分を知ろう"
        : "Swipe images, discover your personality.",
    },
  };
}

export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
          <div className="text-slate-400">Loading...</div>
        </div>
      }
    >
      <AboutClient />
    </Suspense>
  );
}
