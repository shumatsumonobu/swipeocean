// 8タイプカード用アニメーション設定（page.tsx, AboutClient.tsx で共有）
export const typeAnimationName: Record<string, string> = {
  explorer: "bounce 2s ease-in-out",
  planner: "nod 2.5s ease-in-out",
  socialite: "jump 1.5s ease-in-out",
  harmonizer: "float 3s ease-in-out",
  empath: "pulse 2.5s ease-in-out",
  adventurer: "shake 2s ease-in-out",
  craftsman: "focus 3s ease-in-out",
  balancer: "sway 2.5s ease-in-out",
};

// キャラクター表示用のアニメーション遅延（8体分）
export const characterAnimations = [
  { delay: "0s" },
  { delay: "0.15s" },
  { delay: "0.3s" },
  { delay: "0.45s" },
  { delay: "0.6s" },
  { delay: "0.75s" },
  { delay: "0.9s" },
  { delay: "1.05s" },
];
