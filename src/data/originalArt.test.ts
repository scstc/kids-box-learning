import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { courseUnits } from "./course";
import { originalCover, originalUnitArt, originalWordArt, wordArtFallbacks } from "./originalArt";
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
      expect(data.subarray(8,12).toString()).toBe("WEBP");
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
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
