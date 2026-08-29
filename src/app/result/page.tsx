"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SwipeResult, ImageMeta, CheckScores } from "@/types";
import { determinePersonalityType } from "@/data/personalityTypes";

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
    if (!image) {
      console.error(`Image not found for id: ${result.imageId}`);
      return;
    }

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

export default function ResultRedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]"><div className="text-slate-400">Loading...</div></div>}>
      <ResultRedirectContent />
    </Suspense>
  );
}

function ResultRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get("dev") === "1";
  const langParam = searchParams.get("l") === "ja" ? "ja" : "en";
  const queryBase = `?l=${langParam}${isDevMode ? "&dev=1" : ""}`;

  useEffect(() => {
    // ローカルストレージから結果を取得
    const resultsJson = localStorage.getItem("swipeResults");
    const imagesJson = localStorage.getItem("selectedImages");

    if (resultsJson && imagesJson) {
      try {
      const results: SwipeResult[] = JSON.parse(resultsJson);
      const images: ImageMeta[] = JSON.parse(imagesJson);

      // localStorage データの基本検証
      if (!Array.isArray(results) || !Array.isArray(images) || results.length === 0 || images.length === 0) {
        console.error("Invalid swipe data in localStorage");
        router.replace(`/${queryBase}`);
        return;
      }

      // スコアを計算してタイプを判定
      const scores = calculateScores(results, images);
      const typeId = determinePersonalityType(scores);

      // タイプ別ページにリダイレクト
      router.replace(`/result/${typeId}${queryBase}`);
      } catch (e) {
        console.error("Failed to parse swipe data:", e);
        router.replace(`/${queryBase}`);
      }
    } else {
      // 結果がない場合はトップページへ
      router.replace(`/${queryBase}`);
    }
  }, [router, queryBase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1f] via-[#16103a] to-[#1e1650]">
      <div className="text-slate-400">Loading...</div>
    </div>
  );
}
