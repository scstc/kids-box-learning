import { describe, expect, it } from "vitest";
import { verifiedBookActivities } from "./bookActivities";

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
  it("未核实的单元不自动复制第1单元的活动、页码与录音编号", () => {
    for (let unit = 2; unit <= 12; unit++)
      expect(verifiedBookActivities[unit]).toBeUndefined();
  });
});
