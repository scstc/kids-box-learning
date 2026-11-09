import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { starterLetters, starterSounds } from "./starter";
import { soundKey } from "./pronunciations";
import { audioKey } from "./course";

describe("Starter teaches alphabet names and English speech sounds", () => {
  it("covers A–Z and a complete traditional British 44-sound chart", () => {
    expect(starterLetters.map(item => item.letter).join("")).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    expect(new Set(starterSounds.map(item => item.ipa)).size).toBe(44);
    expect(starterLetters.find(item => item.letter === "G")?.ipa).toBe("dʒiː");
    expect(starterLetters.find(item => item.letter === "Z")?.ipa).toBe("zed");
    expect(starterSounds.find(item => item.ipa === "ɡ")?.example).toBe("green");
  });
  it("has offline audio for every letter name, phoneme and example", () => {
    for (const ipa of [...starterLetters, ...starterSounds].map(item => item.ipa)) {
      const bytes = readFileSync(new URL(`../../public/phonics-audio/${soundKey(ipa)}.mp3`, import.meta.url));
      expect(bytes.length, ipa).toBeGreaterThan(500);
      expect(bytes.subarray(0, 3).toString()).toBe("ID3");
    }
    for (const { example } of starterSounds) expect(readFileSync(new URL(`../../public/course-audio/${audioKey(example)}.mp3`, import.meta.url)).length, example).toBeGreaterThan(1000);
  });
});
