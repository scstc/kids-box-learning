import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allWordEntries, audioKey } from "./course";
import { practiceWords, practiceAudioItems, wordAudioPath } from "./practiceAudio";
import { recordedWordGuide, recordedSoundPath, recordedWords } from "./cambridgePronunciation";
import catalog from "./cambridgePronunciation.json";
import manifest from "../../public/cambridge-audio/manifest.json";
import recipe from "../../scripts/cambridge-recordings.json";

describe("exact offline British dictionary pronunciation", () => {
  it("covers every non-name word without changing the twelve book characters", () => {
    expect(catalog.excludedNames.sort()).toEqual([
      "alex", "lenny", "lily", "marie", "maskman", "meera", "monty", "mr-star", "mrs-star", "simon", "stella", "suzy",
    ]);
    expect(Object.keys(recordedWords)).toHaveLength(169);
    for (const { text } of practiceWords) {
      const id = audioKey(text);
      if (catalog.excludedNames.includes(id)) {
        expect(recordedWordGuide(id), text).toBeUndefined();
        expect(wordAudioPath(text), text).toBe(`word-audio/${id}.mp3`);
      } else {
        const guide = recordedWordGuide(id)!;
        expect(guide, text).toBeDefined();
        expect(guide.sounds.join(""), text).toBe(guide.ipa.replace(/[ˈˌ .]/g, ""));
        for (const sound of guide.sounds) expect(readFileSync(new URL(`../../public/${recordedSoundPath(sound)}`, import.meta.url)).length).toBeGreaterThan(500);
      }
    }
    // Names keep their spelling/chunk guides as well as their whole-word audio.
    for (const { word } of allWordEntries.filter(({ word }) => catalog.excludedNames.includes(word.id))) {
      expect(word.sounds).toHaveLength(word.chunks.length);
    }
  });

  it("uses source-specific UK sounds, noun senses and isolated-word pronunciations", () => {
    expect(recordedWordGuide("giraffe")).toMatchObject({ ipa: "dʒɪˈrɑːf", sounds: ["dʒ", "ɪ", "r", "ɑː", "f"] });
    expect(recordedWordGuide("house")).toMatchObject({ ipa: "haʊs", sounds: ["h", "aʊ", "s"] });
    expect(recordedWordGuide("car")).toMatchObject({ ipa: "kɑː", sounds: ["k", "ɑː"] });
    expect(recordedWordGuide("reading")?.ipa).toBe("ˈriːdɪŋ");
    expect(recordedWordGuide("feet")?.sounds).toEqual(["f", "iː", "t"]);
    expect(recordedWordGuide("foot")?.sounds).toEqual(["f", "ʊ", "t"]);
    expect(recordedWordGuide("t-shirt")?.source).toBe("dictionary");
  });

  it("preserves exact forms when no valid publisher whole-word recording exists", () => {
    const fallbacks = Object.entries(recordedWords).filter(([, guide]) => guide.source === "practice");
    expect(fallbacks.map(([id]) => id).sort()).toEqual([
      "ears", "eating", "eyes", "hands", "heads", "legs", "mouths", "next-to", "noses",
      "play-basketball", "play-football", "play-tennis", "play-the-guitar", "play-the-piano",
      "playing", "ride-a-bike", "shoes", "socks", "tails", "watching",
    ]);
    for (const [id, guide] of fallbacks) {
      expect(guide.audio).toBeNull();
      expect(wordAudioPath(id)).toBe(`word-audio/${id}.mp3`);
    }
  });

  it("ships original UK publisher bytes and keeps old generators away from them", () => {
    expect(Object.keys(manifest.files)).toHaveLength(196);
    expect(Object.keys(catalog.sounds)).toHaveLength(47);
    expect(Object.values(recordedWords).filter(guide => guide.source === "dictionary")).toHaveLength(149);
    for (const [path, record] of Object.entries(manifest.files)) {
      expect(record.sha256).toBe((recipe.files as Record<string, { sha256: string }>)[path].sha256);
      expect(record.url, path).toMatch(/^https:\/\/dictionary\.cambridge\.org\/media\/english\/uk_(pron|phonetic)\//);
      expect(record.sourcePage).toMatch(/^https:\/\/dictionary\.cambridge\.org\/pronunciation\/english\//);
      const bytes = readFileSync(new URL(`../../public/${path}`, import.meta.url));
      expect(bytes.length, path).toBe(record.bytes);
      expect(createHash("sha256").update(bytes).digest("hex"), path).toBe(record.sha256);
      expect(record.seconds).toBeGreaterThan(0.08);
      expect(record.seconds).toBeLessThan(20);
    }
    expect(practiceAudioItems().some(item => item.path.startsWith("cambridge-audio/"))).toBe(false);
    expect(() => recordedSoundPath("not-a-sound")).toThrow("Missing recorded Cambridge sound");
  });
});
