import { useCallback, useSyncExternalStore } from "react";
import { bookReadPreferencesStore } from "../data/bookReadPreferences";
import { useLearner } from "./useLearner";

export function useBookReadPreferences() {
  const { profile } = useLearner();
  const subscribe = useCallback((listener: () => void) => bookReadPreferencesStore.subscribe(profile.id, listener), [profile.id]);
  const getSnapshot = useCallback(() => bookReadPreferencesStore.getSnapshot(profile.id), [profile.id]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  const setEnabled = useCallback((enabled: boolean) => bookReadPreferencesStore.setEnabled(profile.id, enabled), [profile.id]);
  return { ...snapshot, setEnabled };
}
