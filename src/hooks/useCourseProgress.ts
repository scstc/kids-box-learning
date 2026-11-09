import { useState } from "react";
import { allWordEntries, entryKey, type WordEntry } from "../data/course";
import { clearLearningRecords } from "../data/learningRecords";

export type CourseProgress = {
  learned: string[];
  mistakes: string[];
  lastUnit: number;
};
const key = "kids-box-book1-progress-v1";
const valid = new Set(allWordEntries.map(entryKey));

export function readCourseProgress(
  raw: string | null,
  legacy: string | null = null,
): CourseProgress {
  try {
    const saved: unknown = raw ? JSON.parse(raw) : {};
    const object =
      saved && typeof saved === "object" && !Array.isArray(saved)
        ? (saved as Record<string, unknown>)
        : {};
    const filter = (value: unknown) =>
      Array.isArray(value)
        ? [
            ...new Set(
              value.filter(
                (item): item is string =>
                  typeof item === "string" && valid.has(item),
              ),
            ),
          ]
        : [];
    const learned = filter(object.learned);
    if (!raw && legacy) {
      try {
        const old: unknown = JSON.parse(legacy);
        if (Array.isArray(old))
          for (const id of old) {
            const animalKey = `7:${id}`;
            if (valid.has(animalKey) && !learned.includes(animalKey))
              learned.push(animalKey);
          }
      } catch {
        /* Legacy data is optional. */
      }
    }
    return {
      learned,
      mistakes: filter(object.mistakes),
      lastUnit:
        typeof object.lastUnit === "number" &&
        object.lastUnit >= 1 &&
        object.lastUnit <= 12
          ? object.lastUnit
          : 1,
    };
  } catch {
    return { learned: [], mistakes: [], lastUnit: 1 };
  }
}

export function useCourseProgress() {
  const [progress, setProgress] = useState<CourseProgress>(() => {
    try {
      return readCourseProgress(
        localStorage.getItem(key),
        localStorage.getItem("little-safari-progress-v1"),
      );
    } catch {
      return readCourseProgress(null);
    }
  });
  const [storageError, setStorageError] = useState(false);
  const update = (transform: (previous: CourseProgress) => CourseProgress) => {
    setProgress((previous) => {
      const next = transform(previous);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        setStorageError(true);
      }
      return next;
    });
  };
  const learn = (entry: WordEntry) =>
    update((previous) => ({
      ...previous,
      learned: [...new Set([...previous.learned, entryKey(entry)])],
    }));
  const incorrect = (entry: WordEntry) =>
    update((previous) => ({
      ...previous,
      mistakes: [...new Set([...previous.mistakes, entryKey(entry)])],
    }));
  const correct = (entry: WordEntry) =>
    update((previous) => ({
      ...previous,
      learned: [...new Set([...previous.learned, entryKey(entry)])],
      mistakes: previous.mistakes.filter((id) => id !== entryKey(entry)),
    }));
  const visit = (unit: number) =>
    update((previous) => ({ ...previous, lastUnit: unit }));
  const reset = () => {
    try {
      const next = clearLearningRecords(localStorage);
      setProgress(next);
      setStorageError(false);
      return true;
    } catch {
      setStorageError(true);
      return false;
    }
  };
  return { progress, learn, incorrect, correct, visit, reset, storageError };
}
