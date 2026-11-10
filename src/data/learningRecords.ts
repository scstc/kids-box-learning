import { learnerRecordKey, learningRecordKeys } from "./learnerProfiles";

// Keep an explicit empty course record so legacy progress cannot be imported again.
export function clearLearningRecords(
  storage: Pick<Storage, "setItem" | "removeItem">,
  learnerId?: string,
) {
  const progress = { learned: [] as string[], mistakes: [] as string[], lastUnit: 1 };
  const keyFor = (baseKey: string) => learnerId ? learnerRecordKey(baseKey, learnerId) : baseKey;
  storage.setItem(keyFor(learningRecordKeys[0]), JSON.stringify(progress));
  for (const key of learningRecordKeys.slice(1)) storage.removeItem(keyFor(key));
  return progress;
}
