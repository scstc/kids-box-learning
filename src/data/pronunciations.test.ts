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
});
