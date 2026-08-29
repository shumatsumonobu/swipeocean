import { Metadata } from "next";
import HomeClient from "./HomeClient";

type Props = {
  searchParams: Promise<{ l?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { l } = await searchParams;
  const lang = l === "en" ? "en" : "ja";

  const title = lang === "en"
    ? "Swipe Ocean - What color are you today?"
    : "Swipe Ocean - 今日のキミ、どんな色？";
  const description = lang === "en"
    ? "Swipe images to discover your current vibe. Based on the Big Five (OCEAN) model — every type is a good one!"
    : "画像をスワイプして今の気分をチェック！Big Five（OCEAN）ベースのパーソナリティチェック。どのタイプもキミのいいところ！";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Swipe Ocean",
      images: [
        {
          url: `/images/ogp/top-${lang}.png`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/images/ogp/top-${lang}.png`],
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
