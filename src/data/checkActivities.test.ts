import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  placementQuestions, placementQuestionsForUnit,
  sentenceQuestions, sentenceQuestionsForUnit,
  pictureFixQuestions, pictureFixQuestionsForUnit,
} from "./checkActivities";
import { originalWordArt } from "./originalArt";
import { courseUnits } from "./course";
import { wordAudioPath } from "./practiceAudio";

describe("understand, build and correct with the book's pictures", () => {
  it("provides two exercises of every form in every unit without duplicate IDs", () => {
    const all = [...placementQuestions, ...sentenceQuestions, ...pictureFixQuestions];
    expect(all).toHaveLength(72);
    expect(new Set(all.map(question => question.id)).size).toBe(all.length);
    for (const questionsForUnit of [placementQuestionsForUnit, sentenceQuestionsForUnit, pictureFixQuestionsForUnit]) {
      for (let unitId = 1; unitId <= 12; unitId++) expect(questionsForUnit(unitId), `Unit ${unitId}`).toHaveLength(2);
      expect(questionsForUnit(0)).toEqual([]);
      expect(questionsForUnit(13)).toEqual([]);
    }
  });

  it("checks both the requested picture and its location using real book images", () => {
    expect(new Set(placementQuestions.map(question => question.relation))).toEqual(new Set(["on", "under", "next-to"]));
    for (const question of placementQuestions) {
      expect(question.items).toHaveLength(3);
      expect(new Set(question.items.map(item => item.id)).size, question.id).toBe(3);
      expect(question.items.filter(item => item.id === question.answerId), question.id).toHaveLength(1);
      for (const item of question.items) {
        const word = courseUnits[question.unitId - 1].words.find(word => word.id === item.id);
        expect(word?.en, `${question.id}: ${item.id}`).toBe(item.en);
        const art = originalWordArt[`${question.unitId}:${item.id}`];
        expect(art, `${question.id}: ${item.id}`).toBeDefined();
        expect(readFileSync(new URL(`../../public/${art.file}`, import.meta.url)).length).toBeGreaterThan(1000);
      }
      expect(originalWordArt[`2:${question.anchorId}`]).toBeDefined();
      // An ON target above a chair back would teach the wrong spatial meaning.
      if (question.relation === "on") expect(question.anchorId).toBe("table");
      expect(question.prompt).toContain(question.relation.replace("-", " "));
    }
  });

  it("builds complete replies from ordered tiles without another equally valid age/name", () => {
    for (const question of sentenceQuestions) {
      expect(question.answer.length).toBeGreaterThanOrEqual(2);
      expect(question.answer.length).toBeLessThanOrEqual(4);
      expect(question.answer.join(" "), question.id).toBe(question.sentence);
      expect(question.sentence, question.id).toMatch(/[.!?]$/);
      for (const wrong of question.distractors ?? []) expect(question.answer).not.toContain(wrong);
    }
    expect(sentenceQuestionsForUnit(1).find(question => question.prompt === "What's your name?")?.sentence).toBe("My name is Suzy.");
    const age = sentenceQuestionsForUnit(1).find(question => question.prompt === "How old are you?")!;
    expect(age.sentence).toBe("I'm three.");
    expect(age.distractors ?? []).toEqual([]);
    expect(sentenceQuestionsForUnit(6).find(question => question.prompt.startsWith("Have you got"))?.answer).toEqual(["No,", "I", "haven't."]);
    expect(sentenceQuestionsForUnit(8).find(question => question.prompt.startsWith("Has she got"))?.answer).toEqual(["Yes,", "she", "has."]);
  });

  it("judges visibly checked picture facts and supplies exactly one complete correction", () => {
    expect(pictureFixQuestions.filter(question => question.isTrue)).toHaveLength(12);
    expect(pictureFixQuestions.filter(question => !question.isTrue)).toHaveLength(12);
    for (const question of pictureFixQuestions) {
      expect(originalWordArt[`${question.unitId}:${question.imageId}`], question.id).toBeDefined();
      expect(question.options).toHaveLength(3);
      expect(new Set(question.options).size, question.id).toBe(3);
      expect(question.options[question.answerIndex], question.id).toBe(question.correctedStatement);
      expect(question.statement === question.correctedStatement, question.id).toBe(question.isTrue);
      expect(question.options.filter(option => option === question.correctedStatement), question.id).toHaveLength(1);
    }
    // These constraints preserve the checked source facts, rather than guessing
    // a child's age, ownership, ability or name from an unlabelled face.
    expect(pictureFixQuestions.find(question => question.id === "picture-7-1")).toMatchObject({ imageId: "elephant", isTrue: false, correctedStatement: "It's got big ears." });
    expect(pictureFixQuestions.find(question => question.id === "picture-7-2")).toMatchObject({ imageId: "giraffe", isTrue: true, correctedStatement: "It's got a long neck." });
    expect(pictureFixQuestions.find(question => question.id === "picture-8-1")).toMatchObject({ imageId: "socks", correctedStatement: "These are socks." });
    expect(pictureFixQuestions.find(question => question.id === "picture-11-1")).toMatchObject({ imageId: "bedroom", isTrue: false, correctedStatement: "This is a bedroom." });
  });

  it("packages speech for every instruction, picture choice, tile and correction", () => {
    const texts = [
      ...placementQuestions.flatMap(question => [question.prompt, question.anchorId, ...question.items.map(item => item.en)]),
      ...sentenceQuestions.flatMap(question => [question.prompt, question.sentence, ...question.answer, ...question.distractors ?? []]),
      ...pictureFixQuestions.flatMap(question => [question.statement, question.correctedStatement, ...question.options]),
    ];
    for (const text of new Set(texts)) {
      expect(text.trim()).not.toBe("");
      expect(text).not.toMatch(/[\p{Script=Han}]/u);
      const bytes = readFileSync(new URL(`../../public/${wordAudioPath(text)}`, import.meta.url));
      expect(bytes.length, text).toBeGreaterThan(1000);
      expect(bytes.subarray(0, 3).toString() === "ID3" || (bytes[0] === 255 && (bytes[1] & 224) === 224), text).toBe(true);
    }
  });
});
