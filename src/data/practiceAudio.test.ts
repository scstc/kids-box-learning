import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allWordEntries } from "./course";
import { starterLetters, starterSounds } from "./starter";
import { practiceAudioItems, wordAudioPath, soundAudioPath } from "./practiceAudio";
import { phonicsInput, copyPhonicsSamples } from "../../scripts/phonics-input";

describe("offline pronunciation sources", () => {
  it("routes course words and Starter examples to natural speech, preserving conversations", () => {
    for (const text of [
      ...allWordEntries.map(({ word }) => word.en),
      ...starterSounds.map(({ example }) => example),
    ]) expect(wordAudioPath(text), text).toMatch(/^word-audio\//);
    expect(wordAudioPath("foot")).toBe("word-audio/foot.mp3");
    // Longer book conversations keep their existing recordings.
    expect(wordAudioPath("Who's that?")).toBe("course-audio/who-s-that.mp3");
  });

  it("packages the complete corpus from its intended speech and phoneme sources", () => {
    const manifest = JSON.parse(readFileSync(new URL("../../public/word-audio/manifest.json", import.meta.url), "utf8"));
    expect(manifest.recipes.natural.voice).toBe("en-GB-SoniaNeural");
    expect(manifest.recipes.phonics.voice).toBe("en+f3");
    expect(manifest.recipes.natural.accent).toBe("en-GB");
    expect(manifest.recipes.phonics.accent).toBe("en-GB");
    const items = practiceAudioItems();
    expect(new Set(items.map(item => item.path)).size).toBe(items.length);
    expect(Object.keys(manifest.files).sort()).toEqual(items.map(item => item.path).sort());
    for (const { path, ipa, text, kind } of items) {
      const record = manifest.files[path];
      expect(record.ipa, path).toBe(ipa);
      expect(record.kind, path).toBe(kind);
      expect(record.recipe, path).toBe(kind === "phonics" ? "phonics" : "natural");
      expect(record.input, path).toBe(kind === "phonics" ? phonicsInput(ipa) : `${text}.`);
      const bytes = readFileSync(new URL(`../../public/${path}`, import.meta.url));
      expect(bytes.subarray(0, 3).toString(), path).toBe("ID3");
      expect(bytes.includes(Buffer.from(kind === "phonics" ? "eSpeak NG en+f3" : "en-GB-SoniaNeural")), path).toBe(true);
      expect(createHash("sha256").update(bytes).digest("hex"), path).toBe(record.sha256);
      expect(record.seconds, path).toBeGreaterThan(0.08);
    }
  });

  it("uses spoken letter names for all 26 letters, including British Z", () => {
    for (const { letter, ipa } of starterLetters) {
      expect(practiceAudioItems().find(item => item.path === soundAudioPath(ipa)))
        .toMatchObject({ kind: "letter", text: letter, ipa });
    }
    expect(starterLetters.find(item => item.letter === "Z")?.ipa).toBe("zed");
  });

  it("preserves actual phonemes for foot and skips silent letters", () => {
    const foot = allWordEntries.find(({ word }) => word.en === "foot")!.word;
    expect(foot.sounds).toEqual(["f", "ʊ", "t"]);
    expect(foot.sounds.map(soundAudioPath)).toEqual([
      "phonics-audio/66.mp3", "phonics-audio/28a.mp3", "phonics-audio/74.mp3",
    ]);
    expect(practiceAudioItems().some(item => item.ipa === "")).toBe(false);
    // No extra vowel or letter-name text may be added to these short sounds.
    expect(["f", "ʊ", "t"].map(phonicsInput)).toEqual(["[[f]]", "[[U]]", "[[t]]"]);
    expect(phonicsInput("ʊə")).toBe("[[U@]]");
    expect(phonicsInput("dʒə")).toBe("[[dZ@]]");
    expect(phonicsInput("rɑːf")).toBe("[[rA:f]]");
    expect(() => phonicsInput("")).toThrow("Silent chunks");
    expect(() => phonicsInput("?")).toThrow("Unmapped IPA");
  });

  it("retains earlier speech samples when the synthesis callback reuses its buffer", () => {
    const memory = new Int16Array([100, -200, 300, -400]);
    const first = copyPhonicsSamples(memory.subarray(1, 3));
    memory.fill(0);
    expect(first.readInt16LE(0)).toBe(-200);
    expect(first.readInt16LE(2)).toBe(300);
  });
});
