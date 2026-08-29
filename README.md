# Swipe Ocean

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Cloudflare Workers](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)

![Swipe Ocean](./public/images/ogp/top-en.png)

There's an ocean where 8 colors live. All different. None better than the rest.

Just swipe -- left for "not me today," right for "that's so me." In about 10 seconds, the ocean reads your vibe and tells you which color you are right now.

Different mood, different color. That's not a bug -- that's the point. You're not one thing. You never were.

![Swipe Ocean demo](./public/demo-en-small.gif)

**[Dive in](https://swipeocean.surf)** -- 10 seconds, that's it. | [See how it works](https://swipeocean.surf/about?l=en)

---

## Meet the Crew

<table>
<tr>
<td align="center" width="12%"><img src="./public/images/characters/type_explorer.png" width="80" /><br /><b>Explorer</b><br /><sub>Curious. Restless.<br />Always chasing the next thing.</sub></td>
<td align="center" width="12%"><img src="./public/images/characters/type_planner.png" width="80" /><br /><b>Planner</b><br /><sub>Strategic. Reliable.<br />Has a spreadsheet for everything.</sub></td>
<td align="center" width="12%"><img src="./public/images/characters/type_socialite.png" width="80" /><br /><b>Socialite</b><br /><sub>Energetic. Warm.<br />The life of every room.</sub></td>
<td align="center" width="12%"><img src="./public/images/characters/type_harmonizer.png" width="80" /><br /><b>Harmonizer</b><br /><sub>Caring. Steady.<br />The one everyone counts on.</sub></td>
</tr>
<tr>
<td align="center"><img src="./public/images/characters/type_empath.png" width="80" /><br /><b>Empath</b><br /><sub>Sensitive. Deep.<br />Feels everything -- and that's a superpower.</sub></td>
<td align="center"><img src="./public/images/characters/type_adventurer.png" width="80" /><br /><b>Adventurer</b><br /><sub>Bold. Free.<br />Jumps first, thinks later.</sub></td>
<td align="center"><img src="./public/images/characters/type_craftsman.png" width="80" /><br /><b>Craftsman</b><br /><sub>Focused. Skilled.<br />Obsessed with getting it right.</sub></td>
<td align="center"><img src="./public/images/characters/type_balancer.png" width="80" /><br /><b>Balancer</b><br /><sub>Adaptable. Calm.<br />Finds the sweet spot in everything.</sub></td>
</tr>
</table>

*Which one are you today? **[There's only one way to find out.](https://swipeocean.surf)***

Here's what a result looks like:

<img src="./public/screenshots/result-en.png" width="320" />

---

## Why I Built This

Personality tests always felt like exams to me. 50 questions, clinical labels, "you scored low on agreeableness." It felt like being graded, not understood.

I wanted something different. Something that says "hey, here's who you are today -- and that's great." No ranking. No good or bad scores. Just a color that's yours right now.

Every type has its strengths. Every color is a good one.

---

## The Science Behind It

Swipe Ocean is built on the **Big Five (OCEAN) model** -- the most widely validated personality framework in psychology. Five traits, decades of peer-reviewed research, used across cultures worldwide.

| Trait | What it means |
|-------|---------------|
| **O**penness | Curiosity, imagination, openness to new experiences |
| **C**onscientiousness | Organization, discipline, goal-oriented behavior |
| **E**xtraversion | Energy from social interaction, assertiveness |
| **A**greeableness | Cooperation, empathy, trust in others |
| **N**euroticism (Sensitivity) | Emotional responsiveness, depth of feeling |

Unlike pop-psychology quizzes (looking at you, "Which bread are you?"), the Big Five has real scientific backing. Swipe Ocean uses this as the foundation, then wraps it in a visual, swipe-based interface that actually feels fun.

Your swipe choices map to these 5 traits. The combination determines which of the 8 types fits you best right now -- not forever, just today.

Scoring logic is fully transparent and open source: [`src/data/personalityTypes.ts`](src/data/personalityTypes.ts)

---

## How It Works

<table>
<tr>
<td align="center" width="50%"><img src="./public/images/swipe-hints/swipe-left.png" width="120" /><br /><b>← Swipe Left</b><br /><sub>"Not me today"</sub></td>
<td align="center" width="50%"><img src="./public/images/swipe-hints/swipe-right.png" width="120" /><br /><b>Swipe Right →</b><br /><sub>"That's me!"</sub></td>
</tr>
</table>

1. **Swipe** -- flip through a deck of images
2. **Score** -- your choices map to 5 Big Five traits (all client-side)
3. **Match** -- trait combination → one of 8 types

Plus: radar chart of your 5 traits, OGP cards for social sharing, full bilingual support (EN/JA).

## Tech Stack

Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS 3, deployed on Cloudflare Workers via @opennextjs/cloudflare.

## Contributing

Want to fix a translation, improve type descriptions, or report a bug? See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)

---

## Japanese / 日本語

8つの色が暮らす海。どの色もちがって、どれもいい。

スワイプするだけ。海がキミの「今」を読みとって、約10秒で今日の色を教えてくれる。

気分が変われば、また違う色。それでいい。キミはひとつじゃない。

ベースは Big Five（OCEAN）-- 心理学でいちばん検証されてるやつ。でも堅くない。スワイプするだけ、遊び感覚。

- レーダーチャートで5特性のバランスを可視化
- OGP画像付きでSNSシェア

**[やってみる](https://swipeocean.surf?l=ja)** -- 約10秒。 | [くわしく見る](https://swipeocean.surf/about?l=ja)

---

Built by [@shumatsumonobu](https://x.com/shumatsumonobu)
