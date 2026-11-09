import { describe, expect, it } from "vitest";
import { courseUnits } from "./course";
import { animals } from "./animals";
import { additionalBookSections } from "./bookActivities";
import { bookScenes } from "./bookScenes";

describe("English immersion across learning activities", () => {
  it("keeps descriptions, phonics tips and scene labels in English", () => {
    const copy = [
      ...courseUnits.flatMap(unit => [unit.description, ...unit.words.map(word => word.tip), ...unit.sentences.map(sentence => sentence.tip)]),
      ...animals.flatMap(animal => [animal.fact, animal.rule, animal.ruleLabel, ...animal.parts.map(part => part.tip)]),
      ...additionalBookSections.flatMap(section => [section.title, section.description]),
      ...Object.values(bookScenes).flatMap(scene => scene.answers.map(answer => answer.label)),
    ];
    for (const text of copy) {
      expect(text.trim().length).toBeGreaterThan(0);
      expect(text).not.toMatch(/[\p{Script=Han}]/u);
    }
  });
});
