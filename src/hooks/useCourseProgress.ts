import { useRef, useState } from "react";
import { allWordEntries, entryKey, type WordEntry } from "../data/course";
import { clearLearningRecords } from "../data/learningRecords";
import { learnerRecordKey } from "../data/learnerProfiles";
import { useLearner } from "./useLearner";

export type CourseProgress = {
  learned: string[];
  mistakes: string[];
  lastUnit: number;
};
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
        Number.isInteger(object.lastUnit) &&
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
  const { profile } = useLearner();
  const key = learnerRecordKey("kids-box-book1-progress-v1", profile.id);
  const readSaved = () => readCourseProgress(
    localStorage.getItem(key),
    localStorage.getItem(learnerRecordKey("little-safari-progress-v1", profile.id)),
  );
  const [state, setState] = useState(() => {
    try {
      return { progress: readSaved(), storageError: false };
    } catch {
      return { progress: readCourseProgress(null), storageError: true };
    }
  });
  const { progress, storageError } = state;
  const current = useRef(progress);
  const needsRead = useRef(storageError);
  const pending = useRef<((previous: CourseProgress) => CourseProgress)[]>([]);
  const update = (transform: (previous: CourseProgress) => CourseProgress) => {
    let next = transform(current.current);
    if (needsRead.current) {
      pending.current.push(transform);
      try {
        next = pending.current.reduce((previous, apply) => apply(previous), readSaved());
        needsRead.current = false;
        pending.current = [];
      } catch {
        // Keep new learning in memory without replacing records we could not read.
        current.current = next;
        setState({ progress: next, storageError: true });
        return;
      }
    }
    current.current = next;
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setState({ progress: next, storageError: false });
    } catch {
      setState({ progress: next, storageError: true });
    }
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
      const next = clearLearningRecords(localStorage, profile.id);
      current.current = next;
      needsRead.current = false;
      pending.current = [];
      setState({ progress: next, storageError: false });
      return true;
    } catch {
      setState({ progress: current.current, storageError: true });
      return false;
    }
  };
  return { progress, learn, incorrect, correct, visit, reset, storageError };
}
