import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { starterLetters, starterSounds } from "./starter";
import { ipaAudioPath, soundAudioPath } from "./practiceAudio";

const manifest = JSON.parse(readFileSync(new URL("../../public/ipa-audio/manifest.json", import.meta.url), "utf8"));

describe("recorded teaching sounds for Starter", () => {
  it("keeps all 44 isolated recordings distinct from letter names", () => {
    expect(manifest.kind).toBe("recorded-teaching-excerpts");
    expect(Object.keys(manifest.files).sort()).toEqual(starterSounds.map(({ ipa }) => ipaAudioPath(ipa)).sort());
    for (const { ipa } of starterLetters) expect(ipaAudioPath(ipa)).not.toBe(soundAudioPath(ipa));
    for (const { ipa } of starterSounds) {
      const record = manifest.files[ipaAudioPath(ipa)];
      expect(record.ipa).toBe(ipa);
      // The source's example word comes after a long pause and must be excluded.
      expect(record.end).toBeLessThan(record.exampleStart - 1);
      expect(record.seconds).toBeGreaterThan(.2);
      expect(record.seconds).toBeLessThan(2);
      const bytes = readFileSync(new URL(`../../public/${ipaAudioPath(ipa)}`, import.meta.url));
      expect(bytes.includes(Buffer.from("Pronunciation Studio")), ipa).toBe(true);
      expect(bytes.includes(Buffer.from("eSpeak")), ipa).toBe(false);
      expect(createHash("sha256").update(bytes).digest("hex"), ipa).toBe(record.sha256);
    }
  });

  it("matches chart cells rather than assuming consecutive audio filenames", () => {
    const cases = [
      ["ɪ", "tip", "SOUND%202.mp3"], ["e", "met", "SOUND%203.mp3"],
      ["æ", "pan", "SOUND%205.mp3"], ["ʊ", "shook", "SOUND%2011.mp3"],
      ["uː", "moon", "SOUND%206.mp3"], ["ʊə", "curious", "SOUND%2020.mp3"],
      ["ɔɪ", "choice", "SOUND%2019.mp3"], ["tʃ", "choose", "SOUND%2036.mp3"],
      ["dʒ", "jet", "SOUND%2037.mp3"], ["w", "watch", "SOUND%2038.mp3"],
    ];
    for (const [ipa, keyword, file] of cases) {
      const record = manifest.files[ipaAudioPath(ipa)];
      expect(record.sourceKeyword, ipa).toBe(keyword);
      expect(record.sourceUrl.endsWith(file), ipa).toBe(true);
    }
  });
});
