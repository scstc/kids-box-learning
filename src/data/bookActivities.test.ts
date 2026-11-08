import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { bookSections, verifiedBookActivities } from "./bookActivities";

describe("课本活动的来源与顺序", () => {
  it("按官方第1单元样张保留12项活动，而不是用词汇游戏替代课本流程", () => {
    const activities = verifiedBookActivities[1];
    expect(activities.map((activity) => activity.number)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
    expect(
      activities
        .filter((activity) => activity.kind === "song")
        .map((activity) => ({
          number: activity.number,
          page: activity.page,
          track: activity.track,
        })),
    ).toEqual([{ number: 7, page: 7, track: 10 }]);
    expect(
      activities.find((activity) => activity.kind === "story")?.track,
    ).toBe(17);
    expect(
      activities
        .filter((activity) => activity.lesson === 1)
        .map((activity) => activity.number),
    ).toEqual([1, 2, 3, 4]);
    expect(activities.map((activity) => activity.page)).toEqual([
      4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
    ]);
  });
  it("完整覆盖扫描本正文4–95页，包括单元间的跨学科、价值观和复习页", () => {
    const pages = new Set(
      Object.values(verifiedBookActivities).flatMap((items) =>
        items.map((item) => item.page),
      ),
    );
    for (const section of bookSections)
      for (let page = section.page; page <= section.endPage; page++)
        pages.add(page);
    expect([...pages].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 92 }, (_, i) => i + 4),
    );
    expect(Object.values(verifiedBookActivities).flat()).toHaveLength(144);
    expect(bookSections.filter((item) => item.group === "CLIL")).toHaveLength(
      6,
    );
    expect(bookSections.filter((item) => item.group === "Values")).toHaveLength(
      6,
    );
  });
  it("按各单元原书顺序保留歌曲、手工和动作活动，不套用第1单元模板", () => {
    expect(verifiedBookActivities[2][6].title).toBe("Make the puppets.");
    expect(verifiedBookActivities[2][7].kind).toBe("song");
    expect(verifiedBookActivities[5][6].kind).toBe("actions");
    expect(verifiedBookActivities[8][6].title).toBe("Listen and correct.");
    expect(verifiedBookActivities[9][3].kind).toBe("song");
    expect(verifiedBookActivities[12][9].title).toBe(
      "Read. Listen and say the name.",
    );
    for (let unit = 2; unit <= 12; unit++) {
      expect(verifiedBookActivities[unit]).toHaveLength(12);
      expect(verifiedBookActivities[unit].find((item) => item.kind === "song")?.track).toBeTypeOf("number");
    }
  });
  it("原书正文图页随应用完整打包，安卓离线使用不要求家长再次导入PDF", () => {
    for (let page = 4; page <= 95; page++) {
      const file = readFileSync(
        new URL(
          `../../public/book-pages/page-${String(page).padStart(3, "0")}.jpg`,
          import.meta.url,
        ),
      );
      expect(file.subarray(0, 3).toString("hex")).toBe("ffd8ff");
      expect(file.length).toBeGreaterThan(10_000);
    }
  });
});
