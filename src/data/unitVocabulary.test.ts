import { describe, expect, it } from "vitest";
import { allWordEntries, audioKey, courseUnits, makeCourseChoices } from "./course";
import { bookFlashcards } from "./bookMedia";
import { bookWordLabels } from "./bookWordLabels";
import { bookFooterRegions } from "./bookFooterRegions";
import { bookReadingRegions } from "./bookReadingRegions";
import { unitStartPages } from "./bookActivities";
import { originalWordArt } from "./originalArt";
import { readCourseProgress } from "../hooks/useCourseProgress";

describe("Word explorer follows all twelve textbook units", () => {
  it("includes the book labels, flashcards, phonics words and activity word banks", () => {
    const headings = new Set(["Functions", "Vocabulary", "Grammar", "I", "You", "He", "She"]);
    for (const unit of courseUnits) {
      const start = unitStartPages[unit.id - 1];
      const expected = bookFlashcards.filter(card => card.unitId === unit.id).map(card => card.name);
      for (let page = start; page < start + 6; page++) {
        expected.push(...(bookWordLabels[page] ?? []).map(label => label.word));
        expected.push(...(bookFooterRegions[page] ?? []).filter(item => /^[a-z]+(?:-[a-z]+)?$/i.test(item.word) && !headings.has(item.word)).map(item => item.word));
        expected.push(...(bookReadingRegions[page] ?? []).filter(item => /^[a-z]+(?:[ -][a-z]+){0,3}$/.test(item.word)).map(item => item.word));
      }
      const actual = new Set(unit.words.map(word => audioKey(word.en)));
      for (const word of expected) expect(actual.has(audioKey(word)), `Unit ${unit.id}: ${word}`).toBe(true);
    }
  });
  it("teaches singular and plural body parts as distinct words with distinct pictures", () => {
    const unit = courseUnits.find(unit => unit.id === 7)!;
    for (const [single, plural] of [["foot", "feet"], ["hand", "hands"], ["arm", "arms"], ["leg", "legs"], ["tail", "tails"]]) {
      const first = unit.words.find(word => word.en === single)!;
      const second = unit.words.find(word => word.en === plural)!;
      expect(first, single).toBeTruthy(); expect(second, plural).toBeTruthy();
      expect(first.ipa).not.toBe(second.ipa);
      expect(originalWordArt[`7:${single}`].file).not.toBe(originalWordArt[`7:${plural}`].file);
    }
  });
  it("keeps existing footprints and avoids indistinguishable listening choices", () => {
    const saved = { learned: ["7:giraffe", "7:tail", "8:jacket"], mistakes: ["6:ear"], lastUnit: 7 };
    expect(readCourseProgress(JSON.stringify(saved))).toEqual(saved);
    for (const answer of allWordEntries) {
      const pool = allWordEntries.filter(entry => entry.unitId === answer.unitId);
      const options = makeCourseChoices(answer, pool);
      expect(options).toHaveLength(3);
      const pictures = options.map(entry => originalWordArt[`${entry.unitId}:${entry.word.id}`]?.file).filter(Boolean);
      expect(new Set(pictures).size, answer.word.en).toBe(pictures.length);
    }
  });
});
