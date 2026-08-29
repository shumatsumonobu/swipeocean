import type { MetadataRoute } from "next";

const BASE_URL = "https://swipeocean.surf";

const PERSONALITY_TYPES = [
  "explorer", "planner", "socialite", "harmonizer",
  "empath", "adventurer", "craftsman", "balancer",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const resultPages = PERSONALITY_TYPES.map((type) => ({
    url: `${BASE_URL}/result/${type}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/swipe`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...resultPages,
  ];
}
