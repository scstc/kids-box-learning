import { useCallback, useSyncExternalStore } from "react";
import { bookInkRepository, type InkStroke } from "../data/bookInk";

export function useBookInk(learnerId: string, page: number) {
  const subscribe = useCallback((listener: () => void) => bookInkRepository.subscribe({ learnerId, page }, listener), [learnerId, page]);
  const getSnapshot = useCallback(() => bookInkRepository.getSnapshot({ learnerId, page }), [learnerId, page]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  const subscribeLearner = useCallback((listener: () => void) => bookInkRepository.subscribeLearner(learnerId, listener), [learnerId]);
  const getLearnerSnapshot = useCallback(() => bookInkRepository.getLearnerSnapshot(learnerId), [learnerId]);
  const learnerSnapshot = useSyncExternalStore(subscribeLearner, getLearnerSnapshot);
  return {
    ...snapshot,
    ...learnerSnapshot,
    learnerId,
    page,
    commit: (strokes: InkStroke[]) => bookInkRepository.commit({ learnerId, page }, strokes),
    undo: () => bookInkRepository.undo({ learnerId, page }),
    retry: () => bookInkRepository.retry({ learnerId, page }),
    retryFailed: () => bookInkRepository.retryFailed(learnerId),
  };
}

export type BookInk = ReturnType<typeof useBookInk>;
