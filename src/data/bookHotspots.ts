import { bookWordLabels } from "./bookWordLabels.ts";
import { bookReadingRegions } from "./bookReadingRegions.ts";
import { bookPrintedText } from "./bookPrintedText.ts";
import { bookFooterRegions } from "./bookFooterRegions.ts";

export type BookHotspot = {
  word: string;
  kind: "label" | "picture" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
};
function region(
  word: string,
  kind: BookHotspot["kind"],
  x: number,
  y: number,
  width: number,
  height: number,
): BookHotspot {
  return {
    word,
    kind,
    x: (x / 1259) * 100,
    y: (y / 1600) * 100,
    width: (width / 1259) * 100,
    height: (height / 1600) * 100,
  };
}
// Manually checked against the bundled page-048.jpg; percentages scale with zoom.
// These play supporting dictionary words, not the textbook's original dialogue.
const baseHotspots: Record<number, BookHotspot[]> = {
  ...Object.fromEntries(
    Object.entries(bookWordLabels).map(([page, labels]) => [
      page,
      labels.map((label) => ({ ...label, kind: "label" as const })),
    ]),
  ),
  7: [
    region("pink", "picture", 115, 1000, 240, 215),
    region("orange", "picture", 375, 1000, 230, 215),
    region("yellow", "picture", 620, 1000, 230, 215),
    region("red", "picture", 880, 1000, 230, 215),
    region("blue", "picture", 220, 1230, 240, 205),
    region("green", "picture", 495, 1230, 230, 205),
    region("purple", "picture", 740, 1230, 240, 205),
  ],
  34: [
    ...(bookWordLabels[34] ?? []).map((label) => ({
      ...label,
      kind: "label" as const,
    })),
    region("horse", "picture", 355, 372, 205, 215),
    region("dog", "picture", 275, 945, 165, 365),
    region("fish", "picture", 489, 1023, 124, 120),
    region("mouse", "picture", 681, 982, 80, 110),
    region("cat", "picture", 829, 904, 182, 203),
    region("bird", "picture", 1086, 991, 74, 138),
  ],
  48: [
    region("giraffe", "picture", 200, 565, 251, 113),
    region("elephant", "picture", 395, 680, 260, 158),
    region("snake", "picture", 1060, 710, 155, 210),
    region("hippo", "picture", 60, 826, 290, 154),
    region("crocodile", "picture", 360, 870, 220, 110),
    region("monkey", "picture", 780, 795, 220, 85),
    region("monkey", "picture", 650, 1000, 200, 180),
    region("monkey", "picture", 890, 322, 270, 244),
    region("tiger", "picture", 850, 1004, 282, 196),
    region("giraffe", "label", 85, 515, 145, 48),
    region("elephant", "label", 637, 637, 176, 50),
    region("snake", "label", 1066, 768, 131, 50),
    region("hippo", "label", 50, 995, 128, 50),
    region("crocodile", "label", 581, 870, 191, 50),
    region("monkey", "label", 949, 883, 173, 49),
    region("tiger", "label", 949, 1282, 119, 50),
  ],
};

export const bookHotspots: Record<number, BookHotspot[]> = Object.fromEntries(
  Array.from({ length: 92 }, (_, index) => index + 4).map((page) => [page, [
    ...(baseHotspots[page] ?? []), ...(bookPrintedText[page] ?? []), ...(bookReadingRegions[page] ?? []), ...(bookFooterRegions[page] ?? []),
  ]]),
);
