import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import sharp from "sharp";
import { courseUnits } from "./course";
import { originalCover, originalUnitArt, originalWordArt, originalFlashcardArt, wordArtFallbacks } from "./originalArt";
import { unitStartPages } from "./bookActivities";

describe("原书插图与词义保持一致", () => {
  it("封面和12张单元图来自用户的扫描本，每个词都有原图或明确的中文展示", () => {
    expect(originalCover.source).toMatchObject({ kind: "pdf", page: "cover" });
    expect(Object.values(originalUnitArt).map((image) => image.source.page)).toEqual(unitStartPages);
    expect(Object.keys(originalWordArt)).toHaveLength(108);
    expect(wordArtFallbacks).toHaveLength(11);
    const fallbacks = new Set(wordArtFallbacks.map((item) => `${item.unitId}:${item.id}`));
    for (const unit of courseUnits) for (const word of unit.words)
      expect(Boolean(originalWordArt[`${unit.id}:${word.id}`]) !== fallbacks.has(`${unit.id}:${word.id}`)).toBe(true);
    for (const image of [originalCover, ...Object.values(originalUnitArt), ...Object.values(originalWordArt)]) {
      const data = readFileSync(new URL(`../../public/${image.file}`, import.meta.url));
      if (image.file.endsWith(".png")) expect(data.subarray(0,8).toString("hex")).toBe("89504e470d0a1a0a");
      else expect(data.subarray(8,12).toString()).toBe("WEBP");
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    }
  });
  it("闪卡外部背景透明，同时保留原图中的白色物体和白色细节", async () => {
    expect(Object.keys(originalFlashcardArt)).toHaveLength(95);
    for (const image of Object.values(originalFlashcardArt)) {
      const { data, info } = await sharp(readFileSync(new URL(`../../public/${image.file}`, import.meta.url))).raw().toBuffer({ resolveWithObject: true });
      expect(info.channels).toBe(4);
      expect([info.width, info.height]).toEqual([image.width, image.height]);
      expect(data[3]).toBe(0);
      expect(data.some((value, index) => index % 4 === 3 && value === 255)).toBe(true);
    }
    for (const [number, x, y] of [[85, .5, .5], [127, .36, .57], [13, .55, .63]]) {
      const { data, info } = await sharp(readFileSync(new URL(`../../public/${originalFlashcardArt[number].file}`, import.meta.url))).raw().toBuffer({ resolveWithObject: true });
      const pixel = (Math.floor(y * info.height) * info.width + Math.floor(x * info.width)) * 4;
      expect(data[pixel + 3]).toBe(255);
      expect(Math.min(...data.subarray(pixel, pixel + 3))).toBeGreaterThan(225);
    }
  });
  it("数字、椅背、车轮及动物卷尾的镂空能透出卡片背景", async () => {
    for (const [number, x, y] of [[27, .5, .66], [31, .5, .3], [57, .65, .22], [77, .5, .5], [129, .82, .72], [125, .51, .76]]) {
      const { data, info } = await sharp(readFileSync(new URL(`../../public/${originalFlashcardArt[number].file}`, import.meta.url))).raw().toBuffer({ resolveWithObject: true });
      expect(data[(Math.floor(y * info.height) * info.width + Math.floor(x * info.width)) * 4 + 3]).toBeLessThan(5);
    }
    for (const id of ['big', 'small', 'long', 'short']) {
      const { data } = await sharp(readFileSync(new URL(`../../public/${originalWordArt[`5:${id}`].file}`, import.meta.url))).raw().toBuffer({ resolveWithObject: true });
      expect(data[(100 * 600 + 50) * 4 + 3]).toBe(0);
    }
  });
  it("水果orange不使用颜色orange的闪卡，缺少的doll闪卡用原书娃娃插图补足", () => {
    expect(originalWordArt["1:orange"].source.kind).toBe("flashcard");
    expect(originalWordArt["12:orange"].source).toMatchObject({ kind: "pdf", page: 84 });
    expect(originalWordArt["3:doll"].source).toMatchObject({ kind: "pdf", page: 18 });
    for (const id of ["giraffe","elephant","snake","hippo","crocodile","monkey","tiger"])
      expect(originalWordArt[`7:${id}`].source.kind).toBe("flashcard");
  });
});
