import { describe, expect, it } from "vitest";
import { bookHotspots } from "./bookHotspots";
import { bookFooterRegions } from "./bookFooterRegions";
import { bookReadingRegions } from "./bookReadingRegions";
import { bookAudioReferences } from "./bookAudio";
import { bookTouchTargets } from "./bookTouchTargets";

type Landmark = [text: string, points: [number, number][]];
// Measured from the printed JPG glyphs, independently of the clickable boxes.
// Reference pages include left, middle, right, top and bottom ink samples.
const footerLandmarks: Record<number, Landmark[]> = {
  12: [
    ["Grammar",[[184,1500],[224.5,1500],[265,1500]]],
    ["Who's that?",[[170,1540],[238,1540],[306,1540]]],
    ["He's",[[343,1540],[363.5,1540],[384,1540]]],
    ["She's",[[455,1540],[479,1540],[503,1540]]],
  ],
  20: [
    ["Grammar",[[183,1500],[225.5,1500],[268,1500]]],
    ["It's in",[[172,1540],[197,1540],[222,1540]]],
    ["next to",[[254,1540],[291.5,1540],[329,1540]]],
    ["on",[[360,1540],[370.5,1540],[381,1540]]],
    ["under",[[413,1540],[443,1540],[473,1540]]],
  ],
  26: [
    ["Grammar",[[183,1500],[223.5,1500],[264,1500]]],
    ["He's",[[172,1540],[192,1540],[212,1540]]],
    ["She's",[[243,1540],[266.5,1540],[290,1540]]],
    ["beautiful",[[306,1540],[351.5,1540],[397,1540]]],
    ["ugly",[[429,1540],[448.5,1540],[468,1540]]],
    ["happy",[[500,1540],[531,1540],[562,1540]]],
    ["sad",[[594,1540],[609.5,1540],[625,1540]]],
    ["old",[[657,1540],[671,1540],[685,1540]]],
    ["young",[[717,1540],[751.5,1540],[786,1540]]],
  ],
  35: [
    ["Grammar",[[666,1500],[706.5,1500],[747,1500]]],
    ["They're",[[657,1540],[696.5,1540],[736,1540]]],
  ],
  36: [
    ["Grammar",[[180,1500],[226,1500],[272,1500]]],
    ["It's",[[170,1537],[183,1537],[196,1537]]],
    ["They're",[[219,1537],[260.5,1537],[302,1537]]],
    ["big",[[314,1537],[329,1537],[344,1537]]],
    ["small",[[372,1537],[400,1537],[428,1537]]],
    ["clean",[[455,1537],[483,1537],[511,1537]]],
    ["dirty",[[539,1537],[564.5,1537],[590,1537]]],
    ["long",[[619,1537],[641.5,1537],[664,1537]]],
    ["short",[[691,1537],[723,1537],[755,1537]]],
  ],
  42: [
    ["Grammar",[[180,1500],[226,1500],[272,1500]]],
    ["I've got",[[170,1537],[226.5,1537],[283,1537]]],
    ["Have you got?",[[318,1537],[424,1537],[530,1537]]],
    ["Yes, I have.",[[558,1537],[617.5,1537],[677,1537]]],
    ["No, I haven't.",[[708,1537],[780.5,1537],[853,1537]]],
  ],
  50: [
    ["Grammar",[[181,1500],[225,1500],[270,1500]]],
    ["They've got",[[168,1540],[235,1540],[302,1540]]],
    ["They haven't got",[[323,1540],[420,1540],[517,1540]]],
    ["arms",[[527,1540],[555,1540],[582,1540]]],
    ["feet",[[608,1540],[629,1540],[649,1540]]],
    ["hands",[[675,1540],[707,1540],[739,1540]]],
    ["legs",[[767,1540],[787,1540],[807,1540]]],
    ["tails",[[834,1540],[859,1540],[884,1540]]],
  ],
  56: [
    ["Grammar",[[181,1500],[225,1500],[270,1500]]],
    ["He's",[[169,1540],[192,1540],[214,1540]]],
    ["She's got",[[241,1540],[291,1540],[340,1540]]],
    ["He",[[407,1540],[422,1540],[437,1540]]],
    ["She hasn't got",[[464,1540],[544,1540],[624,1540]]],
  ],
  66: [
    ["Grammar",[[180,1500],[226,1500],[272,1500]]],
    ["I",[[170,1537],[170.5,1537],[171,1537]]],
    ["You",[[194,1537],[213.5,1537],[233,1537]]],
    ["He",[[262,1537],[276.5,1537],[291,1537]]],
    ["She can",[[318,1537],[373.5,1537],[429,1537]]],
    ["I",[[460,1537],[460.5,1537],[461,1537]]],
    ["You",[[484,1537],[503.5,1537],[523,1537]]],
    ["He",[[552,1537],[566.5,1537],[581,1537]]],
    ["She can't",[[608,1537],[671,1537],[734,1537]]],
  ],
  72: [
    ["Grammar",[[180,1500],[226,1500],[272,1500]]],
    ["What are you doing?",[[168,1537],[292.5,1537],[417,1537]]],
    ["I'm driving",[[450,1537],[507.5,1537],[565,1537]]],
    ["flying",[[593,1537],[622.5,1537],[652,1537]]],
    ["riding",[[680,1537],[710.5,1537],[741,1537]]],
    ["walking",[[768,1537],[814,1537],[860,1537]]],
  ],
  80: [
    ["Grammar",[[181,1500],[225,1500],[270,1500]]],
    ["What's he doing? What's she doing?",[[168,1540],[309,1540],[431,1540]]],
    ["He's",[[464,1540],[486,1540],[508,1540]]],
    ["She's",[[535,1540],[561,1540],[587,1540]]],
  ],
  86: [
    ["Grammar",[[181,1500],[225,1500],[270,1500]]],
    ["I like",[[169,1540],[205,1540],[245,1540]]],
    ["I don't like",[[274,1540],[345,1540],[415,1540]]],
    ["Do you like?",[[445,1540],[533,1540],[621,1540]]],
  ],
};
const referenceLandmarks: Record<number, Landmark[]> = {
  94: [
    ["What's your name?",[[159,174],[330,186],[500,182],[489,171],[307,210]]],
    ["I'm Suzy.",[[667,189],[739,189],[811,196],[679,170],[793,209]]],
    ["How old are you?",[[162,242],[321,242],[472,232],[460,223],[395,262]]],
    ["I'm three.",[[667,237],[746,237],[825,249],[746,223],[746,251]]],
    ["I'm = I am.",[[145,302],[213,305],[289,302],[230,290],[255,315]]],
    ["Who's he?",[[159,367],[249,375],[339,374],[327,364],[258,394]]],
    ["He's Alex.",[[667,378],[750,389],[833,389],[761,364],[750,392]]],
    ["How old is she?",[[162,431],[296,430],[430,427],[420,416],[296,446]]],
    ["She's seven.",[[665,424],[762,430],[859,441],[729,416],[765,445]]],
    ["He's = he is.",[[144,492],[223,495],[302,500],[241,480],[190,505]]],
    ["She's = she is.",[[342,492],[435,495],[528,499],[467,480],[454,505]]],
    ["That's = that is.",[[566,491],[672,495],[779,500],[703,480],[695,505]]],
    ["Where's the ball?",[[159,557],[314,568],[461,565],[451,554],[321,584]]],
    ["It's next to the chair.",[[705,568],[880,568],[1055,580],[915,554],[875,583]]],
    ["It isn't under the table.",[[705,620],[896,620],[1088,631],[876,606],[895,634]]],
    ["Is your ball in your bag?",[[162,694],[370,703],[581,683],[569,675],[411,714]]],
    ["Where's = where is.",[[142,751],[279,751],[416,753],[238,742],[301,766]]],
    ["Isn't = is not.",[[457,754],[540,751],[634,764],[498,742],[555,766]]],
    ["We're happy.",[[159,817],[277,834],[387,842],[277,816],[320,853]]],
    ["We aren't ugly.",[[500,818],[633,834],[763,841],[653,816],[710,853]]],
    ["Are we small?",[[840,845],[962,831],[1085,825],[1073,816],[958,846]]],
    ["We're = we are.",[[142,895],[249,899],[362,897],[188,885],[269,909]]],
    ["Aren't = are not.",[[402,898],[514,894],[636,907],[471,884],[534,909]]],
    ["They're long.",[[159,961],[270,977],[382,985],[250,958],[238,996]]],
    ["They aren't big.",[[500,962],[633,972],[767,983],[680,958],[578,996]]],
    ["Are they short?",[[840,987],[977,978],[1115,968],[1103,959],[978,998]]],
    ["I, you, we've got purple hair.",[[162,1091],[417,1088],[673,1099],[291,1072],[486,1111]]],
    ["Have you got a small mouth?",[[162,1160],[416,1155],[670,1152],[660,1141],[350,1180]]],
    ["Yes, I have.",[[775,1142],[861,1157],[963,1167],[860,1141],[837,1174]]],
    ["No, I haven't.",[[778,1209],[890,1209],[1003,1218],[878,1193],[834,1226]]],
    ["I've got = I have got.",[[145,1272],[295,1272],[439,1278],[155,1256],[211,1289]]],
    ["Haven't = have not.",[[478,1268],[609,1271],[750,1278],[566,1256],[625,1281]]],
    ["They've got big mouths.",[[159,1333],[361,1356],[571,1356],[376,1330],[408,1368]]],
    ["They haven't got tails.",[[670,1333],[860,1342],[1050,1357],[872,1330],[908,1368]]],
    ["Have they got long legs?",[[162,1418],[376,1415],[590,1409],[579,1399],[361,1438]]],
    ["They've got = they have got.",[[143,1480],[348,1479],[551,1491],[363,1469],[398,1501]]],
    ["Haven't got = have not got.",[[590,1485],[781,1485],[982,1491],[797,1469],[714,1501]]],
  ],
  95: [
    ["She's got your red trousers.",[[182,192],[419,183],[657,195],[191,169],[355,208]]],
    ["He hasn't got a white ball.",[[694,188],[920,183],[1145,196],[837,169],[877,208]]],
    ["Has he or she got a train?",[[184,257],[384,257],[585,247],[574,238],[387,277]]],
    ["Yes, he or she has.",[[692,239],[825,254],[957,264],[823,238],[754,271]]],
    ["No, he or she hasn't.",[[694,302],[845,302],[997,316],[841,290],[751,323]]],
    ["He's got = he has got.",[[166,372],[321,372],[474,378],[322,356],[237,389]]],
    ["She's got = she has got.",[[513,371],[682,370],[850,378],[698,356],[599,389]]],
    ["Hasn't got = has not got.",[[166,415],[338,415],[522,421],[354,399],[270,431]]],
    ["I",[[184,493],[206,503],[227,504],[187,479],[206,507]]],
    ["can sing.",[[523,498],[864,495],[935,504],[880,481],[913,516]]],
    ["can't play the guitar.",[[523,549],[864,549],[1120,557],[585,530],[865,569]]],
    ["Can you ride a bike?",[[182,615],[361,618],[540,609],[529,599],[277,638]]],
    ["Can't = cannot.",[[165,681],[276,682],[376,688],[219,666],[283,691]]],
    ["What are you doing?",[[181,743],[367,759],[553,751],[543,740],[367,779]]],
    ["I'm flying.",[[824,759],[903,766],[983,766],[900,740],[911,778]]],
    ["Are you flying your helicopter?",[[181,838],[452,830],[722,821],[712,810],[448,850]]],
    ["What's he or she doing?",[[181,928],[366,937],[551,935],[539,925],[518,964]]],
    ["He's or she's listening to music.",[[680,943],[921,943],[1162,950],[826,924],[981,962]]],
    ["What are they doing?",[[181,980],[372,991],[564,987],[552,977],[425,1016]]],
    ["They're sitting on the sofa.",[[677,979],[906,995],[1136,1002],[1009,976],[908,1014]]],
    ["Is he or she listening to music?",[[183,1109],[355,1074],[528,1068],[271,1046],[272,1127]]],
    ["Yes, he or she is.",[[677,1047],[792,1062],[908,1072],[806,1046],[739,1079]]],
    ["No, he or she isn't.",[[680,1114],[814,1116],[948,1124],[805,1098],[736,1131]]],
    ["What's = what is.",[[164,1175],[284,1180],[404,1185],[243,1165],[307,1190]]],
    ["I like cake.",[[184,1253],[274,1256],[358,1264],[227,1239],[279,1267]]],
    ["I don't like chocolate.",[[680,1253],[868,1258],[1042,1264],[888,1239],[959,1268]]],
    ["Do you like snakes?",[[184,1327],[354,1326],[525,1317],[515,1307],[257,1347]]],
    ["Yes, I do.",[[678,1308],[760,1323],[829,1333],[760,1307],[739,1340]]],
    ["No, I don't.",[[680,1376],[778,1377],[870,1385],[844,1359],[736,1393]]],
    ["Don't = do not.",[[165,1437],[266,1432],[376,1445],[292,1423],[306,1448]]],
  ],
};
const silentPoints: Record<number, [number, number][]> = {"12":[[326,1540],[435,1540]],"20":[[237.5,1540],[344.5,1540],[397.5,1540]],"26":[[227.5,1540],[412.5,1540],[484.5,1540],[578.5,1540],[641.5,1540],[701,1540]],"35":[[610,1540]],"36":[[209.5,1537],[358.5,1537],[441.5,1537],[525.5,1537],[604.5,1537],[678,1537]],"42":[],"50":[[315,1540],[595,1540],[662,1540],[753,1540],[822,1540]],"56":[[228,1540],[451,1540],[365,1540],[380,1540],[648,1540]],"66":[[185.5,1537],[247.5,1537],[305,1537],[475.5,1537],[537.5,1537],[594.5,1537]],"72":[[579.5,1537],[665.5,1537],[755.5,1537]],"80":[[454,1540],[522,1540],[602,1540],[632,1540]],"86":[[258,1540],[433,1540]]};
const viewports = [[1024,768],[800,1280],[390,844],[844,390]];

function hitTest(page: number, viewportWidth: number, viewportHeight: number) {
  const scale = Math.min(viewportWidth / 1259, (viewportHeight - (viewportWidth <= 1000 ? 128 : 76)) / 1600);
  const width = 1259 * scale, height = 1600 * scale;
  const regions = [...bookHotspots[page], ...bookAudioReferences.filter(track => track.page === page)
    .map(track => ({ ...track, word: "CD" + track.disc + "/" + track.track, kind: "picture" as const }))];
  const minimums = bookTouchTargets(regions, width, height);
  const boxes = regions.map((region,index) => ({ word: region.word, x: region.x/100*width, y: region.y/100*height,
    width: Math.max(region.width/100*width,minimums[index].minWidth), height: Math.max(region.height/100*height,minimums[index].minHeight) }));
  return (x: number, y: number) => boxes.filter(box => x*scale >= box.x && x*scale < box.x+box.width && y*scale >= box.y && y*scale < box.y+box.height).at(-1)?.word;
}

describe("printed Grammar targets stay on their own words", () => {
  it("covers every reviewed Grammar footer and both complete reference pages", () => {
    const grammarPages = Object.entries(bookFooterRegions).filter(([,regions]) => regions.some(region => region.word === "Grammar")).map(([page]) => Number(page));
    expect(grammarPages).toEqual(Object.keys(footerLandmarks).map(Number));
    for (const page of grammarPages) {
      const regions = bookFooterRegions[page];
      expect(regions.slice(regions.findIndex(region => region.word === "Grammar")).map(region => region.word)).toEqual(footerLandmarks[page].map(([word]) => word));
    }
    for (const [page,landmarks] of Object.entries(referenceLandmarks))
      expect(bookReadingRegions[Number(page)].map(region => region.word)).toEqual(landmarks.map(([word]) => word));
  });
  it("reads complete footer glyphs without stealing neighbouring alternatives or slashes", () => {
    for (const [width,height] of viewports) for (const [page,landmarks] of Object.entries(footerLandmarks)) {
      const hit = hitTest(Number(page),width,height);
      for (const [word,points] of landmarks) for (const [x,y] of points)
        expect(hit(x,y), width + "×" + height + " P" + page + ": " + word + " at " + x + "," + y).toBe(word);
      for (const [x,y] of silentPoints[Number(page)] ?? [])
        expect(hit(x,y), "P" + page + ": separator at " + x + "," + y).toBeUndefined();
    }
  });
  it("keeps the edges of all reference sentences clickable, including the missing question and pronoun", () => {
    for (const [width,height] of viewports) for (const [page,landmarks] of Object.entries(referenceLandmarks)) {
      const hit = hitTest(Number(page),width,height);
      for (const [word,points] of landmarks) for (const [x,y] of points)
        expect(hit(x,y), width + "×" + height + " P" + page + ": " + word + " at " + x + "," + y).toBe(word);
    }
  });
});
