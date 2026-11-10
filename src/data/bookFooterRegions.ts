import type { BookHotspot } from "./bookHotspots";

type FooterPart = [text: string, x: number, width: number];
// Reviewed against every printed footer. A phrase is one target; slashes separate alternatives.
// Coordinates use the original 1259 × 1600 scans, shared by phone, tablet and desktop.
const footers: Record<number, FooterPart[]> = {
  5: [["Functions",120,120],["Hello, I'm",118,145],["What's your name?",276,235],["Goodbye.",534,125],["Vocabulary",735,150],["One to ten.",760,115]],
  6: [["Functions",160,120],["How old are you?",160,232],["I'm",420,70]],
  7: [["Vocabulary",120,150],["blue",120,64],["green",195,75],["orange",285,88],["pink",388,65],["purple",470,85],["red",570,50],["yellow",635,100]],
  11: [["Vocabulary",120,150],["book",118,66],["chair",202,70],["eraser",290,88],["pen",395,50],["pencil",460,80],["table",555,70]],
  12: [["Grammar",160,120],["Who's that?",160,167],["He's",349,75],["She's",443,85]],
  13: [["Functions",120,120],["How are you?",118,180],["I'm fine, thank you.",316,230]],
  17: [["Functions",120,120],["Great!",118,90],["Come on!",230,116],["Let's play.",354,123],["OK.",490,55]],
  19: [["Vocabulary",120,150],["ball",120,47],["bike",180,52],["car",247,45],["computer",308,125],["doll",448,52],["train",515,64],["black",595,70],["brown",678,82],["grey",775,65],["white",855,80]],
  20: [["Grammar",120,120],["It's in",120,79],["next to",216,90],["on",323,40],["under",380,90]],
  25: [["Vocabulary",120,150],["brother",120,100],["father",236,85],["grandfather",338,153],["grandmother",508,173],["mother",696,100],["sister",811,80]],
  26: [["Grammar",160,120],["He's",160,56],["She's",235,70],["beautiful",306,117],["ugly",442,55],["happy",515,85],["sad",617,51],["old",685,46],["young",748,100]],
  31: [["Functions",120,120],["Here you are.",120,175],["Thanks.",317,100],["I'm sorry.",433,120],["That's OK.",570,125]],
  35: [["Vocabulary",120,150],["bird",120,48],["cat",185,40],["dog",243,48],["fish",308,48],["horse",376,75],["mouse",467,100],["Grammar",650,120],["They're",650,105]],
  36: [["Grammar",160,120],["It's",160,40],["They're",217,97],["big",331,45],["small",393,68],["clean",479,70],["dirty",567,60],["long",645,61],["short",724,90]],
  41: [["Vocabulary",120,150],["ears",120,60],["eyes",198,60],["face",277,60],["hair",355,58],["mouth",430,86],["nose",534,64],["teeth",615,80]],
  42: [["Grammar",160,120],["I've got",160,125],["Have you got?",315,218],["Yes, I have.",547,139],["No, I haven't.",705,156]],
  46: [["Vocabulary",160,150],["hear",160,60],["see",242,45],["smell",308,75],["taste",404,70],["touch",494,85]],
  47: [["Vocabulary",120,150],["brush",120,75],["feed",215,58],["walk",294,65],["wash",380,78]],
  49: [["Vocabulary",120,150],["crocodile",120,109],["elephant",254,105],["giraffe",384,92],["hippo",484,68],["monkey",576,96],["snake",695,71],["tiger",788,61]],
  50: [["Grammar",160,120],["They've got",164,142],["They haven't got",322,200],["arms",523,64],["feet",604,50],["hands",671,73],["legs",763,49],["tails",830,60]],
  55: [["Vocabulary",120,150],["jacket",120,83],["shoes",224,78],["skirt",324,61],["socks",407,77],["trousers",505,109],["T-shirt",636,110]],
  56: [["Grammar",160,120],["He's",160,56],["She's got",236,123],["He",402,40],["She hasn't got",460,170]],
  60: [["Vocabulary",160,150],["forest",160,78],["plain",261,65],["river",350,70]],
  65: [["Vocabulary",120,150],["play basketball",120,195],["football",332,110],["tennis",458,85],["play the guitar",565,190],["piano",775,74],["swim",870,72],["ride a bike",967,138]],
  66: [["Grammar",160,120],["I",160,24],["You",202,47],["He",270,38],["She can",329,100],["I",459,24],["You",498,48],["He",565,38],["She can't",625,122]],
  71: [["Vocabulary",120,150],["boat",120,61],["bus",201,50],["helicopter",272,139],["lorry",432,62],["motorbike",516,137],["plane",675,80]],
  72: [["Grammar",160,120],["What are you doing?",160,259],["I'm driving",445,146],["flying",608,72],["riding",700,73],["walking",791,108]],
  76: [["Vocabulary",160,150],["play table-tennis",160,203],["sail",382,55]],
  77: [["Functions",120,120],["I can help you.",120,182],["Work in teams.",323,186]],
  79: [["Vocabulary",120,150],["bathroom",120,124],["bedroom",267,117],["dining room",406,164],["hall",591,47],["kitchen",661,102],["living room",784,157]],
  80: [["Grammar",160,120],["What's he doing? What's she doing?",160,290],["He's",482,65],["She's",569,78]],
  85: [["Vocabulary",120,150],["apple",120,75],["banana",216,101],["burger",338,91],["cake",451,65],["chocolate",537,130],["ice cream",688,144],["orange",853,100]],
  86: [["Grammar",160,120],["I like",160,85],["I don't like",270,156],["Do you like?",447,190]],
  90: [["Vocabulary",160,150],["painting",160,108],["grapes",290,95],["lemon",406,85],["pear",513,63],["watermelon",597,160]],
  91: [["Vocabulary",120,150],["clean your teeth",120,208],["wash apples",350,163],["wash your hands",535,220]],
};

export const bookFooterRegions: Record<number, BookHotspot[]> = Object.fromEntries(
  Object.entries(footers).map(([page, parts]) => [page, parts.map(([word,x,width]) => ({
    word, kind: "text" as const, x:x/1259*100, y:(/^(Functions|Vocabulary|Grammar)$/.test(word)?1484:1516)/1600*100,
    width:width/1259*100, height:(/^(Functions|Vocabulary|Grammar)$/.test(word)?30:48)/1600*100,
  }))]),
);
