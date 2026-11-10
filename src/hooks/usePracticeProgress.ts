import { useState } from "react";
import { learnerRecordKey } from "../data/learnerProfiles";
import { readPracticeProgress, savePracticeCompletion } from "../data/practiceProgress";
import { useLearner } from "./useLearner";

export { readPracticeProgress } from "../data/practiceProgress";

export function usePracticeProgress() {
  const { profile } = useLearner();
  const [state, setState] = useState(() => {
    try {
      return {
        completed: readPracticeProgress(localStorage.getItem(learnerRecordKey("kids-box-practice-progress-v1", profile.id))),
        storageError: false,
      };
    } catch {
      return { completed: [] as string[], storageError: true };
    }
  });
  const complete = (questionId: string) => {
    try {
      const completed = savePracticeCompletion(localStorage, profile.id, questionId);
      setState({ completed, storageError: false });
    } catch {
      setState(previous => ({ ...previous, storageError: true }));
    }
  };
  return { ...state, complete };
}
