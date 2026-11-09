import { wordPronunciations } from "./pronunciations.ts";

export type ChunkType = "拼读块" | "音节" | "整词";
export type CourseWord = {
  id: string;
  en: string;
  zh: string;
  chunks: string[];
  tip: string;
  chunkType: ChunkType;
  ipa: string;
  sounds: string[];
};
export type Sentence = { en: string; zh: string; tip: string };
export type CourseUnit = {
  id: number;
  title: string;
  zh: string;
  description: string;
  color: string;
  background: string;
  icon: string;
  words: CourseWord[];
  sentences: Sentence[];
};

export const courseSource =
  "https://www.blinklearning.com/coursePlayer/curso2.php?idcurso=164001";
export const courseEdition = "Kids Box · Second edition · Book 1";
export const contentNote =
  "Book pages, activities, recordings, videos and flashcards follow the supplied Book 1 resources. Word practice, example sentences and games are independently arranged. Missing original recordings are marked in each activity.";

export function audioKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function word(
  en: string,
  zh: string,
  chunks: string[],
  tip: string,
  chunkType: ChunkType = "拼读块",
): CourseWord {
  const pronunciation = wordPronunciations[en];
  if (!pronunciation) throw new Error(`Missing pronunciation: ${en}`);
  return { id: audioKey(en), en, zh, chunks, tip, chunkType, ...pronunciation };
}

export const courseUnits: CourseUnit[] = [
  {
    id: 1,
    title: "Hello!",
    zh: "你好，新朋友",
    description: "Say hello. Discover colours and numbers.",
    color: "#8b6bb0",
    background: "#f0eafa",
    icon: "hello",
    words: [
      word(
        "hello",
        "你好",
        ["hel", "lo"],
        "Two syllables. Stress the second one. The final o says /əʊ/.",
        "音节",
      ),
      word(
        "goodbye",
        "再见",
        ["good", "bye"],
        "In good, oo says /ʊ/. Bye says /baɪ/. Listen, then blend.",
        "音节",
      ),
      word(
        "red",
        "红色",
        ["r", "e", "d"],
        "The e says /e/. Blend /r/ /e/ /d/ together.",
      ),
      word(
        "yellow",
        "黄色",
        ["yel", "low"],
        "Two syllables. Here ow says /əʊ/.",
        "音节",
      ),
      word(
        "pink",
        "粉色",
        ["p", "i", "n", "k"],
        "The i says /ɪ/. Before k, n sounds like /ŋ/.",
      ),
      word(
        "green",
        "绿色",
        ["g", "r", "ee", "n"],
        "The letters ee work together to say /iː/.",
      ),
      word(
        "orange",
        "橙色",
        ["or", "ange"],
        "Two syllables. The g says /dʒ/. Listen for the special sounds.",
        "音节",
      ),
      word(
        "purple",
        "紫色",
        ["pur", "ple"],
        "In British English, ur says /ɜː/. Say the second syllable softly.",
        "音节",
      ),
      word(
        "blue",
        "蓝色",
        ["b", "l", "ue"],
        "The letters ue work together to say /uː/.",
      ),
      word(
        "one",
        "一",
        ["one"],
        "A special word: /wʌn/. Listen to the whole word.",
        "整词",
      ),
      word(
        "two",
        "二",
        ["two"],
        "The w is silent. Listen to the whole word: /tuː/.",
        "整词",
      ),
      word(
        "three",
        "三",
        ["th", "r", "ee"],
        "For th /θ/, put your tongue gently between your teeth. The ee says /iː/.",
      ),
      word(
        "four",
        "四",
        ["f", "our"],
        "Here our says /ɔː/. This spelling can sound different in other words.",
      ),
      word(
        "five",
        "五",
        ["f", "i", "v", "e"],
        "Silent e helps i say its name: /aɪ/.",
      ),
      word(
        "six",
        "六",
        ["s", "i", "x"],
        "The i says /ɪ/. The x has two sounds: /k/ and /s/.",
      ),
      word(
        "seven",
        "七",
        ["sev", "en"],
        "Two syllables. Say the first e clearly and the second one softly.",
        "音节",
      ),
      word(
        "eight",
        "八",
        ["eigh", "t"],
        "The letters eigh work together to say /eɪ/. Do not sound out gh separately.",
      ),
      word(
        "nine",
        "九",
        ["n", "i", "n", "e"],
        "The i_e pattern says /aɪ/. The final e is silent.",
      ),
      word(
        "ten",
        "十",
        ["t", "e", "n"],
        "The e says /e/, as in red. Blend /t/ /e/ /n/.",
      ),
    ],
    sentences: [
      {
        en: "Hello! My name is Lily.",
        zh: "你好！我叫莉莉。",
        tip: "Use your own name. Say hello to a toy.",
      },
      {
        en: "I am six. I like green.",
        zh: "我六岁。我喜欢绿色。",
        tip: "Try your own age and favourite colour.",
      },
      {
        en: "What is your name?",
        zh: "你叫什么名字？",
        tip: "Take turns asking and answering.",
      },
    ],
  },
  {
    id: 2,
    title: "My school",
    zh: "我的小课堂",
    description: "What can you find in your school bag?",
    color: "#548896",
    background: "#e5f2f4",
    icon: "school",
    words: [
      word(
        "book",
        "书",
        ["b", "oo", "k"],
        "Here oo says /ʊ/. It does not always say /uː/.",
      ),
      word(
        "chair",
        "椅子",
        ["ch", "air"],
        "The ch says /tʃ/. In British English, air says /eə/.",
      ),
      word(
        "table",
        "桌子",
        ["ta", "ble"],
        "In the open syllable ta, a says /eɪ/. Say the last syllable softly.",
        "音节",
      ),
      word("pen", "钢笔", ["p", "e", "n"], "The e says /e/. Pen rhymes with ten."),
      word(
        "pencil",
        "铅笔",
        ["pen", "cil"],
        "Two syllables. Before i, this c says /s/.",
        "音节",
      ),
      word(
        "eraser",
        "橡皮",
        ["e", "ra", "ser"],
        "Three syllables. Stress the middle one. Here s says /z/.",
        "音节",
      ),
      word("bag", "书包", ["b", "a", "g"], "The a says /æ/. Open your mouth wide."),
      word(
        "school",
        "学校",
        ["s", "ch", "oo", "l"],
        "A special pattern: ch says /k/ and oo says /uː/.",
      ),
    ],
    sentences: [
      {
        en: "There is a blue book on my table.",
        zh: "我的桌子上有一本蓝色的书。",
        tip: "Put a real book on a table and say it again.",
      },
      {
        en: "Is this your pencil?",
        zh: "这是你的铅笔吗？",
        tip: "Pick up a pencil and ask someone to answer.",
      },
      {
        en: "I put my pen in my bag.",
        zh: "我把钢笔放进书包。",
        tip: "Act out the sentence as you say it.",
      },
    ],
  },
  {
    id: 3,
    title: "Favourite toys",
    zh: "心爱的玩具",
    description: "Meet your toys and explore their sounds.",
    color: "#bc8353",
    background: "#faf0df",
    icon: "toys",
    words: [
      word(
        "ball",
        "球",
        ["b", "all"],
        "Here all says /ɔːl/. The two l letters make one /l/ sound.",
      ),
      word(
        "bike",
        "自行车",
        ["b", "i", "k", "e"],
        "Silent e helps i say /aɪ/.",
      ),
      word(
        "car",
        "小汽车",
        ["c", "ar"],
        "In British English, ar says /ɑː/. Listen to the ending.",
      ),
      word(
        "doll",
        "玩偶",
        ["d", "o", "ll"],
        "In British English, o says /ɒ/. Say the double l just once.",
      ),
      word(
        "train",
        "火车",
        ["t", "r", "ai", "n"],
        "The ai says /eɪ/, as in rain.",
      ),
      word(
        "computer",
        "电脑",
        ["com", "pu", "ter"],
        "Three syllables. Stress the middle one; say the others softly.",
        "音节",
      ),
      word(
        "black",
        "黑色",
        ["b", "l", "a", "ck"],
        "The a says /æ/. The letters ck make one /k/ sound.",
      ),
      word(
        "white",
        "白色",
        ["wh", "i", "t", "e"],
        "Here wh says /w/. Silent e helps i say /aɪ/.",
      ),
      word(
        "brown",
        "棕色",
        ["b", "r", "ow", "n"],
        "Here ow says /aʊ/. Compare it with the ow in yellow.",
      ),
      word(
        "grey",
        "灰色",
        ["g", "r", "ey"],
        "Here ey says /eɪ/. Grey is the British spelling.",
      ),
    ],
    sentences: [
      {
        en: "My favourite toy is a little train.",
        zh: "我最喜欢的玩具是一辆小火车。",
        tip: "Try the name of your favourite toy.",
      },
      {
        en: "The ball is under the chair.",
        zh: "球在椅子下面。",
        tip: "Hide a toy under something and say the sentence.",
      },
      {
        en: "Let us play with the red car.",
        zh: "我们玩这辆红色的小汽车吧。",
        tip: "Invite someone to play with you.",
      },
    ],
  },
  {
    id: 4,
    title: "My family",
    zh: "我的一家人",
    description: "Talk about the people you love.",
    color: "#b87985",
    background: "#f9eaf0",
    icon: "family",
    words: [
      word(
        "mother",
        "妈妈",
        ["mo", "ther"],
        "Here o says /ʌ/. Use your voice for th /ð/.",
        "音节",
      ),
      word(
        "father",
        "爸爸",
        ["fa", "ther"],
        "The a says /ɑː/. The th says /ð/, as in mother.",
        "音节",
      ),
      word(
        "brother",
        "兄弟",
        ["bro", "ther"],
        "Here o says /ʌ/, like the o in mother.",
        "音节",
      ),
      word(
        "sister",
        "姐妹",
        ["sis", "ter"],
        "The i says /ɪ/. Say the second syllable softly.",
        "音节",
      ),
      word(
        "grandmother",
        "奶奶；外婆",
        ["grand", "mo", "ther"],
        "Find the familiar word mother, then add grand. Clap the syllables.",
        "音节",
      ),
      word(
        "grandfather",
        "爷爷；外公",
        ["grand", "fa", "ther"],
        "Build this longer word from grand and father.",
        "音节",
      ),
      word(
        "family",
        "家人；家庭",
        ["fam", "i", "ly"],
        "The a says /æ/ and the final y says /i/. The middle syllable can be very soft.",
        "音节",
      ),
      word(
        "baby",
        "宝宝",
        ["ba", "by"],
        "In ba, a says /eɪ/. The final y says /i/.",
        "音节",
      ),
      word(
        "happy",
        "开心的",
        ["hap", "py"],
        "The a says /æ/. The two p letters make just one /p/ sound.",
        "音节",
      ),
      word(
        "sad",
        "难过的",
        ["s", "a", "d"],
        "The a says /æ/. Make a face as you say the word.",
      ),
    ],
    sentences: [
      {
        en: "This is my family. We are happy.",
        zh: "这是我的家人。我们很开心。",
        tip: "Point to people in a family photo.",
      },
      {
        en: "My sister has a purple bag.",
        zh: "我的姐妹有一个紫色书包。",
        tip: "Use real names, colours and objects.",
      },
      {
        en: "Who is that? That is my grandfather.",
        zh: "那是谁？那是我的爷爷。",
        tip: "Take turns asking about a photo.",
      },
    ],
  },
  {
    id: 5,
    title: "Our pets",
    zh: "可爱的宠物",
    description: "Meet little animals and talk about pets.",
    color: "#7e9152",
    background: "#eff2dc",
    icon: "pets",
    words: [
      word(
        "cat",
        "猫",
        ["c", "a", "t"],
        "The a says /æ/. Blend /k/ /æ/, then add /t/.",
      ),
      word(
        "dog",
        "狗",
        ["d", "o", "g"],
        "In British English, o says /ɒ/, as in doll.",
      ),
      word(
        "bird",
        "鸟",
        ["b", "ir", "d"],
        "The letters ir work together to say /ɜː/ in British English.",
      ),
      word(
        "fish",
        "鱼",
        ["f", "i", "sh"],
        "The letters sh work together to say /ʃ/.",
      ),
      word(
        "horse",
        "马",
        ["h", "or", "s", "e"],
        "The or says /ɔː/. The final e is silent; it does not make o say its name here.",
      ),
      word(
        "mouse",
        "老鼠",
        ["m", "ou", "s", "e"],
        "The ou says /aʊ/. The final e is silent.",
      ),
      word("big", "大的", ["b", "i", "g"], "The i says /ɪ/. Keep it short."),
      word(
        "small",
        "小的",
        ["s", "m", "all"],
        "The all says /ɔːl/, as in ball. Blend /s/ and /m/ at the start.",
      ),
      word(
        "long",
        "长的",
        ["l", "o", "ng"],
        "The ng says /ŋ/. Do not add an extra /ɡ/.",
      ),
      word(
        "short",
        "短的",
        ["sh", "or", "t"],
        "The sh says /ʃ/ and or says /ɔː/. Compare long and short.",
      ),
    ],
    sentences: [
      {
        en: "I have got a small fish.",
        zh: "我有一条小鱼。",
        tip: "Try talking about a different pet with have got.",
      },
      {
        en: "My cat has got a long tail.",
        zh: "我的猫有一条长尾巴。",
        tip: "Describe an animal with long or short.",
      },
      {
        en: "Is your dog big or small?",
        zh: "你的狗是大还是小？",
        tip: "Use your hands to show big and small.",
      },
    ],
  },
  {
    id: 6,
    title: "My face",
    zh: "我的小脸蛋",
    description: "Point, move and learn with your body.",
    color: "#bc8652",
    background: "#fff0de",
    icon: "face",
    words: [
      word(
        "face",
        "脸",
        ["f", "a", "c", "e"],
        "The a_e says /eɪ/. Before e, c says /s/.",
      ),
      word(
        "eye",
        "眼睛",
        ["eye"],
        "A special word: /aɪ/. It sounds like the letter I.",
        "整词",
      ),
      word(
        "ear",
        "耳朵",
        ["ear"],
        "In British English, ear says /ɪə/. Listen to these letters together.",
        "整词",
      ),
      word(
        "nose",
        "鼻子",
        ["n", "o", "s", "e"],
        "The o_e says /əʊ/. Here s says /z/.",
      ),
      word(
        "mouth",
        "嘴巴",
        ["m", "ou", "th"],
        "The ou says /aʊ/. For th /θ/, let the air flow without using your voice.",
      ),
      word(
        "hair",
        "头发",
        ["h", "air"],
        "The air sounds like the air in chair: /eə/.",
      ),
      word(
        "head",
        "头",
        ["h", "ea", "d"],
        "A special pattern: here ea says /e/, not /iː/.",
      ),
      word(
        "tooth",
        "一颗牙齿",
        ["t", "oo", "th"],
        "Here oo says /uː/. More than one tooth: teeth.",
      ),
      word(
        "hand",
        "手",
        ["h", "a", "n", "d"],
        "The a says /æ/. Blend n and d at the end.",
      ),
      word(
        "foot",
        "一只脚",
        ["f", "oo", "t"],
        "Here oo says /ʊ/, as in book. Two feet, one foot.",
      ),
    ],
    sentences: [
      {
        en: "Touch your nose and point to your ears.",
        zh: "摸摸鼻子，指指耳朵。",
        tip: "Take turns giving instructions and doing the actions.",
      },
      {
        en: "I have got two eyes and one mouth.",
        zh: "我有两只眼睛和一张嘴。",
        tip: "One eye, two eyes. Listen for the ending.",
      },
      {
        en: "My funny monster has got green hair.",
        zh: "我的搞笑小怪兽有绿色的头发。",
        tip: "Draw a little monster and describe it.",
      },
    ],
  },
  {
    id: 7,
    title: "Wild animals",
    zh: "奇妙动物园",
    description: "Meet wild animals and discover their sounds.",
    color: "#66884c",
    background: "#ebf1dd",
    icon: "animals",
    words: [
      word(
        "giraffe",
        "长颈鹿",
        ["gi", "raffe"],
        "Here g says /dʒ/. Stress the second syllable. The final e is silent.",
        "音节",
      ),
      word(
        "elephant",
        "大象",
        ["el", "e", "phant"],
        "Three syllables. Stress the first one. The ph says /f/.",
        "音节",
      ),
      word(
        "snake",
        "蛇",
        ["s", "n", "a", "k", "e"],
        "The a_e says /eɪ/. The e is silent. Snake has one syllable.",
      ),
      word(
        "hippo",
        "河马",
        ["hip", "po"],
        "The two p letters make one /p/ sound. In British English, the final o says /əʊ/.",
        "音节",
      ),
      word(
        "crocodile",
        "鳄鱼",
        ["croc", "o", "dile"],
        "Clap three syllables. The final i_e says /aɪ/.",
        "音节",
      ),
      word(
        "monkey",
        "猴子",
        ["mon", "key"],
        "Here o says /ʌ/ and ey says /i/. Before /k/, n sounds like /ŋ/.",
        "音节",
      ),
      word(
        "tiger",
        "老虎",
        ["ti", "ger"],
        "In the open syllable ti, i says /aɪ/. The g says /ɡ/. Compare giraffe.",
        "音节",
      ),
      word(
        "tail",
        "尾巴",
        ["t", "ai", "l"],
        "The ai says /eɪ/, as in train.",
      ),
      word(
        "leg",
        "腿",
        ["l", "e", "g"],
        "The e says /e/, as in red and pen.",
      ),
      word(
        "body",
        "身体",
        ["bod", "y"],
        "In British English, o says /ɒ/. The final y says /i/.",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "The giraffe has got a very long neck.",
        zh: "长颈鹿有一个很长的脖子。",
        tip: "Use your arms to show long as you describe the animal.",
      },
      {
        en: "Can you see the tiger behind the tree?",
        zh: "你能看见树后面的老虎吗？",
        tip: "Hide a toy behind something and say where it is.",
      },
      {
        en: "My favourite wild animal is the elephant.",
        zh: "我最喜欢的野生动物是大象。",
        tip: "Talk about your own favourite animal.",
      },
    ],
  },
  {
    id: 8,
    title: "My clothes",
    zh: "我的小衣柜",
    description: "Choose colours and clothes for today.",
    color: "#a47bb0",
    background: "#f4eaf7",
    icon: "clothes",
    words: [
      word(
        "shirt",
        "衬衫",
        ["sh", "ir", "t"],
        "The sh says /ʃ/. In British English, ir says /ɜː/.",
      ),
      word(
        "T-shirt",
        "T恤",
        ["T", "-", "shirt"],
        "Say the letter T /tiː/, then shirt. The hyphen has no sound.",
        "整词",
      ),
      word(
        "skirt",
        "短裙",
        ["s", "k", "ir", "t"],
        "The ir sounds like the ir in shirt. Compare their first sounds.",
      ),
      word(
        "dress",
        "连衣裙",
        ["d", "r", "e", "ss"],
        "The e says /e/. The two s letters make one /s/ sound.",
      ),
      word(
        "trousers",
        "裤子",
        ["trou", "sers"],
        "Here ou says /aʊ/. We usually use the plural word trousers.",
        "音节",
      ),
      word(
        "shoes",
        "鞋子",
        ["sh", "oe", "s"],
        "Here oe says /uː/. The plural s says /z/.",
      ),
      word(
        "socks",
        "袜子",
        ["s", "o", "ck", "s"],
        "The ck says /k/ and the final s says /s/. Blend /ks/ at the end.",
      ),
      word(
        "jacket",
        "夹克",
        ["jack", "et"],
        "The j says /dʒ/ and ck says /k/. Clap two syllables.",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "I am wearing a yellow T-shirt today.",
        zh: "我今天穿着一件黄色T恤。",
        tip: "Change the sentence to describe your clothes today.",
      },
      {
        en: "My shoes are brown and my socks are white.",
        zh: "我的鞋子是棕色的，袜子是白色的。",
        tip: "Shoes and socks come in pairs. Try using are.",
      },
      {
        en: "Where is my red jacket?",
        zh: "我的红色夹克在哪里？",
        tip: "Hide a piece of clothing and ask where it is.",
      },
    ],
  },
  {
    id: 9,
    title: "Fun time!",
    zh: "一起动起来",
    description: "Move, play and talk about what you can do.",
    color: "#4e9293",
    background: "#e6f3ef",
    icon: "actions",
    words: [
      word(
        "play",
        "玩耍",
        ["p", "l", "ay"],
        "The ay says /eɪ/. You often see ay at the end of a word.",
      ),
      word(
        "swim",
        "游泳",
        ["s", "w", "i", "m"],
        "The i says /ɪ/. Blend /s/ and /w/ at the start.",
      ),
      word(
        "run",
        "跑",
        ["r", "u", "n"],
        "The u says /ʌ/. Try jogging as you say it.",
      ),
      word(
        "jump",
        "跳",
        ["j", "u", "m", "p"],
        "The j says /dʒ/ and u says /ʌ/. Blend m and p at the end.",
      ),
      word(
        "sing",
        "唱歌",
        ["s", "i", "ng"],
        "The ng says /ŋ/. Do not add an extra /ɡ/.",
      ),
      word(
        "dance",
        "跳舞",
        ["d", "a", "n", "c", "e"],
        "In British English, a often says /ɑː/. The c says /s/. This is a special pattern.",
      ),
      word(
        "ride",
        "骑",
        ["r", "i", "d", "e"],
        "The i_e says /aɪ/, as in bike.",
      ),
      word(
        "football",
        "足球",
        ["foot", "ball"],
        "Join foot and ball to build a longer word.",
        "音节",
      ),
      word(
        "tennis",
        "网球",
        ["ten", "nis"],
        "Stress the first syllable. The two n letters make one /n/ sound.",
        "音节",
      ),
      word(
        "basketball",
        "篮球",
        ["bas", "ket", "ball"],
        "Clap three syllables. Find the word ball, then blend it all.",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "I can jump, but I cannot swim yet.",
        zh: "我会跳，但我还不会游泳。",
        tip: "Talk about what you can do and what you are still learning.",
      },
      {
        en: "Can you ride a bike?",
        zh: "你会骑自行车吗？",
        tip: "Answer Yes, I can. or No, I cannot.",
      },
      {
        en: "Let us play football in the garden.",
        zh: "我们去花园踢足球吧。",
        tip: "Try the name of your favourite activity.",
      },
    ],
  },
  {
    id: 10,
    title: "At the funfair",
    zh: "游乐园出发",
    description: "Explore transport and the world around you.",
    color: "#b18c42",
    background: "#faf1d8",
    icon: "transport",
    words: [
      word(
        "bus",
        "公交车",
        ["b", "u", "s"],
        "The u says /ʌ/, as in run and jump.",
      ),
      word("boat", "小船", ["b", "oa", "t"], "The letters oa work together to say /əʊ/."),
      word(
        "plane",
        "飞机",
        ["p", "l", "a", "n", "e"],
        "The a_e says /eɪ/. The final e is silent.",
      ),
      word(
        "helicopter",
        "直升机",
        ["hel", "i", "cop", "ter"],
        "Clap four syllables slowly. Stress the first one.",
        "音节",
      ),
      word(
        "lorry",
        "卡车",
        ["lor", "ry"],
        "The British word for a truck. The o says /ɒ/. Say the double r just once.",
        "音节",
      ),
      word(
        "motorbike",
        "摩托车",
        ["mo", "tor", "bike"],
        "Find the word bike. The first o in motor says /əʊ/.",
        "音节",
      ),
      word(
        "funny",
        "有趣的",
        ["fun", "ny"],
        "The u says /ʌ/ and the final y says /i/.",
        "音节",
      ),
      word(
        "hungry",
        "饿的",
        ["hun", "gry"],
        "The u says /ʌ/. Before /ɡ/, n sounds like /ŋ/.",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "We can go to the funfair by bus.",
        zh: "我们可以坐公交车去游乐园。",
        tip: "Try by bus, then change it to by car.",
      },
      {
        en: "The little boat is on the water.",
        zh: "小船在水上。",
        tip: "Build or draw the scene in the sentence.",
      },
      {
        en: "I am hungry after the funny ride.",
        zh: "玩过有趣的游乐设施后，我饿了。",
        tip: "Use expressions and actions to show hungry and funny.",
      },
    ],
  },
  {
    id: 11,
    title: "Our house",
    zh: "温暖的小家",
    description: "Find English in every room of your home.",
    color: "#b27f65",
    background: "#f7eade",
    icon: "house",
    words: [
      word(
        "house",
        "房子",
        ["h", "ou", "s", "e"],
        "The ou says /aʊ/. House rhymes with mouse. The e is silent.",
      ),
      word(
        "living room",
        "客厅",
        ["liv", "ing", " ", "room"],
        "In living, i says /ɪ/. In room, oo usually says /uː/. The space has no sound.",
        "音节",
      ),
      word(
        "bedroom",
        "卧室",
        ["bed", "room"],
        "Join bed and room. Compare the vowels in each part.",
        "音节",
      ),
      word(
        "bathroom",
        "浴室",
        ["bath", "room"],
        "In British English, the a in bath often says /ɑː/. The th says /θ/.",
        "音节",
      ),
      word(
        "kitchen",
        "厨房",
        ["kitch", "en"],
        "The letters tch make one /tʃ/ sound. Clap two syllables.",
        "音节",
      ),
      word(
        "garden",
        "花园",
        ["gar", "den"],
        "In British English, ar says /ɑː/. Say the second syllable softly.",
        "音节",
      ),
      word(
        "door",
        "门",
        ["d", "oor"],
        "Here oor says /ɔː/. Listen to this special pattern.",
      ),
      word(
        "window",
        "窗户",
        ["win", "dow"],
        "The first i says /ɪ/. The ow says /əʊ/, as in yellow.",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "My toy car is in the bedroom.",
        zh: "我的玩具汽车在卧室里。",
        tip: "Try a different toy and room.",
      },
      {
        en: "There is a cat next to the kitchen door.",
        zh: "厨房门旁边有一只猫。",
        tip: "Put two objects next to each other and describe them.",
      },
      {
        en: "Where is Dad? He is in the garden.",
        zh: "爸爸在哪里？他在花园里。",
        tip: "Ask and answer about your own home.",
      },
    ],
  },
  {
    id: 12,
    title: "Party time!",
    zh: "快乐小派对",
    description: "Share favourite foods and celebrate learning.",
    color: "#c17a72",
    background: "#fbeae4",
    icon: "party",
    words: [
      word(
        "apple",
        "苹果",
        ["ap", "ple"],
        "The a says /æ/. The two p letters make one /p/ sound.",
        "音节",
      ),
      word(
        "banana",
        "香蕉",
        ["ba", "na", "na"],
        "Three syllables. Stress the middle one. In British English, its a says /ɑː/.",
        "音节",
      ),
      word(
        "orange",
        "橙子",
        ["or", "ange"],
        "Orange is both a colour and a fruit. The sounds stay the same.",
        "音节",
      ),
      word(
        "pear",
        "梨",
        ["p", "ear"],
        "Here ear says /eə/. Compare it with the word ear.",
      ),
      word(
        "cake",
        "蛋糕",
        ["c", "a", "k", "e"],
        "The a_e says /eɪ/. The e is silent.",
      ),
      word(
        "chocolate",
        "巧克力",
        ["choc", "olate"],
        "The ch says /tʃ/. A common British pronunciation has two syllables: /ˈtʃɒk.lət/. Say the ending softly.",
        "音节",
      ),
      word(
        "ice cream",
        "冰淇淋",
        ["ice", " ", "cream"],
        "In ice, i_e says /aɪ/. In cream, ea says /iː/.",
        "整词",
      ),
      word(
        "party",
        "派对",
        ["par", "ty"],
        "In British English, ar says /ɑː/. The final y says /i/.",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "I would like a banana and some ice cream.",
        zh: "我想要一根香蕉和一些冰淇淋。",
        tip: "Use I would like to ask politely for something.",
      },
      {
        en: "Do you like pears? Yes, I do.",
        zh: "你喜欢梨吗？是的，我喜欢。",
        tip: "Try another food and ask someone what they like.",
      },
      {
        en: "Let us share this cake with our friends.",
        zh: "让我们和朋友们分享这个蛋糕。",
        tip: "Draw a little party and name the food.",
      },
    ],
  },
];

export type WordEntry = { unitId: number; word: CourseWord };
export const allWordEntries: WordEntry[] = courseUnits.flatMap((unit) =>
  unit.words.map((word) => ({ unitId: unit.id, word })),
);
export function entryKey(entry: WordEntry): string {
  return `${entry.unitId}:${entry.word.id}`;
}
export function spellingLetters(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("");
}

export function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function makeCourseChoices(
  answer: WordEntry,
  pool: readonly WordEntry[],
): WordEntry[] {
  const unique = new Map(
    pool
      .filter((entry) => entry.word.en !== answer.word.en)
      .map((entry) => [entry.word.en, entry]),
  );
  return shuffled([answer, ...shuffled([...unique.values()]).slice(0, 2)]);
}

export function getAudioItems(): { key: string; text: string }[] {
  const items = courseUnits.flatMap((unit) => [
    ...unit.words.map((word) => word.en),
    ...unit.sentences.map((sentence) => sentence.en),
  ]);
  return [
    ...new Map(
      items.map((text) => [audioKey(text), { key: audioKey(text), text }]),
    ).values(),
  ];
}
