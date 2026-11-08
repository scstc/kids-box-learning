export type BookHotspot = {
  word: string;
  kind: "label" | "picture";
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
export const bookHotspots: Record<number, BookHotspot[]> = {
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
