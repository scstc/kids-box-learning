import { useState } from "react";
import { animals, type AnimalId } from "../data/animals";

const storageKey = "little-safari-progress-v1";

export function useProgress() {
  const [learned, setLearned] = useState<AnimalId[]>(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(storageKey) ?? "[]",
      );
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
  });
  const [storageError, setStorageError] = useState(false);

  const save = (next: AnimalId[]) => {
    setLearned(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageError(true);
    }
  };
  const markLearned = (id: AnimalId) => {
    if (!learned.includes(id)) save([...learned, id]);
  };
  const reset = () => save([]);
  return { learned, markLearned, reset, storageError };
}
