import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  themeColor: "#0a0a1f",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://swipeocean.surf"),
  verification: {
    google: "jEPHAXc5G8eO25n0Zm6X_mUqa7aKn24zaT9n1wb1wGs",
  },
  title: "Swipe Ocean - Personality Check",
  description: "Swipe images to discover your current vibe. Based on the Big Five (OCEAN) model — every type is a good one!",
  openGraph: {
    title: "Swipe Ocean - Personality Check",
    description: "Swipe images to discover your current vibe. Based on the Big Five (OCEAN) model — every type is a good one!",
    type: "website",
    siteName: "Swipe Ocean",
    images: [
      {
        url: "/images/ogp/top-ja.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swipe Ocean - Personality Check",
    description: "Swipe images to discover your current vibe. Based on the Big Five (OCEAN) model — every type is a good one!",
    images: ["/images/ogp/top-ja.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={zenMaruGothic.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Swipe Ocean",
              url: "https://swipeocean.surf",
              description:
                "画像をスワイプして今の自分をチェック。Big Five（OCEAN）モデルベースのパーソナリティチェックアプリ",
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "JPY",
              },
            }),
          }}
        />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e1edce5db0524f14a20669e5aadb0b79"}'
        />
      </body>
    </html>
  );
}
