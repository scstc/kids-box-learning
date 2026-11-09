import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import WordArt from "./WordArt";
import { allWordEntries } from "../data/course";
import { originalWordArt } from "../data/originalArt";

describe("Learn from context without translation or a revealed spelling", () => {
  it("gives an English contextual clue when no book picture exists", () => {
    for (const { unitId, word } of allWordEntries) {
      if (originalWordArt[`${unitId}:${word.id}`]) continue;
      const markup = renderToStaticMarkup(<WordArt id={word.id} unitId={unitId} />);
      const clue = markup.replace(/<[^>]*>/g, "");
      expect(clue.trim().length, word.en).toBeGreaterThan(0);
      expect(clue, word.en).not.toMatch(/[\p{Script=Han}]/u);
      expect(clue.toLowerCase(), word.en).not.toContain(word.en.toLowerCase());
    }
  });
});
