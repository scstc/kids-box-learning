import { describe, expect, it } from "vitest";
import { animals, makeQuizChoices } from "./animals";

describe("儿童学习内容", () => {
  it("只包含约定的七个动物，并且每组拼写块能完整还原单词", () => {
    expect(animals.map((animal) => animal.id)).toEqual([
      "giraffe",
      "elephant",
      "snake",
      "hippo",
      "crocodile",
      "monkey",
      "tiger",
    ]);
    for (const animal of animals)
      expect(animal.parts.map((part) => part.text).join("")).toBe(animal.name);
  });

  it("明确标识 snake 的静音 e，避免把字母块当成五个音节", () => {
    const snake = animals.find((animal) => animal.id === "snake")!;
    expect(snake.parts.find((part) => part.text === "e")?.ipa).toBe("静音");
    expect(snake.parts.find((part) => part.text === "a")?.ipa).toBe("/eɪ/");
  });
});

describe("听音辨认游戏", () => {
  it("每道题恰好有一个正确答案，所有选项均不同，避免无解题目", () => {
    for (const [round, animal] of animals.entries()) {
      const choices = makeQuizChoices(animal.id, round);
      expect(choices).toHaveLength(3);
      expect(new Set(choices.map((choice) => choice.id)).size).toBe(3);
      expect(choices.filter((choice) => choice.id === animal.id)).toHaveLength(
        1,
      );
    }
  });

  it("正确选项不会总出现在同一个位置", () => {
    const positions = animals.map((animal, round) =>
      makeQuizChoices(animal.id, round).findIndex(
        (choice) => choice.id === animal.id,
      ),
    );
    expect(new Set(positions).size).toBe(3);
  });
});
