export const traitInfo = {
  openness: {
    labelJa: "開放性",
    labelEn: "Openness",
    descJa: "新しいもの・未知のことにワクワクする度合い。好奇心と想像力",
    descEn: "How much your curiosity lights up! Your score for imagination and trying new things",
    gradientClass: "from-purple-400 to-purple-600",
    color: "#a855f7",
    icon: "/images/traits/trait_openness.png",
  },
  conscientiousness: {
    labelJa: "誠実性",
    labelEn: "Conscientiousness",
    descJa: "決めたらやり切る。計画して、コツコツ続ける力",
    descEn: "Your \"I'll see it through\" power. Planning, focus, and follow-through",
    gradientClass: "from-green-400 to-green-600",
    color: "#22c55e",
    icon: "/images/traits/trait_conscientiousness.png",
  },
  extraversion: {
    labelJa: "外向性",
    labelEn: "Extraversion",
    descJa: "人といると元気が出るか、削られるか。にぎやか好きなほど高い",
    descEn: "Do people charge your batteries? The more social and active, the higher this goes",
    gradientClass: "from-orange-400 to-orange-600",
    color: "#f97316",
    icon: "/images/traits/trait_extraversion.png",
  },
  agreeableness: {
    labelJa: "協調性",
    labelEn: "Agreeableness",
    descJa: "相手に寄り添う優しさ。思いやりと「みんなで」を大事にする度合い",
    descEn: "How well you tune into others' feelings. Empathy and teamwork vibes",
    gradientClass: "from-pink-400 to-pink-600",
    color: "#ec4899",
    icon: "/images/traits/trait_agreeableness.png",
  },
  neuroticism: {
    labelJa: "繊細性",
    labelEn: "Sensitivity",
    descJa: "感じる力の強さ。小さな変化や気持ちの揺れにすぐ気づく",
    descEn: "How strongly you feel things. The more you pick up on subtle vibes, the higher this is",
    gradientClass: "from-blue-400 to-blue-600",
    color: "#3b82f6",
    icon: "/images/traits/trait_neuroticism.png",
  },
} as const;

export type TraitKey = keyof typeof traitInfo;
export const traitKeys = Object.keys(traitInfo) as TraitKey[];
