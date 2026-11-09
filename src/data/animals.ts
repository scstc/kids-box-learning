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
    fact: "A long neck reaches the fresh leaves high in the trees.",
    parts: [
      {
        text: "gi",
        ipa: "/dʒə/",
        tip: "Say the first syllable softly. Here g says /dʒ/, not /ɡ/.",
      },
      {
        text: "raffe",
        ipa: "/ræf/",
        tip: "Stress this syllable! The a says /æ/. The ff makes one /f/ sound; the final e is silent.",
      },
    ],
    ruleLabel: "Discover the special g",
    rule: "In giraffe, g says /dʒ/. Stress the second syllable. Listen first, then blend.",
  },
  {
    id: "elephant",
    name: "elephant",
    chinese: "大象",
    ipa: "/ˈel.ɪ.fənt/",
    color: "#7376a6",
    background: "#efedf9",
    greeting: "A big hello to you!",
    fact: "A long trunk drinks water and says hello to friends.",
    parts: [
      { text: "el", ipa: "/el/", tip: "Stress the first syllable. The e says /e/." },
      { text: "e", ipa: "/ɪ/", tip: "Say this e softly: /ɪ/." },
      {
        text: "phant",
        ipa: "/fənt/",
        tip: "The letters ph say /f/. Here a has the soft sound /ə/.",
      },
    ],
    ruleLabel: "The sound partners ph",
    rule: "Two letters can make one sound: ph says /f/. Elephant has three syllables. Stress the first.",
  },
  {
    id: "snake",
    name: "snake",
    chinese: "蛇",
    ipa: "/sneɪk/",
    color: "#54866b",
    background: "#eaf2dc",
    greeting: "Sss… nice to meet you!",
    fact: "No feet, yet it can glide through the grass.",
    parts: [
      {
        text: "s",
        ipa: "/s/",
        tip: "Let the air flow for /s/. Do not add an extra vowel.",
      },
      { text: "n", ipa: "/n/", tip: "Touch your tongue behind your top teeth. Let the sound come through your nose." },
      {
        text: "a",
        ipa: "/eɪ/",
        tip: "Silent e helps a say its name: /eɪ/.",
      },
      { text: "k", ipa: "/k/", tip: "Make a short /k/ sound. Do not say the letter name kay." },
      {
        text: "e",
        ipa: "静音",
        tip: "This e is silent! It works with a in the a_e pattern.",
      },
    ],
    ruleLabel: "Discover silent e",
    rule: "Blend /s/ /n/ /eɪ/ /k/: snake! The split a_e pattern says /eɪ/; the final e is silent.",
  },
  {
    id: "hippo",
    name: "hippo",
    chinese: "河马",
    ipa: "/ˈhɪp.oʊ/",
    color: "#9a759b",
    background: "#f4eaf3",
    greeting: "Let’s make a splash!",
    fact: "It likes to rest in water with its ears and nose peeping out.",
    parts: [
      {
        text: "hip",
        ipa: "/hɪp/",
        tip: "The i says /ɪ/. Stress the first syllable.",
      },
      {
        text: "po",
        ipa: "/oʊ/",
        tip: "The two p letters make one /p/ sound. Blend the parts into /ˈhɪpoʊ/.",
      },
    ],
    ruleLabel: "Double letters, one sound",
    rule: "Hippo has two syllables. The two p letters make one /p/ sound. The final o says /oʊ/ in American English.",
  },
  {
    id: "crocodile",
    name: "crocodile",
    chinese: "鳄鱼",
    ipa: "/ˈkrɑː.kə.daɪl/",
    color: "#638349",
    background: "#eef1d9",
    greeting: "Come explore with me!",
    fact: "An armoured swimmer with a strong tail to paddle.",
    parts: [
      {
        text: "croc",
        ipa: "/krɑːk/",
        tip: "Stress the first syllable. Both c letters say /k/ here.",
      },
      { text: "o", ipa: "/ə/", tip: "Say the middle o softly: /ə/." },
      {
        text: "dile",
        ipa: "/daɪl/",
        tip: "Silent e again! The i_e says /aɪ/.",
      },
    ],
    ruleLabel: "Find silent e again",
    rule: "Clap croc · o · dile: three syllables. The i_e pattern has a silent e, just like a_e in snake.",
  },
  {
    id: "monkey",
    name: "monkey",
    chinese: "猴子",
    ipa: "/ˈmʌŋ.ki/",
    color: "#a27850",
    background: "#f7eddf",
    greeting: "Let’s play together!",
    fact: "It leaps between branches like a little acrobat.",
    parts: [
      {
        text: "mon",
        ipa: "/mʌŋ/",
        tip: "This o has the special sound /ʌ/. Learn it with the whole word.",
      },
      {
        text: "key",
        ipa: "/ki/",
        tip: "Here ey says /i/. Before /k/, n sounds like /ŋ/.",
      },
    ],
    ruleLabel: "Hear the special o",
    rule: "In monkey, o says /ʌ/ and ey says /i/. Listen and blend this special word.",
  },
  {
    id: "tiger",
    name: "tiger",
    chinese: "老虎",
    ipa: "/ˈtaɪ.ɡər/",
    color: "#bc793b",
    background: "#fff0dc",
    greeting: "You’re a brave explorer!",
    fact: "Every tiger has a unique pattern of stripes.",
    parts: [
      {
        text: "ti",
        ipa: "/taɪ/",
        tip: "The open syllable ti has the long i sound /aɪ/.",
      },
      {
        text: "ger",
        ipa: "/ɡər/",
        tip: "Here g says /ɡ/. In American English, er says /ər/.",
      },
    ],
    ruleLabel: "Open syllables, long vowels",
    rule: "Clap ti · ger: two syllables. The open syllable ti ends in a vowel, so i says /aɪ/. Here g says /ɡ/.",
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
