import { describe, expect, it } from "vitest";
import { bookTouchTargets } from "./bookTouchTargets";
import { bookHotspots, type BookHotspot } from "./bookHotspots";
import { bookAudioReferences } from "./bookAudio";

describe("book touch areas preserve the printed target at every screen size", () => {
  it("keeps a generous target when space is free, but stops before a neighbouring word", () => {
    const first: BookHotspot = { word: "first", kind: "label", x: 10, y: 10, width: 20, height: 10 };
    expect(bookTouchTargets([first], 100, 100)[0]).toEqual({ minWidth: 44, minHeight: 44 });
    const neighbour: BookHotspot = { ...first, word: "second", y: 25 };
    expect(bookTouchTargets([first, neighbour], 100, 100)[0].minHeight).toBe(15);
    expect(bookTouchTargets([{ ...first, kind: "text" }], 100, 100)[0]).toEqual({ minWidth: 0, minHeight: 0 });
  });
  it("preserves printed centres on all 92 pages and the reviewed animal heads, bodies and tails", () => {
    const normalize = (word: string) => word.replace(/[’‘]/g, "'");
    const landmarks: Record<number, [number, number, string][]> = {
      34: [[975,870,"cat"],[1093,977,"bird"],[794,1070,"mouse"]],
      48: [[742,708,"snake"],[732,777,"snake"],[929,691,"snake"],[1016,670,"snake"],[1023,739,"snake"],
        [299,799,"crocodile"],[868,910,"monkey"],[813,817,"monkey"],[1137,973,"tiger"]],
    };
    for (const [viewportWidth, viewportHeight] of [[1024,768],[800,1280],[390,844],[844,390]]) {
      const scale = Math.min(viewportWidth / 1259, (viewportHeight - (viewportWidth <= 600 ? 68 : 76)) / 1600);
      const width = 1259 * scale, height = 1600 * scale;
      for (const [page, regions] of Object.entries(bookHotspots)) {
        const targets = [...regions, ...bookAudioReferences.filter(t => t.page === Number(page))
          .map(t => ({ ...t, word: `CD${t.disc}/${t.track}`, kind: "picture" as const }))];
        const minimums = bookTouchTargets(targets, width, height);
        const boxes = targets.map((r,index) => ({ word:r.word, x:r.x/100*width, y:r.y/100*height,
          width:Math.max(r.width/100*width,minimums[index].minWidth), height:Math.max(r.height/100*height,minimums[index].minHeight) }));
        targets.forEach(r => {
          const x=(r.x+r.width/2)/100*width,y=(r.y+r.height/2)/100*height;
          const hit=boxes.filter(b=>x>=b.x&&x<=b.x+b.width&&y>=b.y&&y<=b.y+b.height).at(-1);
          expect(normalize(hit?.word ?? ""), `${viewportWidth}×${viewportHeight} P${page}: ${r.word}`).toBe(normalize(r.word));
        });
        for (const [sourceX,sourceY,word] of landmarks[Number(page)] ?? []) {
          const x=sourceX*scale,y=sourceY*scale;
          const hit=boxes.filter(b=>x>=b.x&&x<=b.x+b.width&&y>=b.y&&y<=b.y+b.height).at(-1);
          expect(hit?.word, `${viewportWidth}×${viewportHeight} P${page}: ${word} at ${sourceX},${sourceY}`).toBe(word);
        }
      }
    }
  });
});
