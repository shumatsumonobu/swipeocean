import type { PersonalityType, PersonalityTypeId, CheckScores } from "@/types";

export const personalityTypes: Record<PersonalityTypeId, PersonalityType> = {
  explorer: {
    id: "explorer",
    nameJa: "探求者",
    nameEn: "Explorer",
    descriptionJa: "「これ何だろう？」が止まらない。気になったら、もう調べてる。誰も思いつかないアイデアで周りをワクワクさせるのが、キミ。その自由な発想、ほんと最強",
    descriptionEn: "\"What's this?\" — and you're already three tabs deep. Nobody comes up with ideas the way you do. That restless, free-spirited brain? Your secret weapon.",
    adviceJa: "アイデアが溢れて、動き出すのが遅れがち。大きい夢は小さな一歩に刻めば、一気に進む",
    adviceEn: "Ever have so many ideas you can't get started? Break those big dreams into tiny steps and they get way easier to pull off.",
    scenariosJa: [
      "カフェで隣の人が読んでる本のタイトルが気になって仕方ない",
      "Wikipediaを開いたら気づけば3時間経ってた",
      "「面白そう」だけで未知のジャンルの映画を観始める",
      "新しいアプリを見つけるとすぐダウンロードしちゃう",
      "旅行先では有名スポットより地元の人が行く場所が気になる",
    ],
    scenariosEn: [
      "You can't help peeking at the book title someone's reading at a café",
      "You opened Wikipedia and three hours just vanished",
      "You start watching a movie in a totally unknown genre just because it looked interesting",
      "You download new apps the moment you find them",
      "When traveling, you're more drawn to local spots than famous landmarks",
    ],
    recommendationsJa: [
      { activity: "行ったことない路地裏を散歩してみ", music: "Here Comes the Sun - The Beatles", book: "サピエンス全史", bookAuthor: "ユヴァル・ノア・ハラリ" },
      { activity: "普段読まないジャンルの本を1冊手に取ってみて", music: "群青 - YOASOBI", book: "舟を編む", bookAuthor: "三浦しをん" },
      { activity: "知らない料理のレシピに挑戦してみ", music: "Viva La Vida - Coldplay", book: "ファクトフルネス", bookAuthor: "ハンス・ロスリング" },
    ],
    recommendationsEn: [
      { activity: "Try exploring a back alley you've never walked through", music: "Here Comes the Sun - The Beatles", book: "Sapiens", bookAuthor: "Yuval Noah Harari" },
      { activity: "Pick up a book in a genre you've never tried", music: "Gunjou - YOASOBI", book: "The Great Passage", bookAuthor: "Shion Miura" },
      { activity: "Challenge yourself with a recipe from a cuisine you've never cooked", music: "Viva La Vida - Coldplay", book: "Factfulness", bookAuthor: "Hans Rosling" },
    ],
    image: "/images/characters/type_explorer.png",
    backgroundImage: "/images/characters/type_explorer_bg.png",
    color: "#3b82f6",
  },
  planner: {
    id: "planner",
    nameJa: "計画者",
    nameEn: "Planner",
    descriptionJa: "決めたら、ちゃんとやり遂げる。コツコツ積み上げて、夢を現実に変えていくタイプ。「あの人に任せれば安心」って、みんな思ってる。自分のペースを崩さないの、めっちゃ強い",
    descriptionEn: "Once you decide, it gets done. You stack up small steps until the dream is real. \"Just leave it to them\" — that's what everyone thinks. Sticking to your own pace? Seriously powerful.",
    adviceJa: "予定通りにいかないと、つい焦る。でも予想外のことが、新しい発見につながる",
    adviceEn: "Plans going sideways can throw you off, right? But those surprises sometimes lead to the best discoveries.",
    scenariosJa: [
      "旅行の計画を立ててる時間が一番楽しい",
      "ToDoリストにチェック入れる瞬間が快感",
      "冷蔵庫の中身をだいたい把握してる",
      "待ち合わせには必ず5分前に着く",
      "スマホのアプリはフォルダで整理してる",
    ],
    scenariosEn: [
      "Planning a trip is more fun than the trip itself",
      "Checking off a to-do list item is pure bliss",
      "You pretty much know everything in your fridge",
      "You always arrive 5 minutes early",
      "Your phone apps are neatly organized into folders",
    ],
    recommendationsJa: [
      { activity: "行きたい場所を1つ、予約しちゃお", music: "Canon in D - Pachelbel", book: "7つの習慣", bookAuthor: "スティーブン・コヴィー" },
      { activity: "いつもの作業を新しいツールで効率化してみ", music: "終わりなき旅 - Mr.Children", book: "博士の愛した数式", bookAuthor: "小川洋子" },
      { activity: "お気に入りのカフェで、やりたいことをノートに書き出してみ", music: "Four Seasons: Spring - Vivaldi", book: "時をかける少女", bookAuthor: "筒井康隆" },
    ],
    recommendationsEn: [
      { activity: "Book something you've been wanting to do", music: "Canon in D - Pachelbel", book: "The 7 Habits of Highly Effective People", bookAuthor: "Stephen Covey" },
      { activity: "Try a new tool to streamline your workflow", music: "Owarinaki Tabi - Mr.Children", book: "The Housekeeper and the Professor", bookAuthor: "Yoko Ogawa" },
      { activity: "Grab your favorite café seat and map out your goals in a notebook", music: "Four Seasons: Spring - Vivaldi", book: "The Girl Who Leapt Through Time", bookAuthor: "Yasutaka Tsutsui" },
    ],
    image: "/images/characters/type_planner.png",
    backgroundImage: "/images/characters/type_planner_bg.png",
    color: "#22c55e",
  },
  socialite: {
    id: "socialite",
    nameJa: "社交家",
    nameEn: "Socialite",
    descriptionJa: "キミが来た瞬間、空気が変わる。明るくて、なんか惹きつけられて、気づけばみんな笑ってる。人と人をつなぐの、キミの天才的なとこ",
    descriptionEn: "The second you walk in, the whole vibe shifts. You're bright, magnetic, and somehow everyone's laughing before they know it. Bringing people together? That's your genius.",
    adviceJa: "一人の時間が、ちょっと苦手。でも静かな時間が、自分や大切な人に気づくきっかけになる",
    adviceEn: "Not a fan of being alone? Quiet moments can actually show you a lot about yourself and the people who matter.",
    scenariosJa: [
      "友達の友達ともすぐ仲良くなれる",
      "「今から来ない？」に秒で「行く！」",
      "グループLINEの盛り上げ役はだいたい自分",
      "知らない人に話しかけるのに抵抗がない",
      "週末の予定が気づけば全部埋まってる",
    ],
    scenariosEn: [
      "You become friends with your friend's friends in no time",
      "\"Wanna come over now?\" \"On my way!\" — every time",
      "You're basically the hype person in every group chat",
      "Talking to strangers feels totally natural",
      "Your weekends are fully booked before you even realize it",
    ],
    recommendationsJa: [
      { activity: "久しぶりの友達にLINE送ってみて", music: "Happy - Pharrell Williams", book: "夢をかなえるゾウ", bookAuthor: "水野敬也" },
      { activity: "行きつけのお店で店員さんと話してみ", music: "恋 - 星野源", book: "カラフル", bookAuthor: "森絵都" },
      { activity: "新しいコミュニティやイベントに顔を出してみ", music: "Uptown Funk - Bruno Mars", book: "人を動かす", bookAuthor: "デール・カーネギー" },
    ],
    recommendationsEn: [
      { activity: "Send a message to a friend you haven't talked to in a while", music: "Happy - Pharrell Williams", book: "The Happiness Project", bookAuthor: "Gretchen Rubin" },
      { activity: "Chat with the staff at your favorite shop", music: "Koi - Gen Hoshino", book: "Colorful", bookAuthor: "Eto Mori" },
      { activity: "Check out a new community or event", music: "Uptown Funk - Bruno Mars", book: "How to Win Friends and Influence People", bookAuthor: "Dale Carnegie" },
    ],
    image: "/images/characters/type_socialite.png",
    backgroundImage: "/images/characters/type_socialite_bg.png",
    color: "#f97316",
  },
  harmonizer: {
    id: "harmonizer",
    nameJa: "協調者",
    nameEn: "Harmonizer",
    descriptionJa: "「一緒にいると、なんか落ち着く」。そう思われてること、きっと多い。相手の気持ちにスッと寄り添える優しさ、これがキミの才能。大切な人の、いちばんの味方になれる",
    descriptionEn: "\"I feel calm around you\" — people think that more than you know. You just get how others feel, and that kindness is a real gift. You're the one people lean on.",
    adviceJa: "相手を優先しすぎて、自分を後回しにしがち。たまには自分のわがまま、出していい",
    adviceEn: "Do you put everyone else first and bottle up your own feelings? Speaking your mind is its own kind of kindness too.",
    scenariosJa: [
      "友達の相談にのってたら終電逃した",
      "グループの空気が悪くなると真っ先に気づく",
      "「ありがとう」って言われると一日幸せ",
      "自分のことより相手の好みでお店を選びがち",
      "誰かが落ち込んでると気づいてすぐ声をかけちゃう",
    ],
    scenariosEn: [
      "You missed the last train because you were listening to a friend's problems",
      "You're the first to notice when the group vibe gets awkward",
      "A simple \"thank you\" makes your whole day",
      "You tend to pick restaurants based on others' preferences, not yours",
      "You notice when someone's feeling down and check on them right away",
    ],
    recommendationsJa: [
      { activity: "自分だけのためにちょっといいスイーツ買ってみて", music: "Imagine - John Lennon", book: "嫌われる勇気", bookAuthor: "岸見一郎" },
      { activity: "「今日は自分優先！」って決めて好きなことだけしてみ", music: "花束を君に - 宇多田ヒカル", book: "アルケミスト", bookAuthor: "パウロ・コエーリョ" },
      { activity: "感謝してる人にメッセージ送ってみて", music: "Lean on Me - Bill Withers", book: "窓際のトットちゃん", bookAuthor: "黒柳徹子" },
    ],
    recommendationsEn: [
      { activity: "Treat yourself to a fancy dessert just for you", music: "Imagine - John Lennon", book: "The Courage to Be Disliked", bookAuthor: "Ichiro Kishimi" },
      { activity: "Declare today a \"me first\" day and do only what you love", music: "Hanataba wo Kimi ni - Hikaru Utada", book: "The Alchemist", bookAuthor: "Paulo Coelho" },
      { activity: "Send a message to someone you're grateful for", music: "Lean on Me - Bill Withers", book: "Totto-chan", bookAuthor: "Tetsuko Kuroyanagi" },
    ],
    image: "/images/characters/type_harmonizer.png",
    backgroundImage: "/images/characters/type_harmonizer_bg.png",
    color: "#ec4899",
  },
  empath: {
    id: "empath",
    nameJa: "感受者",
    nameEn: "Empath",
    descriptionJa: "他の人が見落とす美しさも、小さな心の揺れも、ちゃんと拾える。キミのアンテナ、めっちゃ高性能。繊細だからこそ見える世界がある。その感性、誰にも真似できない",
    descriptionEn: "You catch the beauty others miss — and the tiny shifts in how people feel. Your antenna's just built different. Being sensitive lets you see a world no one else can. That's all you.",
    adviceJa: "感情の波にのまれて、つい考えすぎる。「今こう感じてるな」と一歩引けば、スッと落ち着く",
    adviceEn: "Do the emotional waves pull you into overthinking? Stepping back and going 'ok, this is how I feel right now' really helps you settle.",
    scenariosJa: [
      "映画のエンドロールで余韻に浸りたい派",
      "天気が曇りだとなんとなく気分も曇る",
      "人混みにいると知らないうちに疲れてる",
      "歌詞に共感して泣いたことがある",
      "季節の変わり目にすぐ気づく",
    ],
    scenariosEn: [
      "You're the type who stays for the end credits to soak in the mood",
      "Cloudy weather somehow makes your mood cloudy too",
      "Crowds drain you without you even noticing",
      "You've cried because song lyrics hit too close to home",
      "You're always the first to sense the seasons changing",
    ],
    recommendationsJa: [
      { activity: "お気に入りの音楽を聴きながらぼーっとする時間をつくってみて", music: "Clair de Lune - Debussy", book: "星の王子さま", bookAuthor: "サン=テグジュペリ" },
      { activity: "好きな香りのキャンドルやお香を焚いてみて", music: "Lemon - 米津玄師", book: "ノルウェイの森", bookAuthor: "村上春樹" },
      { activity: "自然の中をゆっくり散歩してみ", music: "Gymnopédie No.1 - Satie", book: "蜜蜂と遠雷", bookAuthor: "恩田陸" },
    ],
    recommendationsEn: [
      { activity: "Make time to zone out while listening to your favorite music", music: "Clair de Lune - Debussy", book: "The Little Prince", bookAuthor: "Antoine de Saint-Exupéry" },
      { activity: "Light a candle or incense with a scent you love", music: "Lemon - Kenshi Yonezu", book: "Norwegian Wood", bookAuthor: "Haruki Murakami" },
      { activity: "Take a slow walk in nature", music: "Gymnopédie No.1 - Satie", book: "Honeybees and Distant Thunder", bookAuthor: "Riku Onda" },
    ],
    image: "/images/characters/type_empath.png",
    backgroundImage: "/images/characters/type_empath_bg.png",
    color: "#a855f7",
  },
  adventurer: {
    id: "adventurer",
    nameJa: "冒険家",
    nameEn: "Adventurer",
    descriptionJa: "「やってみなきゃ、わからない！」が口癖。考えるより先に、もう動いてる。飛び込んでいくキミの背中は、周りに勇気をくれる。その勢い、見てて惚れる",
    descriptionEn: "\"You won't know till you try!\" is basically your motto. You're moving before you even finish thinking. Watching you dive in gives everyone else courage. That energy? Kind of addictive.",
    adviceJa: "新しいことに目移りして、続けるのが苦手。今やってることに新しさを見つければ、ぐっと続く",
    adviceEn: "Shiny new things pulling your focus, making it hard to stick with stuff? Find something fresh in what you're already doing and it gets easier.",
    scenariosJa: [
      "「とりあえずやってみよう」が口癖",
      "旅先でガイドブックに載ってない場所を探すのが好き",
      "同じ店に2回行くより新しい店を開拓したい",
      "「人生一度きり」が座右の銘",
      "友達に「行動力おばけ」と言われたことがある",
    ],
    scenariosEn: [
      "\"Let's just try it!\" is basically your catchphrase",
      "You love finding places not in the guidebook when traveling",
      "You'd rather discover a new restaurant than revisit an old one",
      "\"You only live once\" is your life motto",
      "Friends have called you a \"force of nature\"",
    ],
    recommendationsJa: [
      { activity: "いつもと違う道で帰ってみて", music: "Don't Stop Me Now - Queen", book: "INTO THE WILD", bookAuthor: "ジョン・クラカワー" },
      { activity: "気になってたアクティビティを予約してみ", music: "紅蓮華 - LiSA", book: "深夜特急", bookAuthor: "沢木耕太郎" },
      { activity: "食べたことない国の料理を食べに行ってみて", music: "Eye of the Tiger - Survivor", book: "星を継ぐもの", bookAuthor: "J.P.ホーガン" },
    ],
    recommendationsEn: [
      { activity: "Take a different route home today", music: "Don't Stop Me Now - Queen", book: "Into the Wild", bookAuthor: "Jon Krakauer" },
      { activity: "Book that activity you've been curious about", music: "Gurenge - LiSA", book: "On the Road", bookAuthor: "Jack Kerouac" },
      { activity: "Go eat cuisine from a country you've never tried", music: "Eye of the Tiger - Survivor", book: "Inherit the Stars", bookAuthor: "James P. Hogan" },
    ],
    image: "/images/characters/type_adventurer.png",
    backgroundImage: "/images/characters/type_adventurer_bg.png",
    color: "#f87171",
  },
  craftsman: {
    id: "craftsman",
    nameJa: "職人",
    nameEn: "Craftsman",
    descriptionJa: "「ここ、もうちょっとこだわりたい」が止まらない。細部まで一切妥協しないから、誰にも真似できないものが生まれる。その丁寧さ、見てる人はちゃんと見てる",
    descriptionEn: "\"Just a little more here\" — you can't help it. You refuse to cut corners, so you make things no one else can. And trust us, the right people notice that care.",
    adviceJa: "いつものやり方にこだわって、新しい方法に抵抗しがち。「ただの実験」と思えば、意外な発見がある",
    adviceEn: "Love your tried-and-true way and hesitant to switch it up? Treat a change as just an experiment and you might stumble on something cool.",
    scenariosJa: [
      "自分のデスク周りの配置にこだわりがある",
      "料理のレシピは分量をきっちり量る",
      "好きなことについて語り出すと止まらない",
      "道具にはお金をかけたい",
      "「ま、いっか」で済ませるのが苦手",
    ],
    scenariosEn: [
      "Your desk setup is arranged exactly the way you like it",
      "You measure recipe ingredients down to the gram",
      "Once you start talking about your passion, there's no stopping you",
      "You believe in investing in quality tools",
      "\"Good enough\" just doesn't sit right with you",
    ],
    recommendationsJa: [
      { activity: "気になってた道具や文房具を1つ新調してみ", music: "Bohemian Rhapsody - Queen", book: "道をひらく", bookAuthor: "松下幸之助" },
      { activity: "いつもの作業工程を見直して自分なりの改善をしてみ", music: "Summer - 久石譲", book: "羊と鋼の森", bookAuthor: "宮下奈都" },
      { activity: "お気に入りの作品をもう一度じっくり味わってみて", music: "Piano Man - Billy Joel", book: "プロフェッショナルの条件", bookAuthor: "P.F.ドラッカー" },
    ],
    recommendationsEn: [
      { activity: "Treat yourself to that tool or stationery you've been eyeing", music: "Bohemian Rhapsody - Queen", book: "Mastery", bookAuthor: "Robert Greene" },
      { activity: "Review your usual workflow and find your own improvements", music: "Summer - Joe Hisaishi", book: "The Forest of Wool and Steel", bookAuthor: "Natsu Miyashita" },
      { activity: "Revisit a favorite work and savor it all over again", music: "Piano Man - Billy Joel", book: "The Essential Drucker", bookAuthor: "Peter Drucker" },
    ],
    image: "/images/characters/type_craftsman.png",
    backgroundImage: "/images/characters/type_craftsman_bg.png",
    color: "#facc15",
  },
  balancer: {
    id: "balancer",
    nameJa: "バランサー",
    nameEn: "Balancer",
    descriptionJa: "どんな状況でも「まぁなんとかなる」。その肩の力の抜け方が、才能。いろんな角度から見れるから、もめてる時の最後の砦はだいたいキミ。そのバランス感覚、マジで頼られてる",
    descriptionEn: "No matter what's going on, \"eh, it'll work out.\" That easygoing nature is a gift. You see every angle, so when things get tense, you're usually the one holding it together. People rely on you more than they say.",
    adviceJa: "いろんな角度から考えすぎて、決断に迷いがち。「今いちばんしっくりくる方」を選べば、スッと動ける",
    adviceEn: "Weighing too many angles and stuck on a decision? Just go with what feels right, right now, and you'll move forward way easier.",
    scenariosJa: [
      "「何食べたい？」「なんでもいいよ」が本心",
      "揉め事があると自然と仲裁役になる",
      "いろんなジャンルの友達がいる",
      "どっちの意見もわかるから板挟みになりがち",
      "「安定してるね」とよく言われる",
    ],
    scenariosEn: [
      "\"What do you want to eat?\" \"Anything's fine\" — and you genuinely mean it",
      "You naturally become the mediator when there's conflict",
      "You have friends from all kinds of different circles",
      "You see both sides so well that you get stuck in the middle",
      "People often tell you \"you're so stable\"",
    ],
    recommendationsJa: [
      { activity: "気になってたけど手を出してなかったことを1つ試してみ", music: "What a Wonderful World - Louis Armstrong", book: "夜は短し歩けよ乙女", bookAuthor: "森見登美彦" },
      { activity: "いつもと違うジャンルの音楽や映画に触れてみて", music: "SUN - 星野源", book: "モモ", bookAuthor: "ミヒャエル・エンデ" },
      { activity: "今日は「直感」で全部決めてみて", music: "Three Little Birds - Bob Marley", book: "君たちはどう生きるか", bookAuthor: "吉野源三郎" },
    ],
    recommendationsEn: [
      { activity: "Try one thing you've been curious about but never started", music: "What a Wonderful World - Louis Armstrong", book: "The Night Is Short, Walk On Girl", bookAuthor: "Tomihiko Morimi" },
      { activity: "Explore a genre of music or movies you've never tried", music: "SUN - Gen Hoshino", book: "Momo", bookAuthor: "Michael Ende" },
      { activity: "Make every decision by gut feeling today", music: "Three Little Birds - Bob Marley", book: "How Do You Live?", bookAuthor: "Genzaburo Yoshino" },
    ],
    image: "/images/characters/type_balancer.png",
    backgroundImage: "/images/characters/type_balancer_bg.png",
    color: "#06b6d4",
  },
};

// スコアからパーソナリティタイプを判定する関数
export function determinePersonalityType(scores: CheckScores): PersonalityTypeId {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;

  // 各特性の閾値（0.6以上を「高い」とみなす）
  const HIGH = 0.6;
  const LOW = 0.4;

  // 複合タイプを先にチェック（単一条件より優先）
  // 冒険家: 開放性と外向性が高い
  if (openness >= HIGH && extraversion >= HIGH) {
    return "adventurer";
  }

  // 職人: 誠実性が高く、開放性が低い
  if (conscientiousness >= HIGH && openness <= LOW) {
    return "craftsman";
  }

  // 単一特性タイプ
  // 探求者: 開放性が高い
  if (openness >= HIGH) {
    return "explorer";
  }

  // 計画者: 誠実性が高い
  if (conscientiousness >= HIGH) {
    return "planner";
  }

  // 社交家: 外向性が高い
  if (extraversion >= HIGH) {
    return "socialite";
  }

  // 協調者: 協調性が高い
  if (agreeableness >= HIGH) {
    return "harmonizer";
  }

  // 感受者: 繊細性が高い
  if (neuroticism >= HIGH) {
    return "empath";
  }

  // どの特性も HIGH に達しない場合、最も高い特性のタイプにフォールバック
  const traitScores: [number, PersonalityTypeId][] = [
    [openness, "explorer"],
    [conscientiousness, "planner"],
    [extraversion, "socialite"],
    [agreeableness, "harmonizer"],
    [neuroticism, "empath"],
  ];

  // 最高スコアの特性を見つける（同点なら先に定義されているものを優先）
  let maxScore = -1;
  let maxType: PersonalityTypeId = "balancer";
  for (const [score, type] of traitScores) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
    }
  }

  // 全特性が完全に同じスコア（=0.5）の場合のみバランサー
  const allSame = traitScores.every(([score]) => score === traitScores[0][0]);
  if (allSame) {
    return "balancer";
  }

  return maxType;
}
