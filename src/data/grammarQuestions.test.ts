import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { grammarQuestions, grammarQuestionsForUnit } from "./grammarQuestions";
import { wordAudioPath } from "./practiceAudio";

const answerTo = (prompt: string) => grammarQuestions.find(question => question.prompt === prompt)!;

describe("one appropriate spoken response for every book unit", () => {
  it("covers all twelve units with distinct three-choice questions and balanced answers", () => {
    expect(grammarQuestions).toHaveLength(36);
    expect(new Set(grammarQuestions.map(question => question.id)).size).toBe(grammarQuestions.length);
    for (let unitId = 1; unitId <= 12; unitId++) {
      const questions = grammarQuestionsForUnit(unitId);
      expect(questions, `Unit ${unitId}`).toHaveLength(3);
      expect(questions.map(question => question.answerIndex).sort()).toEqual([0, 1, 2]);
      for (const question of questions) {
        expect(question.options).toHaveLength(3);
        expect(new Set(question.options.map(option => option.toLowerCase().replace(/[.!?]/g, ""))).size, question.id).toBe(3);
        expect(question.options[question.answerIndex], question.id).toBeTruthy();
        for (const text of [question.prompt, ...question.options, question.explanation]) {
          expect(text.trim().length, question.id).toBeGreaterThan(0);
          expect(text, question.id).not.toMatch(/[\p{Script=Han}]/u);
        }
      }
    }
    expect(grammarQuestionsForUnit(0)).toEqual([]);
    expect(grammarQuestionsForUnit(13)).toEqual([]);
  });

  it("separates names, ages and colours instead of marking another valid personal fact wrong", () => {
    const name = answerTo("What's your name?");
    const age = answerTo("How old are you?");
    const colour = answerTo("What colour is it?");
    expect(name.options[name.answerIndex]).toBe("I'm Suzy.");
    expect(age.options[age.answerIndex]).toBe("I'm three.");
    expect(colour.options[colour.answerIndex]).toBe("It's blue.");
    expect(name.options.filter(option => /I'm (Suzy|Simon|Stella|Meera)\./.test(option))).toHaveLength(1);
    expect(age.options.filter(option => /I'm (one|two|three|four|five|six|seven|eight|nine|ten)\./.test(option))).toHaveLength(1);
    expect(colour.options.filter(option => /It's (blue|green|yellow|pink|red|orange|purple)\./.test(option))).toHaveLength(1);
  });

  it("pairs question auxiliaries and person with a single matching short answer", () => {
    for (const [prompt, correct] of [
      ["Have you got a brown dog?", "Yes, I have."],
      ["Have you got a small mouth?", "No, I haven't."],
      ["Have they got small ears?", "No, they haven't."],
      ["Has Simon got my red trousers?", "Yes, he has."],
      ["Can you sing?", "Yes, I can."],
      ["Can you swim?", "No, I can't."],
      ["Are you flying your helicopter?", "Yes, I am."],
      ["Do you like apples?", "Yes, I do."],
      ["Do you like ice cream?", "No, I don't."],
    ]) {
      const question = answerTo(prompt);
      expect(question.options[question.answerIndex], prompt).toBe(correct);
      expect(question.options.filter(option => option === correct), prompt).toHaveLength(1);
    }
  });

  it("packages actual playback audio for every prompt and all three options, including distractors", () => {
    for (const question of grammarQuestions) {
      for (const text of [question.prompt, ...question.options]) {
        const path = wordAudioPath(text);
        const bytes = readFileSync(new URL(`../../public/${path}`, import.meta.url));
        expect(bytes.length, `${question.id}: ${text}`).toBeGreaterThan(1000);
        expect(bytes.subarray(0, 3).toString() === "ID3" || (bytes[0] === 255 && (bytes[1] & 224) === 224), text).toBe(true);
      }
    }
  });
});
