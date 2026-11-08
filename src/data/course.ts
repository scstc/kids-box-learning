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
export const courseEdition = "Kid’s Box · 第二版 · 第 1 册";
export const contentNote =
  "原书活动、图页及配套音视频和闪卡已按你提供的第1册资源整理。词汇、例句与游戏为原创配套编排；缺少的原版音轨会在对应活动中标明。";

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
    description: "打个招呼，认识颜色和数字。",
    color: "#8b6bb0",
    background: "#f0eafa",
    icon: "hello",
    words: [
      word(
        "hello",
        "你好",
        ["hel", "lo"],
        "两个音节，重音在后面。最后的 o 是长音 /əʊ/。",
        "音节",
      ),
      word(
        "goodbye",
        "再见",
        ["good", "bye"],
        "good 的 oo 发短音 /ʊ/；bye 发 /baɪ/。先听，再连起来说。",
        "音节",
      ),
      word(
        "red",
        "红色",
        ["r", "e", "d"],
        "e 发短音 /e/。把三个声音紧紧连起来。",
      ),
      word(
        "yellow",
        "黄色",
        ["yel", "low"],
        "两个音节；这里 ow 发 /əʊ/，不是 /aʊ/。",
        "音节",
      ),
      word(
        "pink",
        "粉色",
        ["p", "i", "n", "k"],
        "i 发短音 /ɪ/。n 在 k 前面听起来是 /ŋ/。",
      ),
      word(
        "green",
        "绿色",
        ["g", "r", "ee", "n"],
        "ee 是一对声音搭档，一起发长音 /iː/。",
      ),
      word(
        "orange",
        "橙色",
        ["or", "ange"],
        "两个音节；g 在这个词里发 /dʒ/。跟着录音记住它的特别读音。",
        "音节",
      ),
      word(
        "purple",
        "紫色",
        ["pur", "ple"],
        "ur 在英式发音里读 /ɜː/；第二个音节轻轻读。",
        "音节",
      ),
      word(
        "blue",
        "蓝色",
        ["b", "l", "ue"],
        "ue 在这里一起发 /uː/，不要逐个读字母。",
      ),
      word(
        "one",
        "一",
        ["one"],
        "这是特别的数字词，读 /wʌn/。不能把它套进普通的 o_e 规则。",
        "整词",
      ),
      word(
        "two",
        "二",
        ["two"],
        "w 在 two 里不发音。听整词 /tuː/，和声音一起记。",
        "整词",
      ),
      word(
        "three",
        "三",
        ["th", "r", "ee"],
        "th 发 /θ/，舌尖轻轻放在上下牙齿之间；ee 发长音。",
      ),
      word(
        "four",
        "四",
        ["f", "our"],
        "our 在 four 里发 /ɔː/。这个组合在其他词中可能有别的读音。",
      ),
      word(
        "five",
        "五",
        ["f", "i", "v", "e"],
        "末尾 e 不发音，让 i 发长音 /aɪ/。",
      ),
      word(
        "six",
        "六",
        ["s", "i", "x"],
        "i 发短音；x 在这里包含 /k/ 和 /s/ 两个声音。",
      ),
      word(
        "seven",
        "七",
        ["sev", "en"],
        "两个音节。第一个 e 清晰地读，后一个 e 轻轻读。",
        "音节",
      ),
      word(
        "eight",
        "八",
        ["eigh", "t"],
        "eigh 四个字母在这里合起来发 /eɪ/；gh 不单独发音。",
      ),
      word(
        "nine",
        "九",
        ["n", "i", "n", "e"],
        "i_e 组合让 i 发长音 /aɪ/，最后的 e 不发音。",
      ),
      word(
        "ten",
        "十",
        ["t", "e", "n"],
        "和 red 一样，e 发短音 /e/。试着把 /t/ /e/ /n/ 连起来。",
      ),
    ],
    sentences: [
      {
        en: "Hello! My name is Lily.",
        zh: "你好！我叫莉莉。",
        tip: "换上自己的名字，向玩偶打个招呼。",
      },
      {
        en: "I am six. I like green.",
        zh: "我六岁。我喜欢绿色。",
        tip: "换成自己的年龄和喜欢的颜色。",
      },
      {
        en: "What is your name?",
        zh: "你叫什么名字？",
        tip: "和家人轮流问、轮流答。",
      },
    ],
  },
  {
    id: 2,
    title: "My school",
    zh: "我的小课堂",
    description: "找一找，书包里藏着什么？",
    color: "#548896",
    background: "#e5f2f4",
    icon: "school",
    words: [
      word(
        "book",
        "书",
        ["b", "oo", "k"],
        "oo 在 book 中发短音 /ʊ/。不是所有 oo 都读长音。",
      ),
      word(
        "chair",
        "椅子",
        ["ch", "air"],
        "ch 合起来发 /tʃ/；air 在英式发音里读 /eə/。",
      ),
      word(
        "table",
        "桌子",
        ["ta", "ble"],
        "ta 是开音节，a 发 /eɪ/；第二个音节轻轻读。",
        "音节",
      ),
      word("pen", "钢笔", ["p", "e", "n"], "e 发短音 /e/，和 ten 押韵。"),
      word(
        "pencil",
        "铅笔",
        ["pen", "cil"],
        "两个音节；这里 c 在 i 前发 /s/。",
        "音节",
      ),
      word(
        "eraser",
        "橡皮",
        ["e", "ra", "ser"],
        "三个音节，重音在中间。这里 s 发 /z/。",
        "音节",
      ),
      word("bag", "书包", ["b", "a", "g"], "a 发短音 /æ/，嘴巴张大一点。"),
      word(
        "school",
        "学校",
        ["s", "ch", "oo", "l"],
        "特别提醒：school 的 ch 发 /k/，oo 发 /uː/。",
      ),
    ],
    sentences: [
      {
        en: "There is a blue book on my table.",
        zh: "我的桌子上有一本蓝色的书。",
        tip: "找一本真的书放在桌上，再说一遍。",
      },
      {
        en: "Is this your pencil?",
        zh: "这是你的铅笔吗？",
        tip: "拿起一支铅笔，邀请家人回答。",
      },
      {
        en: "I put my pen in my bag.",
        zh: "我把钢笔放进书包。",
        tip: "一边做动作，一边读句子。",
      },
    ],
  },
  {
    id: 3,
    title: "Favourite toys",
    zh: "心爱的玩具",
    description: "给玩具起名字，也给声音找搭档。",
    color: "#bc8353",
    background: "#faf0df",
    icon: "toys",
    words: [
      word(
        "ball",
        "球",
        ["b", "all"],
        "all 在 ball 中发 /ɔːl/。两个 l 只发一次 /l/。",
      ),
      word(
        "bike",
        "自行车",
        ["b", "i", "k", "e"],
        "不发音的 e 让 i 发长音 /aɪ/。",
      ),
      word(
        "car",
        "小汽车",
        ["c", "ar"],
        "ar 在英式发音里读 /ɑː/，末尾 r 不卷舌。",
      ),
      word(
        "doll",
        "玩偶",
        ["d", "o", "ll"],
        "英式发音中 o 发短音 /ɒ/；ll 只发一个 /l/。",
      ),
      word(
        "train",
        "火车",
        ["t", "r", "ai", "n"],
        "ai 一起发 /eɪ/，和 rain 里的 ai 一样。",
      ),
      word(
        "computer",
        "电脑",
        ["com", "pu", "ter"],
        "三个音节，重音在中间。轻轻读开头和结尾。",
        "音节",
      ),
      word(
        "black",
        "黑色",
        ["b", "l", "a", "ck"],
        "a 发短音 /æ/；ck 两个字母一起发 /k/。",
      ),
      word(
        "white",
        "白色",
        ["wh", "i", "t", "e"],
        "wh 在这里发 /w/；末尾 e 让 i 发长音。",
      ),
      word(
        "brown",
        "棕色",
        ["b", "r", "ow", "n"],
        "这里 ow 发 /aʊ/，和 yellow 的 ow 不同。",
      ),
      word(
        "grey",
        "灰色",
        ["g", "r", "ey"],
        "ey 在 grey 中发 /eɪ/。这是英式拼写。",
      ),
    ],
    sentences: [
      {
        en: "My favourite toy is a little train.",
        zh: "我最喜欢的玩具是一辆小火车。",
        tip: "把 train 换成你最喜欢的玩具。",
      },
      {
        en: "The ball is under the chair.",
        zh: "球在椅子下面。",
        tip: "用玩具表演 under，感受位置词。",
      },
      {
        en: "Let us play with the red car.",
        zh: "我们玩这辆红色的小汽车吧。",
        tip: "邀请家人一起玩，不只是在读句子。",
      },
    ],
  },
  {
    id: 4,
    title: "My family",
    zh: "我的一家人",
    description: "把爱的人，装进英语小句子。",
    color: "#b87985",
    background: "#f9eaf0",
    icon: "family",
    words: [
      word(
        "mother",
        "妈妈",
        ["mo", "ther"],
        "这里 o 发 /ʌ/；th 发带声音的 /ð/。",
        "音节",
      ),
      word(
        "father",
        "爸爸",
        ["fa", "ther"],
        "father 的 a 发 /ɑː/，th 和 mother 一样发 /ð/。",
        "音节",
      ),
      word(
        "brother",
        "兄弟",
        ["bro", "ther"],
        "o 在 brother 里也发 /ʌ/，和 mother 的声音相似。",
        "音节",
      ),
      word(
        "sister",
        "姐妹",
        ["sis", "ter"],
        "i 是短音 /ɪ/。第二个音节轻轻读。",
        "音节",
      ),
      word(
        "grandmother",
        "奶奶；外婆",
        ["grand", "mo", "ther"],
        "先认识 grandmother 里的 mother，再加上 grand。按节拍慢慢读。",
        "音节",
      ),
      word(
        "grandfather",
        "爷爷；外公",
        ["grand", "fa", "ther"],
        "长词也能分开记：grand 加上 father。",
        "音节",
      ),
      word(
        "family",
        "家人；家庭",
        ["fam", "i", "ly"],
        "第一个 a 发 /æ/，结尾 y 发 /i/。自然语速中，中间音节可能很轻。",
        "音节",
      ),
      word(
        "baby",
        "宝宝",
        ["ba", "by"],
        "开音节 ba 里的 a 发 /eɪ/，结尾 y 发 /i/。",
        "音节",
      ),
      word(
        "happy",
        "开心的",
        ["hap", "py"],
        "a 发 /æ/。两个 p 只发一次 /p/，不要读两遍。",
        "音节",
      ),
      word(
        "sad",
        "难过的",
        ["s", "a", "d"],
        "a 发短音 /æ/。做个表情，和单词一起记住。",
      ),
    ],
    sentences: [
      {
        en: "This is my family. We are happy.",
        zh: "这是我的家人。我们很开心。",
        tip: "找一张家庭照片，边指边介绍。",
      },
      {
        en: "My sister has a purple bag.",
        zh: "我的姐妹有一个紫色书包。",
        tip: "把人物、颜色和物品换成真实的情况。",
      },
      {
        en: "Who is that? That is my grandfather.",
        zh: "那是谁？那是我的爷爷。",
        tip: "轮流指着照片问答。",
      },
    ],
  },
  {
    id: 5,
    title: "Our pets",
    zh: "可爱的宠物",
    description: "听听谁来了，用英语介绍小动物。",
    color: "#7e9152",
    background: "#eff2dc",
    icon: "pets",
    words: [
      word(
        "cat",
        "猫",
        ["c", "a", "t"],
        "a 发短音 /æ/。先连 c 和 a，再轻轻收尾 t。",
      ),
      word(
        "dog",
        "狗",
        ["d", "o", "g"],
        "英式发音里 o 发 /ɒ/，和 doll 中的 o 相同。",
      ),
      word(
        "bird",
        "鸟",
        ["b", "ir", "d"],
        "ir 是一个组合，在英式发音里读 /ɜː/。",
      ),
      word(
        "fish",
        "鱼",
        ["f", "i", "sh"],
        "sh 两个字母一起发 /ʃ/，像轻轻说“嘘”。",
      ),
      word(
        "horse",
        "马",
        ["h", "or", "s", "e"],
        "or 发 /ɔː/。末尾 e 不发音，但这里不是让 o 发字母名的规则。",
      ),
      word(
        "mouse",
        "老鼠",
        ["m", "ou", "s", "e"],
        "ou 在 mouse 里发 /aʊ/；结尾 e 不发音。",
      ),
      word("big", "大的", ["b", "i", "g"], "i 发短音 /ɪ/，不要读成长音 /aɪ/。"),
      word(
        "small",
        "小的",
        ["s", "m", "all"],
        "和 ball 一样，all 发 /ɔːl/，前面多了 /s/ 和 /m/。",
      ),
      word(
        "long",
        "长的",
        ["l", "o", "ng"],
        "ng 在这里一起发 /ŋ/，不要再额外读出 /g/。",
      ),
      word(
        "short",
        "短的",
        ["sh", "or", "t"],
        "sh 发 /ʃ/，or 发 /ɔː/。和 long 做一对反义词。",
      ),
    ],
    sentences: [
      {
        en: "I have got a small fish.",
        zh: "我有一条小鱼。",
        tip: "have got 可以表示“有”。换一种宠物说说看。",
      },
      {
        en: "My cat has got a long tail.",
        zh: "我的猫有一条长尾巴。",
        tip: "观察小动物，用 long 或 short 来描述。",
      },
      {
        en: "Is your dog big or small?",
        zh: "你的狗是大还是小？",
        tip: "用手比划 big 和 small 再回答。",
      },
    ],
  },
  {
    id: 6,
    title: "My face",
    zh: "我的小脸蛋",
    description: "指一指、动一动，让身体帮忙记。",
    color: "#bc8652",
    background: "#fff0de",
    icon: "face",
    words: [
      word(
        "face",
        "脸",
        ["f", "a", "c", "e"],
        "a_e 让 a 发 /eɪ/；c 在 e 前面发 /s/。",
      ),
      word(
        "eye",
        "眼睛",
        ["eye"],
        "eye 读 /aɪ/，和字母 I 同音，是需要整词记忆的词。",
        "整词",
      ),
      word(
        "ear",
        "耳朵",
        ["ear"],
        "ear 在英式发音里读 /ɪə/。这个组合要一起听。",
        "整词",
      ),
      word(
        "nose",
        "鼻子",
        ["n", "o", "s", "e"],
        "o_e 让 o 发 /əʊ/；这个词里的 s 发 /z/。",
      ),
      word(
        "mouth",
        "嘴巴",
        ["m", "ou", "th"],
        "ou 发 /aʊ/；th 发不带声音的 /θ/。",
      ),
      word(
        "hair",
        "头发",
        ["h", "air"],
        "air 和 chair 中的 air 声音相同，英式读 /eə/。",
      ),
      word(
        "head",
        "头",
        ["h", "ea", "d"],
        "注意例外：head 中的 ea 发短音 /e/，不是 /iː/。",
      ),
      word(
        "tooth",
        "一颗牙齿",
        ["t", "oo", "th"],
        "这里 oo 发长音 /uː/。多颗牙齿叫 teeth。",
      ),
      word(
        "hand",
        "手",
        ["h", "a", "n", "d"],
        "a 发短音 /æ/；最后的 n 和 d 要连起来读。",
      ),
      word(
        "foot",
        "一只脚",
        ["f", "oo", "t"],
        "oo 和 book 一样发短音 /ʊ/。两只脚叫 feet。",
      ),
    ],
    sentences: [
      {
        en: "Touch your nose and point to your ears.",
        zh: "摸摸鼻子，指指耳朵。",
        tip: "家长发指令，孩子做动作，再交换角色。",
      },
      {
        en: "I have got two eyes and one mouth.",
        zh: "我有两只眼睛和一张嘴。",
        tip: "有两只时，eye 变成 eyes。留意词尾的小声音。",
      },
      {
        en: "My funny monster has got green hair.",
        zh: "我的搞笑小怪兽有绿色的头发。",
        tip: "画一只自己的小怪兽，再介绍它。",
      },
    ],
  },
  {
    id: 7,
    title: "Wild animals",
    zh: "奇妙动物园",
    description: "老朋友，新发现，走进声音里的动物园。",
    color: "#66884c",
    background: "#ebf1dd",
    icon: "animals",
    words: [
      word(
        "giraffe",
        "长颈鹿",
        ["gi", "raffe"],
        "g 在这里发 /dʒ/；第二个音节有重音，末尾 e 不发音。",
        "音节",
      ),
      word(
        "elephant",
        "大象",
        ["el", "e", "phant"],
        "三个音节，重音在第一个。ph 是搭档，一起发 /f/。",
        "音节",
      ),
      word(
        "snake",
        "蛇",
        ["s", "n", "a", "k", "e"],
        "a_e 让 a 发长音 /eɪ/，末尾 e 不发音。snake 只有一个音节。",
      ),
      word(
        "hippo",
        "河马",
        ["hip", "po"],
        "两个 p 只发一个 /p/；英式发音中末尾 o 发 /əʊ/。",
        "音节",
      ),
      word(
        "crocodile",
        "鳄鱼",
        ["croc", "o", "dile"],
        "三个节拍；最后的 i_e 让 i 发 /aɪ/。",
        "音节",
      ),
      word(
        "monkey",
        "猴子",
        ["mon", "key"],
        "这个 o 发 /ʌ/，ey 发 /i/。n 在 /k/ 前听起来是 /ŋ/。",
        "音节",
      ),
      word(
        "tiger",
        "老虎",
        ["ti", "ger"],
        "ti 是开音节，i 发 /aɪ/；g 发 /ɡ/，和 giraffe 里的 g 不同。",
        "音节",
      ),
      word(
        "tail",
        "尾巴",
        ["t", "ai", "l"],
        "ai 是发音搭档，一起发 /eɪ/，和 train 的 ai 一样。",
      ),
      word(
        "leg",
        "腿",
        ["l", "e", "g"],
        "e 发短音 /e/，和 red、pen 中的 e 相同。",
      ),
      word(
        "body",
        "身体",
        ["bod", "y"],
        "英式发音中 o 发 /ɒ/，结尾 y 发 /i/。",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "The giraffe has got a very long neck.",
        zh: "长颈鹿有一个很长的脖子。",
        tip: "用手比划 long，把描述和动物连起来。",
      },
      {
        en: "Can you see the tiger behind the tree?",
        zh: "你能看见树后面的老虎吗？",
        tip: "拿玩具躲到物品后面，感受 behind 的意思。",
      },
      {
        en: "My favourite wild animal is the elephant.",
        zh: "我最喜欢的野生动物是大象。",
        tip: "说说你喜欢哪种动物，不用和例句一样。",
      },
    ],
  },
  {
    id: 8,
    title: "My clothes",
    zh: "我的小衣柜",
    description: "搭配颜色，给今天选一套衣服。",
    color: "#a47bb0",
    background: "#f4eaf7",
    icon: "clothes",
    words: [
      word(
        "shirt",
        "衬衫",
        ["sh", "ir", "t"],
        "sh 发 /ʃ/；ir 在英式发音里读 /ɜː/。",
      ),
      word(
        "T-shirt",
        "T恤",
        ["T", "-", "shirt"],
        "T 读字母名 /tiː/，再接 shirt。横线本身不发音。",
        "整词",
      ),
      word(
        "skirt",
        "短裙",
        ["s", "k", "ir", "t"],
        "ir 和 shirt 的 ir 声音相同。比较两个词开头的声音。",
      ),
      word(
        "dress",
        "连衣裙",
        ["d", "r", "e", "ss"],
        "e 发 /e/；两个 s 只发一个 /s/。",
      ),
      word(
        "trousers",
        "裤子",
        ["trou", "sers"],
        "ou 在这里发 /aʊ/。英语里裤子常用复数形式 trousers。",
        "音节",
      ),
      word(
        "shoes",
        "鞋子",
        ["sh", "oe", "s"],
        "oe 在这个词里发 /uː/；复数 s 发 /z/。",
      ),
      word(
        "socks",
        "袜子",
        ["s", "o", "ck", "s"],
        "ck 发 /k/，复数 s 发 /s/。末尾连起来是 /ks/。",
      ),
      word(
        "jacket",
        "夹克",
        ["jack", "et"],
        "j 发 /dʒ/，ck 发 /k/。有两个音节。",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "I am wearing a yellow T-shirt today.",
        zh: "我今天穿着一件黄色T恤。",
        tip: "看看自己今天穿什么，再改一改句子。",
      },
      {
        en: "My shoes are brown and my socks are white.",
        zh: "我的鞋子是棕色的，袜子是白色的。",
        tip: "鞋和袜子常用复数，所以这里用 are。",
      },
      {
        en: "Where is my red jacket?",
        zh: "我的红色夹克在哪里？",
        tip: "把一件衣服藏起来，用英语找一找。",
      },
    ],
  },
  {
    id: 9,
    title: "Fun time!",
    zh: "一起动起来",
    description: "做动作，说英语，发现我能做到的事。",
    color: "#4e9293",
    background: "#e6f3ef",
    icon: "actions",
    words: [
      word(
        "play",
        "玩耍",
        ["p", "l", "ay"],
        "ay 一起发 /eɪ/，常出现在单词末尾。",
      ),
      word(
        "swim",
        "游泳",
        ["s", "w", "i", "m"],
        "i 发短音 /ɪ/；开头 /s/ 和 /w/ 要紧紧连起来。",
      ),
      word(
        "run",
        "跑",
        ["r", "u", "n"],
        "u 发短音 /ʌ/。一边慢跑，一边说单词。",
      ),
      word(
        "jump",
        "跳",
        ["j", "u", "m", "p"],
        "j 发 /dʒ/，u 发 /ʌ/，最后的 m 和 p 连着读。",
      ),
      word(
        "sing",
        "唱歌",
        ["s", "i", "ng"],
        "ng 发 /ŋ/。舌头不要在最后再加一个 /g/。",
      ),
      word(
        "dance",
        "跳舞",
        ["d", "a", "n", "c", "e"],
        "英式发音中 a 常读 /ɑː/，c 发 /s/；这里不是普通 a_e 长音规则。",
      ),
      word(
        "ride",
        "骑",
        ["r", "i", "d", "e"],
        "i_e 让 i 发长音 /aɪ/，和 bike 一样。",
      ),
      word(
        "football",
        "足球",
        ["foot", "ball"],
        "把认识的 foot 和 ball 合起来，长词变容易。",
        "音节",
      ),
      word(
        "tennis",
        "网球",
        ["ten", "nis"],
        "第一个音节重读；nn 只发一个 /n/。",
        "音节",
      ),
      word(
        "basketball",
        "篮球",
        ["bas", "ket", "ball"],
        "三个节拍。先找到熟悉的 ball，再连起来读。",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "I can jump, but I cannot swim yet.",
        zh: "我会跳，但我还不会游泳。",
        tip: "can 表示“会”；yet 是“还”，以后可以继续学。",
      },
      {
        en: "Can you ride a bike?",
        zh: "你会骑自行车吗？",
        tip: "回答 Yes, I can. 或 No, I cannot.。",
      },
      {
        en: "Let us play football in the garden.",
        zh: "我们去花园踢足球吧。",
        tip: "把足球换成你喜欢的一项活动。",
      },
    ],
  },
  {
    id: 10,
    title: "At the funfair",
    zh: "游乐园出发",
    description: "坐上小交通工具，去看更大的世界。",
    color: "#b18c42",
    background: "#faf1d8",
    icon: "transport",
    words: [
      word(
        "bus",
        "公交车",
        ["b", "u", "s"],
        "u 发 /ʌ/，和 run、jump 的元音相同。",
      ),
      word("boat", "小船", ["b", "oa", "t"], "oa 两个字母合起来发 /əʊ/。"),
      word(
        "plane",
        "飞机",
        ["p", "l", "a", "n", "e"],
        "a_e 让 a 发 /eɪ/。最后的 e 不发音。",
      ),
      word(
        "helicopter",
        "直升机",
        ["hel", "i", "cop", "ter"],
        "四个节拍，先慢慢拍手读。重音在第一个音节。",
        "音节",
      ),
      word(
        "lorry",
        "卡车",
        ["lor", "ry"],
        "这是英式英语的卡车。o 发 /ɒ/；两个 r 不需要读两次。",
        "音节",
      ),
      word(
        "motorbike",
        "摩托车",
        ["mo", "tor", "bike"],
        "先找出熟悉的 bike；motor 里的第一个 o 发 /əʊ/。",
        "音节",
      ),
      word(
        "funny",
        "有趣的",
        ["fun", "ny"],
        "u 发短音 /ʌ/，结尾 y 发 /i/。",
        "音节",
      ),
      word(
        "hungry",
        "饿的",
        ["hun", "gry"],
        "u 发 /ʌ/；n 在 /g/ 前面听起来是 /ŋ/。",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "We can go to the funfair by bus.",
        zh: "我们可以坐公交车去游乐园。",
        tip: "by bus 是“乘公交车”，也试试 by car。",
      },
      {
        en: "The little boat is on the water.",
        zh: "小船在水上。",
        tip: "用积木或画画，摆出句子里的场景。",
      },
      {
        en: "I am hungry after the funny ride.",
        zh: "玩过有趣的游乐设施后，我饿了。",
        tip: "用表情和动作区分 hungry 与 funny。",
      },
    ],
  },
  {
    id: 11,
    title: "Our house",
    zh: "温暖的小家",
    description: "走进每个房间，发现生活里的英语。",
    color: "#b27f65",
    background: "#f7eade",
    icon: "house",
    words: [
      word(
        "house",
        "房子",
        ["h", "ou", "s", "e"],
        "ou 发 /aʊ/，和 mouse 押韵。末尾 e 不发音。",
      ),
      word(
        "living room",
        "客厅",
        ["liv", "ing", " ", "room"],
        "living 的 i 是短音；room 的 oo 通常发长音 /uː/。空格不是声音。",
        "音节",
      ),
      word(
        "bedroom",
        "卧室",
        ["bed", "room"],
        "bed 加 room 就是卧室。比较 bed 的短音和 room 的长音。",
        "音节",
      ),
      word(
        "bathroom",
        "浴室",
        ["bath", "room"],
        "英式 bath 中 a 常读 /ɑː/；th 发 /θ/。",
        "音节",
      ),
      word(
        "kitchen",
        "厨房",
        ["kitch", "en"],
        "tch 三个字母一起发 /tʃ/。有两个音节。",
        "音节",
      ),
      word(
        "garden",
        "花园",
        ["gar", "den"],
        "ar 在英式发音里读 /ɑː/，后一个音节轻轻读。",
        "音节",
      ),
      word(
        "door",
        "门",
        ["d", "oor"],
        "oor 在 door 中发 /ɔː/，不是普通 oo 的读音。",
      ),
      word(
        "window",
        "窗户",
        ["win", "dow"],
        "第一个 i 是短音，结尾 ow 和 yellow 一样读 /əʊ/。",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "My toy car is in the bedroom.",
        zh: "我的玩具汽车在卧室里。",
        tip: "换一个玩具和房间，再说自己的句子。",
      },
      {
        en: "There is a cat next to the kitchen door.",
        zh: "厨房门旁边有一只猫。",
        tip: "next to 表示“紧挨着，在旁边”。",
      },
      {
        en: "Where is Dad? He is in the garden.",
        zh: "爸爸在哪里？他在花园里。",
        tip: "用家里的真实场景做问答。",
      },
    ],
  },
  {
    id: 12,
    title: "Party time!",
    zh: "快乐小派对",
    description: "分享喜欢的食物，也分享学习的快乐。",
    color: "#c17a72",
    background: "#fbeae4",
    icon: "party",
    words: [
      word(
        "apple",
        "苹果",
        ["ap", "ple"],
        "a 发短音 /æ/；两个 p 只发一个 /p/。",
        "音节",
      ),
      word(
        "banana",
        "香蕉",
        ["ba", "na", "na"],
        "三个音节，重音在中间；英式发音里中间 a 发 /ɑː/。",
        "音节",
      ),
      word(
        "orange",
        "橙子",
        ["or", "ange"],
        "和颜色 orange 是同一个单词，也可以表示橙子。",
        "音节",
      ),
      word(
        "pear",
        "梨",
        ["p", "ear"],
        "ear 在 pear 里读 /eə/，和单独的 ear 读音不同。",
      ),
      word(
        "cake",
        "蛋糕",
        ["c", "a", "k", "e"],
        "又遇到 a_e：a 发 /eɪ/，e 不发音。",
      ),
      word(
        "chocolate",
        "巧克力",
        ["choc", "olate"],
        "ch 发 /tʃ/；常见英式读法有两个节拍 /ˈtʃɒk.lət/，后半轻轻读。不要把 late 单独读成 /leɪt/。",
        "音节",
      ),
      word(
        "ice cream",
        "冰淇淋",
        ["ice", " ", "cream"],
        "ice 中 i_e 发长音；cream 的 ea 发 /iː/。",
        "整词",
      ),
      word(
        "party",
        "派对",
        ["par", "ty"],
        "ar 在英式发音里读 /ɑː/，结尾 y 发 /i/。",
        "音节",
      ),
    ],
    sentences: [
      {
        en: "I would like a banana and some ice cream.",
        zh: "我想要一根香蕉和一些冰淇淋。",
        tip: "I would like 是礼貌地说“我想要”。",
      },
      {
        en: "Do you like pears? Yes, I do.",
        zh: "你喜欢梨吗？是的，我喜欢。",
        tip: "把 pears 换成别的食物，问问家人。",
      },
      {
        en: "Let us share this cake with our friends.",
        zh: "让我们和朋友们分享这个蛋糕。",
        tip: "读完可以画一个小派对，介绍里面的食物。",
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
