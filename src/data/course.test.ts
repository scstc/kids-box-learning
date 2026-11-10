import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import {
  allWordEntries,
  audioKey,
  courseUnits,
  entryKey,
  getAudioItems,
  makeCourseChoices,
  spellingLetters,
} from "./course";
import { readCourseProgress } from "../hooks/useCourseProgress";

describe("整册课程的学习完整性", () => {
  it("12 个单元均有词语与三组情景句，拼读块能还原完整拼写", () => {
    expect(courseUnits.map((unit) => unit.id)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
    for (const unit of courseUnits) {
      expect(unit.words.length).toBeGreaterThanOrEqual(6);
      expect(unit.sentences).toHaveLength(3);
      for (const word of unit.words) expect(word.chunks.join("")).toBe(word.en);
    }
    expect(new Set(allWordEntries.map(entryKey)).size).toBe(
      allWordEntries.length,
    );
  });
  it("每个词语和句子都有可打包的本地音频，避免离线 APK 播放时请求缺失文件", () => {
    for (const item of getAudioItems()) {
      const path = `public/course-audio/${item.key}.mp3`;
      expect(existsSync(path), item.text).toBe(true);
      expect(statSync(path).size, item.text).toBeGreaterThan(1000);
      const bytes = readFileSync(path).subarray(0, 3);
      expect(
        bytes.toString() === "ID3" ||
          (bytes[0] === 255 && (bytes[1] & 224) === 224),
        item.text,
      ).toBe(true);
    }
  });
  it("听音选项不会因为不同单元出现同一个词而变成两个正确答案", () => {
    for (const entry of allWordEntries) {
      const options = makeCourseChoices(entry, allWordEntries);
      expect(options).toHaveLength(3);
      expect(
        options.filter((option) => option.word.en === entry.word.en),
      ).toHaveLength(1);
      expect(
        options.some((option) => entryKey(option) === entryKey(entry)),
      ).toBe(true);
    }
  });
  it("拼写字母忽略空格与连字符，同时保留重复字母", () => {
    expect(spellingLetters("T-shirt")).toEqual(["t", "s", "h", "i", "r", "t"]);
    expect(spellingLetters("ice cream").join("")).toBe("icecream");
    expect(
      spellingLetters("yellow").filter((letter) => letter === "l"),
    ).toHaveLength(2);
    expect(audioKey("Hello! My name is Lily.")).toBe("hello-my-name-is-lily");
  });
});

describe("孩子的进度可以安全恢复", () => {
  it("首次使用整册版时保留原动物小站已经学习的词语", () => {
    expect(
      readCourseProgress(null, JSON.stringify(["tiger", "snake", "unknown"]))
        .learned,
    ).toEqual(["7:tiger", "7:snake"]);
  });
  it("明确重置后不再重复导入旧进度", () => {
    expect(
      readCourseProgress(
        JSON.stringify({ learned: [], mistakes: [], lastUnit: 1 }),
        JSON.stringify(["tiger"]),
      ).learned,
    ).toEqual([]);
  });
  it("损坏或过期记录不影响打开课程", () => {
    expect(readCourseProgress("bad json").learned).toEqual([]);
    expect(
      readCourseProgress(
        JSON.stringify({
          learned: ["1:red", "1:red", "bad"],
          mistakes: [42, "2:book"],
          lastUnit: 99,
        }),
      ),
    ).toEqual({ learned: ["1:red"], mistakes: ["2:book"], lastUnit: 1 });
  });
  it("拒绝小数单元编号，避免恢复到不存在的课程", () => {
    expect(readCourseProgress(JSON.stringify({ lastUnit: 7.5 })).lastUnit).toBe(1);
  });
});
