import { describe, expect, it } from "vitest";
import { defaultInkPreferences, inkColors, inkWidths, readInkPreferences, readSavedInkPreferences, saveInkPreferences } from "./bookInkPreferences";
import { learnerRecordKey } from "./learnerProfiles";
import { clearLearningRecords } from "./learningRecords";

describe("each learner keeps their own pen choices", () => {
  it("accepts supported colors and widths while falling back separately for invalid saved fields", () => {
    for (const color of inkColors) for (const width of inkWidths) {
      expect(readInkPreferences(JSON.stringify({ color: color.value, width: width.value }))).toEqual({ color: color.value, width: width.value });
    }
    expect(readInkPreferences('{"color":"not-a-color","width":0.0064}')).toEqual({ color: defaultInkPreferences.color, width: 0.0064 });
    expect(readInkPreferences('{"color":"#2457d6","width":-1}')).toEqual({ color: "#2457d6", width: defaultInkPreferences.width });
    for (const invalid of [null, "", "{", "[]", '"#2457d6"', '{"width":"0.0064"}', '{"color":null,"width":null}']) {
      expect(readInkPreferences(invalid)).toEqual(defaultInkPreferences);
    }
  });

  it("restores different choices for the same book without mixing learners or using global preferences", () => {
    const values = new Map<string, string>([["kids-box-ink-preferences-v1", '{"color":"#d92d20","width":0.0064}']]);
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    };
    const alice = { color: "#2457d6", width: 0.0016 };
    const bob = { color: "#ffffff", width: 0.0064 };
    expect(readSavedInkPreferences(storage, "new-learner")).toEqual(defaultInkPreferences);
    saveInkPreferences(storage, "alice", alice);
    saveInkPreferences(storage, "bob", bob);
    expect(readSavedInkPreferences(storage, "alice")).toEqual(alice);
    expect(readSavedInkPreferences(storage, "bob")).toEqual(bob);
    expect(values.has(learnerRecordKey("kids-box-ink-preferences-v1", "alice"))).toBe(true);
  });

  it("keeps pen preferences when clearing the learner's learning progress", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    };
    const preferences = { color: "#107d57", width: 0.0064 };
    saveInkPreferences(storage, "alice", preferences);
    clearLearningRecords(storage, "alice");
    expect(readSavedInkPreferences(storage, "alice")).toEqual(preferences);
  });

  it("reports storage failures so settings cannot be shown as successfully saved", () => {
    expect(() => readSavedInkPreferences({ getItem: () => { throw new Error("Read blocked"); } }, "alice")).toThrow("Read blocked");
    expect(() => saveInkPreferences({ setItem: () => { throw new Error("Storage full"); } }, "alice", defaultInkPreferences)).toThrow("Storage full");
  });
});
