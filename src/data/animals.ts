export type AnimalId =
  | "giraffe"
  | "elephant"
  | "snake"
  | "hippo"
  | "crocodile"
  | "monkey"
  | "tiger";
export type SoundPart = { text: string; ipa: string; tip: string };
export type Animal = {
  id: AnimalId;
  name: string;
  chinese: string;
  ipa: string;
  color: string;
  background: string;
  greeting: string;
  fact: string;
  parts: SoundPart[];
  rule: string;
  ruleLabel: string;
};

export const animals: Animal[] = [
  {
    id: "giraffe",
    name: "giraffe",
    chinese: "长颈鹿",
    ipa: "/dʒəˈræf/",
    color: "#b17725",
    background: "#fff3d6",
    greeting: "Hello, little explorer!",
    fact: "脖子长长的，够得到树上的嫩叶。",
    parts: [
      {
        text: "gi",
        ipa: "/dʒə/",
        tip: "开头轻轻读。这里的 g 发 /dʒ/，不是 /ɡ/。",
      },
      {
        text: "raffe",
        ipa: "/ræf/",
        tip: "重音在这里！a 发 /æ/；ff 只发一个 /f/，末尾 e 不发音。",
      },
    ],
    ruleLabel: "发现特别的 g",
    rule: "giraffe 是需要特别记忆的单词：g 发 /dʒ/，重音落在第二个音节。先听声音，再连起来读。",
  },
  {
    id: "elephant",
    name: "elephant",
    chinese: "大象",
    ipa: "/ˈel.ɪ.fənt/",
    color: "#7376a6",
    background: "#efedf9",
    greeting: "A big hello to you!",
    fact: "长鼻子能喝水，也能和朋友打招呼。",
    parts: [
      { text: "el", ipa: "/el/", tip: "第一个音节读得重一点，e 发短音 /e/。" },
      { text: "e", ipa: "/ɪ/", tip: "中间这个 e 轻轻地读 /ɪ/。" },
      {
        text: "phant",
        ipa: "/fənt/",
        tip: "ph 是一对声音搭档，一起发 /f/。这里 a 弱读为 /ə/。",
      },
    ],
    ruleLabel: "ph 是声音搭档",
    rule: "两个字母也能合成一个声音：ph 一起发 /f/。elephant 有 3 个音节，第一个最有力。",
  },
  {
    id: "snake",
    name: "snake",
    chinese: "蛇",
    ipa: "/sneɪk/",
    color: "#54866b",
    background: "#eaf2dc",
    greeting: "Sss… nice to meet you!",
    fact: "没有脚，也能轻轻滑过草地。",
    parts: [
      {
        text: "s",
        ipa: "/s/",
        tip: "气流轻轻通过，发 /s/，不要加一个额外的元音。",
      },
      { text: "n", ipa: "/n/", tip: "舌尖抵住上齿龈，声音从鼻子里出来。" },
      {
        text: "a",
        ipa: "/eɪ/",
        tip: "末尾不发音的 e，让 a 读自己的字母名 /eɪ/。",
      },
      { text: "k", ipa: "/k/", tip: "短短地发 /k/，不要读成字母名 kay。" },
      {
        text: "e",
        ipa: "静音",
        tip: "这个 e 不发音！它和 a 组成 a_e，让 a 发长音。",
      },
    ],
    ruleLabel: "神奇的 silent e",
    rule: "s + n + /eɪ/ + k，连成 snake！a_e 是隔开的字母组合；末尾 e 不发音，让 a 发长音 /eɪ/。",
  },
  {
    id: "hippo",
    name: "hippo",
    chinese: "河马",
    ipa: "/ˈhɪp.oʊ/",
    color: "#9a759b",
    background: "#f4eaf3",
    greeting: "Let’s make a splash!",
    fact: "喜欢泡在水里，露出小耳朵和鼻子。",
    parts: [
      {
        text: "hip",
        ipa: "/hɪp/",
        tip: "i 发短音 /ɪ/，第一个音节读得有力一点。",
      },
      {
        text: "po",
        ipa: "/oʊ/",
        tip: "两个 p 只发一个 /p/；这里按拼写分块，声音连起来是 /ˈhɪpoʊ/。",
      },
    ],
    ruleLabel: "双字母，一个声音",
    rule: "hippo 有两个音节。两个 p 挨在一起，只发一次 /p/；最后的 o 发长音 /oʊ/。",
  },
  {
    id: "crocodile",
    name: "crocodile",
    chinese: "鳄鱼",
    ipa: "/ˈkrɑː.kə.daɪl/",
    color: "#638349",
    background: "#eef1d9",
    greeting: "Come explore with me!",
    fact: "披着铠甲的游泳高手，尾巴是它的小桨。",
    parts: [
      {
        text: "croc",
        ipa: "/krɑːk/",
        tip: "第一个音节最有力，两个 c 在这里都发 /k/。",
      },
      { text: "o", ipa: "/ə/", tip: "中间的 o 轻轻带过，弱读成 /ə/。" },
      {
        text: "dile",
        ipa: "/daɪl/",
        tip: "又遇到 silent e！i_e 让 i 发长音 /aɪ/。",
      },
    ],
    ruleLabel: "再找一次 silent e",
    rule: "拍拍手：croc · o · dile，一共 3 个音节。末尾的 i_e 和 snake 的 a_e 一样，都藏着不发音的 e。",
  },
  {
    id: "monkey",
    name: "monkey",
    chinese: "猴子",
    ipa: "/ˈmʌŋ.ki/",
    color: "#a27850",
    background: "#f7eddf",
    greeting: "Let’s play together!",
    fact: "在树枝间跳来跳去，像个小小杂技家。",
    parts: [
      {
        text: "mon",
        ipa: "/mʌŋ/",
        tip: "这个 o 的声音比较特别，发 /ʌ/，需要跟着整词一起记。",
      },
      {
        text: "key",
        ipa: "/ki/",
        tip: "ey 在这个单词里发 /i/。n 遇到 /k/，听起来是 /ŋ/。",
      },
    ],
    ruleLabel: "听见特别的 o",
    rule: "monkey 里的 o 发 /ʌ/，ey 发 /i/。它不是完全规则的拼读词，跟着声音读，比逐个背字母更有帮助。",
  },
  {
    id: "tiger",
    name: "tiger",
    chinese: "老虎",
    ipa: "/ˈtaɪ.ɡər/",
    color: "#bc793b",
    background: "#fff0dc",
    greeting: "You’re a brave explorer!",
    fact: "每只老虎的条纹，都像指纹一样独一无二。",
    parts: [
      {
        text: "ti",
        ipa: "/taɪ/",
        tip: "ti 是开音节，i 在这里读自己的字母名 /aɪ/。",
      },
      {
        text: "ger",
        ipa: "/ɡər/",
        tip: "g 在这里发 /ɡ/；美式发音里 er 连在一起读 /ər/。",
      },
    ],
    ruleLabel: "打开音节，听见长音",
    rule: "ti · ger，一共 2 个音节。ti 以元音字母结尾，i 发长音 /aɪ/；g 在这里仍然发 /ɡ/。",
  },
];

export function makeQuizChoices(correct: AnimalId, round: number): Animal[] {
  const others = animals.filter((animal) => animal.id !== correct);
  const choices = [
    animals.find((animal) => animal.id === correct)!,
    others[round % others.length],
    others[(round + 2) % others.length],
  ];
  const offset = round % choices.length;
  return [...choices.slice(offset), ...choices.slice(0, offset)];
}
