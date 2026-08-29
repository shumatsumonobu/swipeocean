import { Metadata } from "next";
import ResultClient from "./ResultClient";

const typeData: Record<string, { nameJa: string; nameEn: string; descJa: string }> = {
  explorer: {
    nameJa: "探求者",
    nameEn: "Explorer",
    descJa: "好奇心が止まらない。誰も思いつかないアイデアで周りをワクワクさせる",
  },
  planner: {
    nameJa: "計画者",
    nameEn: "Planner",
    descJa: "決めたらやり遂げる。コツコツ積み上げて、夢を現実に変えていく",
  },
  socialite: {
    nameJa: "社交家",
    nameEn: "Socialite",
    descJa: "いるだけで場が明るくなる。人と人をつなぐ天才",
  },
  harmonizer: {
    nameJa: "協調者",
    nameEn: "Harmonizer",
    descJa: "一緒にいると落ち着く。相手に寄り添う優しさが、キミの才能",
  },
  empath: {
    nameJa: "感受者",
    nameEn: "Empath",
    descJa: "小さな変化まで感じ取る高性能アンテナ。誰にも真似できない感性",
  },
  adventurer: {
    nameJa: "冒険家",
    nameEn: "Adventurer",
    descJa: "やってみなきゃわからない！その行動力が、周りに勇気をくれる",
  },
  craftsman: {
    nameJa: "職人",
    nameEn: "Craftsman",
    descJa: "細部まで一切妥協しない。誰にも真似できないものを生み出す",
  },
  balancer: {
    nameJa: "バランサー",
    nameEn: "Balancer",
    descJa: "どんな状況でも「まぁなんとかなる」。みんなの間をつなぐ架け橋",
  },
};

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ l?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { type } = await params;
  const { l } = await searchParams;
  const lang = l === "en" ? "en" : "ja";
  const data = typeData[type] || typeData.balancer;

  const title = lang === "en"
    ? `I'm ${data.nameEn} today! - Swipe Ocean`
    : `今日は${data.nameJa} - Swipe Ocean`;
  const description = lang === "en"
    ? `Swipe images to discover your current vibe. Based on the Big Five (OCEAN) model.`
    : data.descJa;
  const ogTitle = lang === "en"
    ? `I'm ${data.nameEn} today! - Swipe Ocean`
    : `今日の私は「${data.nameJa}」タイプ！ - Swipe Ocean`;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      type: "website",
      siteName: "Swipe Ocean",
      images: [
        {
          url: `/images/ogp/${type}-${lang}.png`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [`/images/ogp/${type}-${lang}.png`],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(typeData).map((type) => ({ type }));
}

export default async function ResultTypePage({ params }: Props) {
  const { type } = await params;
  return <ResultClient typeFromUrl={type} />;
}
