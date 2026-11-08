import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { bookAudioReferences, findBookAudio, relatedBookAudio } from "./bookAudio";
import { bookFlashcards, bookVideos } from "./bookMedia";
import { verifiedBookActivities } from "./bookActivities";
import { audioKey } from "./course";

const resource = (file: string) => readFileSync(new URL(`../../public/${file}`, import.meta.url));

describe("原版教材点读与离线媒体", () => {
  it("每处 CD 标记对应一个明确音轨，缺少的六轨不使用其他录音顶替", () => {
    expect(bookAudioReferences).toHaveLength(144);
    expect(new Set(bookAudioReferences.map((ref) => `${ref.page}:${ref.activity}`)).size).toBe(144);
    expect(bookAudioReferences.filter((ref) => !ref.file).map(({page, activity, disc, track}) => [page, activity, disc, track])).toEqual([
      [25, 3, 2, 5], [50, 5, 3, 7], [85, 3, 4, 38], [17, 4, 1, 35], [76, 1, 4, 18], [91, 4, 4, 52],
    ]);
    for (const ref of bookAudioReferences) {
      if (ref.file) expect(resource(ref.file).length).toBeGreaterThan(1000);
      expect(ref.x).toBeGreaterThan(0);
      expect(ref.y).toBeGreaterThan(0);
      expect(ref.x + ref.width).toBeLessThan(100);
      expect(ref.y + ref.height).toBeLessThan(100);
      if (ref.unitId) expect(verifiedBookActivities[ref.unitId].find((item) => item.number === ref.activity)?.track).toBe(ref.track);
    }
  });
  it("唱歌与故事按原书定位，同页的两个 CD 图标可分别点击", () => {
    expect(findBookAudio(15, 11)?.track).toBe(32);
    expect(findBookAudio(51, 7)?.file).toContain("pb_p51_7.mp3");
    expect(findBookAudio(65, 4)?.track).toBe(42);
    for (const page of new Set(bookAudioReferences.map((ref) => ref.page))) {
      const refs = bookAudioReferences.filter((ref) => ref.page === page);
      if (refs.length === 2) expect(Math.abs(refs[0].y - refs[1].y), `page ${page}`).toBeGreaterThan(10);
    }
    for (const page of [16,17,30,31,32,33,46,47,60,61,62,76,77,90,91,92])
      expect(bookAudioReferences.some((ref) => ref.page === page)).toBe(true);
  });
  it("全部原始录音、47个视频和95张原版闪卡随应用打包", () => {
    expect(relatedBookAudio).toHaveLength(244);
    expect(bookVideos).toHaveLength(47);
    expect(bookFlashcards).toHaveLength(95);
    expect(bookFlashcards.some((item) => item.number === 73)).toBe(false);
    for (const item of relatedBookAudio) expect(resource(item.file).length).toBeGreaterThan(1000);
    for (const item of bookVideos) {
      expect(resource(item.file).subarray(4,8).toString()).toBe("ftyp");
      expect(resource(item.poster).subarray(0,3).toString("hex")).toBe("ffd8ff");
      expect(item.file.startsWith("视频/")).toBe(true);
    }
    for (const item of bookFlashcards) {
      expect(resource(item.file).subarray(0,3).toString("hex")).toBe("ffd8ff");
      expect(resource(`course-audio/${audioKey(item.name)}.mp3`).length).toBeGreaterThan(1000);
    }
    for (let unitId = 1; unitId <= 12; unitId++) {
      expect(bookVideos.filter((item) => item.unitId === unitId).map((item) => item.kind)).toEqual(expect.arrayContaining(["song", "story", "karaoke"]));
      expect(bookFlashcards.some((item) => item.unitId === unitId)).toBe(true);
    }
  });
});
