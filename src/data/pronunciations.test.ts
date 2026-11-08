import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { allWordEntries, audioKey } from "./course";
import { soundKey } from "./pronunciations";
import { bookHotspots } from "./bookHotspots";

describe("按实际发音学习，而不是朗读字母名", () => {
  it("每个词的拼读块都对应词内声音，连起来保留完整英式发音", () => {
    for (const { word } of allWordEntries) {
      expect(word.ipa, word.en).toBeTruthy();
      expect(word.sounds, word.en).toHaveLength(word.chunks.length);
      expect(word.sounds.join(""), word.en).toBe(
        word.ipa.replace(/[ˈˌ ]/g, ""),
      );
    }
    const giraffe = allWordEntries.find(
      ({ word }) => word.en === "giraffe",
    )!.word;
    expect(giraffe.ipa).toBe("dʒəˈrɑːf");
    expect(giraffe.sounds).toEqual(["dʒə", "rɑːf"]);
    expect(
      allWordEntries.find(({ word }) => word.en === "hippo")!.word.sounds,
    ).toEqual(["hɪp", "əʊ"]);
  });
  it("静音e和拼写分隔符没有虚构读音", () => {
    for (const en of ["snake", "cake", "bike", "five", "nose", "plane"])
      expect(
        allWordEntries.find(({ word }) => word.en === en)!.word.sounds.at(-1),
      ).toBe("");
    for (const { word } of allWordEntries)
      word.chunks.forEach((chunk, index) => {
        if (chunk === " " || chunk === "-") expect(word.sounds[index]).toBe("");
      });
  });
  it("每种有声拼读块都有独立本地MP3，离线不回退到整词或字母名", () => {
    const sounds = new Set(
      allWordEntries.flatMap(({ word }) => word.sounds).filter(Boolean),
    );
    const files = new Set<string>();
    for (const sound of sounds) {
      const key = soundKey(sound);
      expect(files.has(key)).toBe(false);
      files.add(key);
      const file = new URL(
        `../../public/phonics-audio/${key}.mp3`,
        import.meta.url,
      );
      expect(statSync(file).size, sound).toBeGreaterThan(500);
      expect(readFileSync(file).subarray(0, 3).toString(), sound).toBe("ID3");
    }
  });
  it("原书48页七个动物标签与图片点读使用对应的本地单词录音", () => {
    const expected = [
      "giraffe",
      "elephant",
      "snake",
      "hippo",
      "crocodile",
      "monkey",
      "tiger",
    ];
    expect(
      bookHotspots[48]
        .filter((item) => item.kind === "label")
        .map((item) => item.word),
    ).toEqual(expected);
    for (const en of expected)
      expect(
        bookHotspots[48].some(
          (item) => item.word === en && item.kind === "picture",
        ),
      ).toBe(true);
    for (const hotspot of bookHotspots[48]) {
      expect(hotspot.x).toBeGreaterThanOrEqual(0);
      expect(hotspot.y).toBeGreaterThanOrEqual(0);
      expect(hotspot.x + hotspot.width).toBeLessThanOrEqual(100);
      expect(hotspot.y + hotspot.height).toBeLessThanOrEqual(100);
      expect(
        statSync(
          new URL(
            `../../public/course-audio/${audioKey(hotspot.word)}.mp3`,
            import.meta.url,
          ),
        ).size,
      ).toBeGreaterThan(1000);
    }
  });
  it("12个单元主要词语页都有完整点读标签，宠物页不再遗漏horse等词", () => {
    const expected: Record<number, string[]> = {
      4: ["Mr Star", "Mrs Star", "Stella", "Simon", "Suzy"],
      10: ["book", "chair", "table", "eraser", "pen", "pencil"],
      18: ["doll", "computer", "ball", "bike", "train", "car"],
      24: [
        "sister",
        "brother",
        "grandfather",
        "father",
        "mother",
        "grandmother",
      ],
      34: ["horse", "cat", "dog", "fish", "mouse", "bird"],
      40: ["hair", "eye", "face", "teeth", "mouth", "ear", "nose"],
      48: [
        "giraffe",
        "elephant",
        "snake",
        "hippo",
        "crocodile",
        "monkey",
        "tiger",
      ],
      54: ["T-shirt", "skirt", "socks", "shoes", "jacket", "trousers"],
      64: [
        "play basketball",
        "play the piano",
        "play the guitar",
        "play tennis",
        "swim",
        "play football",
        "ride a bike",
      ],
      70: ["lorry", "motorbike", "bus", "boat", "plane", "helicopter"],
      78: [
        "bathroom",
        "bedroom",
        "living room",
        "dining room",
        "kitchen",
        "hall",
      ],
      84: ["ice cream", "apple", "cake", "burger", "banana", "chocolate"],
    };
    for (const [page, words] of Object.entries(expected))
      expect(
        bookHotspots[Number(page)]
          .filter((point) => point.kind === "label")
          .map((point) => point.word)
          .sort(),
      ).toEqual([...words].sort());
    for (const hotspot of Object.values(bookHotspots).flat()) {
      expect(hotspot.x).toBeGreaterThanOrEqual(0);
      expect(hotspot.y).toBeGreaterThanOrEqual(0);
      expect(hotspot.x + hotspot.width).toBeLessThanOrEqual(100);
      expect(hotspot.y + hotspot.height).toBeLessThanOrEqual(100);
      expect(
        statSync(
          new URL(
            `../../public/course-audio/${audioKey(hotspot.word)}.mp3`,
            import.meta.url,
          ),
        ).size,
      ).toBeGreaterThan(1000);
    }
  });
});
