import { findBookAudio } from "./bookAudio.ts";

export type BookActivityKind =
  | "point"
  | "repeat"
  | "actions"
  | "chant"
  | "song"
  | "phonics"
  | "questions"
  | "story"
  | "respond"
  | "craft"
  | "game"
  | "reading";
export type BookActivity = {
  number: number;
  page: number;
  lesson: number;
  title: string;
  zh: string;
  kind: BookActivityKind;
  track: number | null;
  disc?: number;
  focus: string;
  instruction: string;
};
export const officialSampleUrl =
  "https://cdn-web.unischool.cn/kb/mfzy/yzyyp/KB2XS1_U1_yz.pdf";
export const officialSampleAudioUrl =
  "https://cdn-web.unischool.cn/kb/mfzy/yzyyp/KB2XS1_U1_yp.zip";

// Unit 1 checked against the publisher sample; all units checked against the
// user's 93-page Book 1 scan. Corresponding pages are bundled under book-pages.
export const verifiedBookActivities: Record<number, BookActivity[]> = {
  1: [
    {
      number: 1,
      page: 4,
      lesson: 1,
      title: "Listen and point.",
      zh: "听一听，指一指",
      kind: "point",
      track: 2,
      focus: "认识 Star 一家",
      instruction:
        "听原版录音，在下面的原书页面上指出听到的人物。可以直接在屏幕上点指。",
    },
    {
      number: 2,
      page: 4,
      lesson: 1,
      title: "Listen and repeat.",
      zh: "听一听，跟着说",
      kind: "repeat",
      track: 3,
      focus: "人物名字的听读",
      instruction:
        "先听完整录音，再暂停模仿人物的发音。点名时也可以指向书上的人物。",
    },
    {
      number: 3,
      page: 5,
      lesson: 1,
      title: "Listen and do the actions.",
      zh: "听指令，做动作",
      kind: "actions",
      track: 5,
      focus: "打招呼与自我介绍",
      instruction:
        "边听原版录音边做动作，和家人轮流扮演角色。这里不使用麦克风判断动作。",
    },
    {
      number: 4,
      page: 5,
      lesson: 1,
      title: "Say the chant.",
      zh: "跟着节拍说歌谣",
      kind: "chant",
      track: 6,
      focus: "数字与节奏",
      instruction:
        "先听一遍原版歌谣，再边拍手边跟读。保留原版节奏，不用普通朗读替代歌谣。",
    },
    {
      number: 5,
      page: 6,
      lesson: 2,
      title: "Listen and point.",
      zh: "听对话，找人物",
      kind: "point",
      track: 7,
      focus: "询问与表达年龄",
      instruction: "听原书的情景对话，指出正在说话的人物。再和家人交换角色。",
    },
    {
      number: 6,
      page: 6,
      lesson: 2,
      title: "Listen and repeat.",
      zh: "听数字，跟着读",
      kind: "repeat",
      track: 8,
      focus: "数字与年龄表达",
      instruction: "听清数字的开头和结尾，暂停后跟读，再连成一句完整的话。",
    },
    {
      number: 7,
      page: 7,
      lesson: 2,
      title: "Sing the song.",
      zh: "跟着原曲唱一唱",
      kind: "song",
      track: 10,
      focus: "颜色歌曲",
      instruction:
        "先欣赏原书歌曲，再指着颜色跟唱。可以打开循环，重复熟悉同一首歌。",
    },
    {
      number: 8,
      page: 7,
      lesson: 2,
      title: "Listen and say the colour.",
      zh: "听一听，说出颜色",
      kind: "respond",
      track: 12,
      focus: "颜色的听辨与表达",
      instruction:
        "按录音提示找颜色，暂停后说出颜色名称。也可以在身边找一件同色物品。",
    },
    {
      number: 9,
      page: 8,
      lesson: 3,
      title: "Monty’s phonics",
      zh: "Monty 的自然拼读",
      kind: "phonics",
      track: 14,
      focus: "听见 /s/ 的声音",
      instruction:
        "听原书录音中的 /s/，比较单词开头的声音。不要把字母名和字母在词里的发音混为一谈。",
    },
    {
      number: 10,
      page: 8,
      lesson: 3,
      title: "Ask the questions.",
      zh: "看情景，轮流问答",
      kind: "questions",
      track: null,
      focus: "名字与年龄的问答",
      instruction:
        "看课本中的人物信息，两人轮流提问和回答。也可以换成自己的真实信息。",
    },
    {
      number: 11,
      page: 9,
      lesson: 3,
      title: "Listen to the story.",
      zh: "看连环画，听故事",
      kind: "story",
      track: 17,
      focus: "玩具人物的连环故事",
      instruction:
        "按画面顺序听完整故事，再指着画面说说发生了什么。故事音频需要对应的教材录音。",
    },
    {
      number: 12,
      page: 9,
      lesson: 3,
      title: "Listen and say the number.",
      zh: "听故事，找画面编号",
      kind: "respond",
      track: 18,
      focus: "故事画面的听辨",
      instruction:
        "听片段，找到对应的故事画面，再说出编号。不需要背下整段故事。",
    },
  ],
};

export const unitStartPages = [4, 10, 18, 24, 34, 40, 48, 54, 64, 70, 78, 84];

// These describe how to practise; they are not transcripts of the recordings.
const activityTypes = {
  point: [
    "Listen and point.",
    "听一听，指一指",
    "point",
    "听原版录音，在原书页面中指出听到的人物或物品。",
  ],
  repeat: [
    "Listen and repeat.",
    "听一听，跟着说",
    "repeat",
    "先听清楚，再暂停模仿。注意词里的声音，最后连成完整表达。",
  ],
  actions: [
    "Listen and do the actions.",
    "听指令，做动作",
    "actions",
    "听原版录音，跟着指令做动作，再和家人交换角色。",
  ],
  chant: [
    "Say the chant.",
    "跟着节拍说歌谣",
    "chant",
    "听原版歌谣，边拍手边跟读，熟悉节奏后再独立说。",
  ],
  song: [
    "Sing the song.",
    "跟着原曲唱一唱",
    "song",
    "先听原书歌曲，再看图跟唱。打开循环，重复熟悉同一首歌。",
  ],
  phonics: [
    "Monty’s phonics",
    "Monty 的自然拼读",
    "phonics",
    "看这一页的拼读词，听原版发音，比较共同的声音，再跟着读。",
  ],
  questions: [
    "Ask and answer.",
    "看图，轮流问答",
    "questions",
    "按原书情景，两人轮流提问与回答，再交换角色。",
  ],
  story: [
    "Listen to the story.",
    "看连环画，听故事",
    "story",
    "按画面顺序听原版故事，暂停后指一指人物，说说发生了什么。",
  ],
  number: [
    "Listen and say the number.",
    "听一听，说出编号",
    "respond",
    "听录音片段，在原书画面中找出对应内容，说出编号。",
  ],
  correct: [
    "Listen and correct.",
    "听一听，改一改",
    "respond",
    "对照原书画面听录音，找出需要纠正的表达，再说出正确内容。",
  ],
  yesno: [
    "Listen and say ‘yes’ or ‘no’.",
    "听一听，判断对不对",
    "respond",
    "对照原书页面听录音，判断描述是否符合画面，回答 yes 或 no。",
  ],
  actstory: [
    "Act out the story.",
    "分角色演故事",
    "actions",
    "听过故事后分配角色，照着画面演一演，可以使用自己的动作。",
  ],
  answer: [
    "Listen and answer.",
    "听一听，回答问题",
    "respond",
    "看原书画面，听录音里的问题，暂停后回答，再继续听。",
  ],
  guess: [
    "Say and guess.",
    "描述线索，猜一猜",
    "questions",
    "按照原书示例描述画面内容，让家人猜，再交换角色。",
  ],
  chantactions: [
    "Say the chant. Do the actions.",
    "说歌谣，做动作",
    "chant",
    "跟原版歌谣的节奏说一说，配合书里的动作。",
  ],
  puppets: [
    "Make the puppets.",
    "动手制作手偶",
    "craft",
    "按照原书示例准备材料，由家长陪同制作手偶，再用它练习对话。",
  ],
  hide: [
    "Hide and play.",
    "藏一藏，玩一玩",
    "game",
    "按原书示例藏起物品，与家人轮流寻找并用英语表达。",
  ],
  words: [
    "Look, listen and say the words.",
    "看一看，听一听，说单词",
    "respond",
    "看原书中的人物或物品，听录音提示，再说出对应单词。",
  ],
  listenchant: [
    "Listen and chant.",
    "听一听，说歌谣",
    "chant",
    "先听原版节奏，再分句跟着说，最后连起来说一遍。",
  ],
  draw: [
    "Say and listen. Draw.",
    "说一说，听一听，画一画",
    "craft",
    "按原书示例轮流描述和倾听，在纸上画出听到的内容，再比较。",
  ],
  askguess: [
    "Play the game. Ask and guess.",
    "玩游戏，提问猜答案",
    "game",
    "按照原书示例提问，用回答中的线索猜出答案，再交换角色。",
  ],
  pointanswer: [
    "Listen and point. Answer.",
    "听一听，指一指，回答",
    "respond",
    "听原版录音，在图中指出对应内容，再回答录音里的问题。",
  ],
  actandsay: [
    "Act it out and say.",
    "演一演，说一说",
    "actions",
    "根据原书示例做动作，同时用英语表达，让家人也试一试。",
  ],
  askgame: [
    "Play the game. Ask and answer.",
    "玩游戏，轮流问答",
    "game",
    "按照原书的游戏示例，两人轮流提问与回答。",
  ],
  actiongame: [
    "Do the actions. Play the game.",
    "做动作，玩游戏",
    "game",
    "看原书示例，边做动作边玩游戏，再轮流发出指令。",
  ],
  readname: [
    "Read. Listen and say the name.",
    "读一读，听一听，说名字",
    "reading",
    "先阅读原书提示，再听原版录音，说出对应人物的名字。",
  ],
} satisfies Record<string, [string, string, BookActivityKind, string]>;

const unitSequences: Record<number, (keyof typeof activityTypes)[]> = {
  2: [
    "point",
    "repeat",
    "chant",
    "correct",
    "point",
    "repeat",
    "puppets",
    "song",
    "phonics",
    "questions",
    "story",
    "actstory",
  ],
  3: [
    "point",
    "repeat",
    "number",
    "chant",
    "actions",
    "repeat",
    "song",
    "questions",
    "phonics",
    "hide",
    "story",
    "yesno",
  ],
  4: [
    "point",
    "repeat",
    "number",
    "words",
    "point",
    "actions",
    "song",
    "listenchant",
    "phonics",
    "correct",
    "story",
    "number",
  ],
  5: [
    "point",
    "repeat",
    "chant",
    "number",
    "point",
    "repeat",
    "actions",
    "song",
    "phonics",
    "guess",
    "story",
    "actstory",
  ],
  6: [
    "point",
    "repeat",
    "chant",
    "correct",
    "point",
    "repeat",
    "song",
    "draw",
    "phonics",
    "askguess",
    "story",
    "yesno",
  ],
  7: [
    "point",
    "repeat",
    "chantactions",
    "pointanswer",
    "point",
    "repeat",
    "song",
    "actandsay",
    "phonics",
    "askgame",
    "story",
    "actstory",
  ],
  8: [
    "point",
    "repeat",
    "chant",
    "number",
    "point",
    "repeat",
    "correct",
    "song",
    "phonics",
    "questions",
    "story",
    "number",
  ],
  9: [
    "point",
    "repeat",
    "answer",
    "song",
    "point",
    "repeat",
    "chant",
    "answer",
    "phonics",
    "questions",
    "story",
    "actstory",
  ],
  10: [
    "point",
    "repeat",
    "chantactions",
    "answer",
    "point",
    "repeat",
    "song",
    "actiongame",
    "phonics",
    "correct",
    "story",
    "number",
  ],
  11: [
    "point",
    "repeat",
    "correct",
    "answer",
    "point",
    "repeat",
    "song",
    "questions",
    "phonics",
    "guess",
    "story",
    "yesno",
  ],
  12: [
    "point",
    "repeat",
    "chant",
    "yesno",
    "point",
    "repeat",
    "song",
    "questions",
    "phonics",
    "readname",
    "story",
    "actstory",
  ],
};
for (const [unit, sequence] of Object.entries(unitSequences)) {
  verifiedBookActivities[Number(unit)] = sequence.map((key, index) => {
    const [title, zh, kind, instruction] = activityTypes[key];
    return {
      number: index + 1,
      page: unitStartPages[Number(unit) - 1] + Math.floor(index / 2),
      lesson: Math.floor(index / 4) + 1,
      title,
      zh,
      kind,
      instruction,
      track: findBookAudio(unitStartPages[Number(unit) - 1] + Math.floor(index / 2), index + 1)?.track ?? null,
      disc: Math.ceil(Number(unit) / 3),
      focus: "对照原书页面练习",
    };
  });
}

export const additionalBookSections = [
  {
    title: "跨学科学习",
    en: "CLIL",
    description: "数学、艺术、科学、地理和运动。",
  },
  {
    title: "价值观活动",
    en: "Values",
    description: "交朋友、友善、照顾宠物、爱护自然、合作与清洁。",
  },
  {
    title: "阶段复习",
    en: "Review",
    description: "每四个单元一次，听、说、读、玩中复习。",
  },
  {
    title: "语法参考",
    en: "Grammar reference",
    description: "对照原书回顾全册句型。",
  },
];

export type BookSection = {
  id: string;
  group: string;
  title: string;
  zh: string;
  page: number;
  endPage: number;
  activities: string[];
};
export const bookSections: BookSection[] = [
  {
    id: "maths",
    group: "CLIL",
    title: "Marie’s maths · Adding",
    zh: "数学 · 加法",
    page: 16,
    endPage: 16,
    activities: ["Look and say the number.", "Listen, point and say."],
  },
  {
    id: "friends",
    group: "Values",
    title: "Make friends",
    zh: "交朋友",
    page: 17,
    endPage: 17,
    activities: [
      "Listen to the story.",
      "Listen and say the number. Act it out.",
    ],
  },
  {
    id: "colours",
    group: "CLIL",
    title: "Marie’s art · Mixing colours",
    zh: "艺术 · 混合颜色",
    page: 30,
    endPage: 30,
    activities: ["Listen and say.", "Look and guess. Do."],
  },
  {
    id: "kind",
    group: "Values",
    title: "Be kind",
    zh: "友善待人",
    page: 31,
    endPage: 31,
    activities: [
      "Listen to the story.",
      "Listen and say the number. Act it out.",
    ],
  },
  {
    id: "review1",
    group: "Review",
    title: "Review · Units 1–4",
    zh: "第一阶段复习",
    page: 32,
    endPage: 33,
    activities: [
      "Listen and say the number.",
      "Say and guess.",
      "Listen and colour. Make a spinner.",
      "Play the game.",
    ],
  },
  {
    id: "senses",
    group: "CLIL",
    title: "Marie’s science · The senses",
    zh: "科学 · 感官",
    page: 46,
    endPage: 46,
    activities: ["Listen and point.", "Point and say the sense."],
  },
  {
    id: "pets",
    group: "Values",
    title: "Look after pets",
    zh: "照顾宠物",
    page: 47,
    endPage: 47,
    activities: ["Listen and say the number.", "Do the actions. Guess."],
  },
  {
    id: "habitats",
    group: "CLIL",
    title: "Marie’s geography · Habitats",
    zh: "地理 · 栖息地",
    page: 60,
    endPage: 60,
    activities: ["Listen and point.", "Look and say."],
  },
  {
    id: "nature",
    group: "Values",
    title: "Love nature",
    zh: "爱护自然",
    page: 61,
    endPage: 61,
    activities: ["Listen to the story.", "Listen. Say ‘happy’ or ‘sad’."],
  },
  {
    id: "review2",
    group: "Review",
    title: "Review · Units 5–8",
    zh: "第二阶段复习",
    page: 62,
    endPage: 63,
    activities: [
      "Listen and say the number.",
      "Look, read and match.",
      "Play the game. Say the words.",
    ],
  },
  {
    id: "sports",
    group: "CLIL",
    title: "Marie’s sports · Things for sports",
    zh: "运动 · 运动用品",
    page: 76,
    endPage: 76,
    activities: ["Listen and say.", "Say and answer."],
  },
  {
    id: "teams",
    group: "Values",
    title: "Work in teams",
    zh: "团队合作",
    page: 77,
    endPage: 77,
    activities: [
      "Listen to the story.",
      "Listen and say the number. Act it out.",
    ],
  },
  {
    id: "fruit",
    group: "CLIL",
    title: "Marie’s art · Fruit in paintings",
    zh: "艺术 · 画中的水果",
    page: 90,
    endPage: 90,
    activities: ["Point and say the food.", "Listen and say the number."],
  },
  {
    id: "clean",
    group: "Values",
    title: "Keep clean",
    zh: "保持清洁",
    page: 91,
    endPage: 91,
    activities: ["Listen and point.", "Say the chant. Do the actions."],
  },
  {
    id: "review3",
    group: "Review",
    title: "Review · Units 9–12",
    zh: "第三阶段复习",
    page: 92,
    endPage: 93,
    activities: ["Listen and answer.", "Read.", "Play the game. Say."],
  },
  {
    id: "grammar",
    group: "Grammar reference",
    title: "Grammar reference",
    zh: "语法参考",
    page: 94,
    endPage: 95,
    activities: [],
  },
];
