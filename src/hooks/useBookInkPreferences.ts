import { useRef, useState } from "react";
import { defaultInkPreferences, inkColors, inkWidths, readSavedInkPreferences, saveInkPreferences, type InkPreferences } from "../data/bookInkPreferences";
import { useLearner } from "./useLearner";

export function useBookInkPreferences() {
  const { profile } = useLearner();
  const [state, setState] = useState(() => {
    try {
      return { preferences: readSavedInkPreferences(localStorage, profile.id), storageError: false };
    } catch {
      return { preferences: { ...defaultInkPreferences }, storageError: true };
    }
  });
  const current = useRef(state.preferences);
  const needsRead = useRef(state.storageError);
  const pending = useRef<Partial<InkPreferences>>({});
  const update = (change: Partial<InkPreferences>) => {
    let next = { ...current.current, ...change };
    if (needsRead.current) {
      pending.current = { ...pending.current, ...change };
      try {
        next = { ...readSavedInkPreferences(localStorage, profile.id), ...pending.current };
        needsRead.current = false;
        pending.current = {};
      } catch {
        current.current = next;
        setState({ preferences: next, storageError: true });
        return;
      }
    }
    current.current = next;
    try {
      saveInkPreferences(localStorage, profile.id, next);
      setState({ preferences: next, storageError: false });
    } catch {
      setState({ preferences: next, storageError: true });
    }
  };
  return {
    ...state,
    setColor: (color: string) => { if (inkColors.some(preset => preset.value === color)) update({ color }); },
    setWidth: (width: number) => { if (inkWidths.some(preset => preset.value === width)) update({ width }); },
  };
}
