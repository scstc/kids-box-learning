export type BookActivityKind =
  | "point"
  | "repeat"
  | "actions"
  | "chant"
  | "song"
  | "phonics"
  | "questions"
  | "story"
  | "respond";
export type BookActivity = {
  number: number;
  page: number;
  lesson: number;
  title: string;
  zh: string;
  kind: BookActivityKind;
  track: number | null;
  focus: string;
  instruction: string;
};
export const officialSampleUrl =
  "https://cdn-web.unischool.cn/kb/mfzy/yzyyp/KB2XS1_U1_yz.pdf";
export const officialSampleAudioUrl =
  "https://cdn-web.unischool.cn/kb/mfzy/yzyyp/KB2XS1_U1_yp.zip";

// Only Unit 1 has been checked against the Chinese publisher's public sample.
// Other units must be transcribed from the matching book rather than copying this pattern.
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
        "打开课本这一页，听原版录音，指出听到的人物。添加教材页面照片后，也可以在屏幕上点指。",
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
        "按画面顺序听完整故事，再指着画面说说发生了什么。故事原图和录音需要对应的教材资源。",
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

export const additionalBookSections = [
  {
    title: "跨学科学习",
    en: "CLIL",
    description: "结合学科知识理解和使用英语。",
  },
  {
    title: "价值观活动",
    en: "Values",
    description: "在生活情境中讨论习惯、合作和关爱。",
  },
  {
    title: "阶段复习",
    en: "Review",
    description: "整合几个单元的语言与技能。",
  },
  {
    title: "语法参考",
    en: "Grammar reference",
    description: "回顾句型的形式和使用情境。",
  },
];
