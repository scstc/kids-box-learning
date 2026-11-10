import { learnerRecordKey } from "./learnerProfiles";

export type BookReadPreferences = { enabled: boolean; storageError: boolean };
export const bookReadPreferenceKey = "kids-box-tap-to-read-v1";

export function readBookReadPreference(raw: string | null): boolean {
  return raw !== "off";
}

export function createBookReadPreferencesStore(storage: Pick<Storage, "getItem" | "setItem">) {
  const learners = new Map<string, { snapshot: BookReadPreferences; listeners: Set<() => void> }>();
  const entryFor = (learnerId: string) => {
    let entry = learners.get(learnerId);
    if (!entry) {
      let snapshot: BookReadPreferences;
      try {
        snapshot = { enabled: readBookReadPreference(storage.getItem(learnerRecordKey(bookReadPreferenceKey, learnerId))), storageError: false };
      } catch {
        snapshot = { enabled: true, storageError: true };
      }
      entry = { snapshot, listeners: new Set() };
      learners.set(learnerId, entry);
    }
    return entry;
  };
  return {
    getSnapshot: (learnerId: string) => entryFor(learnerId).snapshot,
    subscribe(learnerId: string, listener: () => void) {
      const entry = entryFor(learnerId);
      entry.listeners.add(listener);
      return () => { entry.listeners.delete(listener); };
    },
    setEnabled(learnerId: string, enabled: boolean) {
      const entry = entryFor(learnerId);
      let storageError = false;
      try {
        storage.setItem(learnerRecordKey(bookReadPreferenceKey, learnerId), enabled ? "on" : "off");
      } catch {
        storageError = true;
      }
      if (entry.snapshot.enabled === enabled && entry.snapshot.storageError === storageError) return;
      entry.snapshot = { enabled, storageError };
      entry.listeners.forEach(listener => listener());
    },
  };
}

export const bookReadPreferencesStore = createBookReadPreferencesStore({
  getItem: key => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
});
