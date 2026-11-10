import { useRef, useState } from "react";
import { animals, type AnimalId } from "../data/animals";
import { learnerRecordKey } from "../data/learnerProfiles";
import { useLearner } from "./useLearner";

export function useProgress() {
  const { profile } = useLearner();
  const storageKey = learnerRecordKey("little-safari-progress-v1", profile.id);
  const readSaved = (): AnimalId[] => {
    const raw = localStorage.getItem(storageKey);
    try {
      const saved: unknown = JSON.parse(raw ?? "[]");
      return Array.isArray(saved)
        ? [
            ...new Set(
              saved.filter((id): id is AnimalId =>
                animals.some((animal) => animal.id === id),
              ),
            ),
          ]
        : [];
    } catch {
      return [];
    }
  };
  const [state, setState] = useState(() => {
    try {
      return { learned: readSaved(), storageError: false };
    } catch {
      return { learned: [] as AnimalId[], storageError: true };
    }
  });
  const { learned, storageError } = state;
  const current = useRef(learned);
  const needsRead = useRef(storageError);
  const pending = useRef<((previous: AnimalId[]) => AnimalId[])[]>([]);

  const save = (transform: (previous: AnimalId[]) => AnimalId[]) => {
    let next = transform(current.current);
    if (needsRead.current) {
      pending.current.push(transform);
      try {
        next = pending.current.reduce((previous, apply) => apply(previous), readSaved());
        needsRead.current = false;
        pending.current = [];
      } catch {
        current.current = next;
        setState({ learned: next, storageError: true });
        return;
      }
    }
    current.current = next;
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setState({ learned: next, storageError: false });
    } catch {
      setState({ learned: next, storageError: true });
    }
  };
  const markLearned = (id: AnimalId) => {
    if (!current.current.includes(id))
      save((previous) => [...new Set([...previous, id])]);
  };
  const reset = () => save(() => []);
  return { learned, markLearned, reset, storageError };
}
