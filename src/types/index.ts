// Big Five特性の型定義
export type Trait =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";

// 特性の方向（高い/低い）
export type Direction = "high" | "low";

// 画像メタ情報
export interface ImageMeta {
  id: string;
  src: string;
  trait: Trait;
  direction: Direction;
}

// スワイプ選択
export type Choice = "me" | "not_me";

// スワイプ結果
export interface SwipeResult {
  imageId: string;
  choice: Choice;
}

// チェックスコア
export interface CheckScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

// パーソナリティタイプ
export type PersonalityTypeId =
  | "explorer"    // 探求者
  | "planner"     // 計画者
  | "socialite"   // 社交家
  | "harmonizer"  // 協調者
  | "empath"      // 感受者
  | "adventurer"  // 冒険家
  | "craftsman"   // 職人
  | "balancer";   // バランサー

export interface PersonalityType {
  id: PersonalityTypeId;
  nameJa: string;
  nameEn: string;
  descriptionJa: string;
  descriptionEn: string;
  adviceJa: string; // ウィークポイントと対策
  adviceEn: string;
  scenariosJa: string[]; // 「あるある」シチュエーション（5個、3つランダム表示）
  scenariosEn: string[];
  recommendationsJa: { activity: string; music: string; book: string; bookAuthor: string }[];
  recommendationsEn: { activity: string; music: string; book: string; bookAuthor: string }[];
  image: string;
  backgroundImage: string;
  color: string; // タイプ名の色
}
