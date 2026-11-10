import { learnerRecordKey } from "./learnerProfiles";

export type InkPreferences = { color: string; width: number };
export const inkColors = [
  { name: "Purple", value: "#6941c6" },
  { name: "Blue", value: "#2457d6" },
  { name: "Red", value: "#d92d20" },
  { name: "Green", value: "#107d57" },
  { name: "Black", value: "#172033" },
  { name: "White", value: "#ffffff" },
];
export const inkWidths = [
  { name: "Fine", value: 0.0016 },
  { name: "Medium", value: 0.0032 },
  { name: "Bold", value: 0.0064 },
];
export const defaultInkPreferences: InkPreferences = { color: "#6941c6", width: 0.0032 };
const storageKey = "kids-box-ink-preferences-v1";

export function readInkPreferences(raw: string | null): InkPreferences {
  try {
    const saved: unknown = JSON.parse(raw ?? "null");
    const value = saved && typeof saved === "object" && !Array.isArray(saved)
      ? saved as Record<string, unknown>
      : {};
    return {
      color: inkColors.some(color => color.value === value.color) ? value.color as string : defaultInkPreferences.color,
      width: inkWidths.some(width => width.value === value.width) ? value.width as number : defaultInkPreferences.width,
    };
  } catch {
    return { ...defaultInkPreferences };
  }
}

export function readSavedInkPreferences(storage: Pick<Storage, "getItem">, learnerId: string) {
  return readInkPreferences(storage.getItem(learnerRecordKey(storageKey, learnerId)));
}

export function saveInkPreferences(storage: Pick<Storage, "setItem">, learnerId: string, preferences: InkPreferences) {
  const next = readInkPreferences(JSON.stringify(preferences));
  storage.setItem(learnerRecordKey(storageKey, learnerId), JSON.stringify(next));
  return next;
}
