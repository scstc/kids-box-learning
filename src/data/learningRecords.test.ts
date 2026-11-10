import { describe, expect, it } from "vitest";
import { clearLearningRecords } from "./learningRecords";
import { readCourseProgress } from "../hooks/useCourseProgress";
import { learnerRecordKey, learningRecordKeys } from "./learnerProfiles";

describe("clear learning records on this device", () => {
  it("clears every learning record while keeping preferences and unrelated data", () => {
    const values = new Map([
      ["kids-box-book1-progress-v1", JSON.stringify({ learned: ["1:red"], mistakes: ["2:book"], lastUnit: 7 })],
      ["kids-box-book-activity-progress-v1", '["book1:unit1:activity1"]'],
      ["little-safari-progress-v1", '["giraffe"]'],
      ["kids-box-reader-page-v1", "48"],
      ["kids-box-practice-progress-v1", '["listen:1:red"]'],
      ["kids-box-motion-v1", "off"],
      ["kids-box-spelling-hints-v1", "off"],
      ["kids-box-reader-speed-v1", "0.75"],
      ["unrelated-data", "keep"],
    ]);
    const cleared = clearLearningRecords({
      setItem: (key, value) => { values.set(key, value); },
      removeItem: key => { values.delete(key); },
    });
    expect(cleared).toEqual({ learned: [], mistakes: [], lastUnit: 1 });
    expect(Object.fromEntries(values)).toEqual({
      "kids-box-book1-progress-v1": JSON.stringify(cleared),
      "kids-box-motion-v1": "off",
      "kids-box-spelling-hints-v1": "off",
      "kids-box-reader-speed-v1": "0.75",
      "unrelated-data": "keep",
    });
    // Refresh must read an explicit empty record, even with an old migration input.
    expect(readCourseProgress(values.get("kids-box-book1-progress-v1")!, '["giraffe"]')).toEqual(cleared);
  });

  it("resets only this learner and preserves handwriting, other learners and legacy backups", () => {
    const learner = "learner-a";
    const other = "learner-b";
    const preserved: [string, string][] = [
      ["kids-box-learners-v1", "profiles"],
      ["kids-box-motion-v1", "off"],
      ["kids-box-spelling-hints-v1", "off"],
      ["kids-box-reader-speed-v1", "0.75"],
      [learnerRecordKey("kids-box-reader-ink-v1", learner), "handwriting"],
      [learnerRecordKey("kids-box-tap-to-read-v1", learner), "off"],
      ...learningRecordKeys.map((key): [string, string] => [key, "legacy backup"]),
      ...learningRecordKeys.map((key): [string, string] => [learnerRecordKey(key, other), "other learner"]),
    ];
    const values = new Map([
      ...preserved,
      ...learningRecordKeys.map((key): [string, string] => [learnerRecordKey(key, learner), "to clear"]),
    ]);
    const cleared = clearLearningRecords({
      setItem: (key, value) => { values.set(key, value); },
      removeItem: key => { values.delete(key); },
    }, learner);
    expect(Object.fromEntries(values)).toEqual({
      ...Object.fromEntries(preserved),
      [learnerRecordKey(learningRecordKeys[0], learner)]: JSON.stringify(cleared),
    });
  });

  it("reports storage failures so the caller cannot announce success", () => {
    expect(() => clearLearningRecords({
      setItem: () => { throw new Error("Storage blocked"); },
      removeItem: () => { throw new Error("Unexpected removal"); },
    })).toThrow("Storage blocked");
    expect(() => clearLearningRecords({
      setItem: () => {},
      removeItem: () => { throw new Error("Removal blocked"); },
    })).toThrow("Removal blocked");
  });
});
