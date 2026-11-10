import { grammarQuestions } from "./grammarQuestions";
import { placementQuestions, sentenceQuestions, pictureFixQuestions } from "./checkActivities";
import { learnerRecordKey } from "./learnerProfiles";

const recordKey = "kids-box-practice-progress-v1";
const validIds = new Set([
  ...grammarQuestions, ...placementQuestions, ...sentenceQuestions, ...pictureFixQuestions,
].map(question => question.id));

export function readPracticeProgress(raw: string | null): string[] {
  try {
    const saved: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(saved)
      ? [...new Set(saved.filter((id): id is string => typeof id === "string" && validIds.has(id)))]
      : [];
  } catch {
    return [];
  }
}

export function savePracticeCompletion(
  storage: Pick<Storage, "getItem" | "setItem">,
  learnerId: string,
  questionId: string,
) {
  const key = learnerRecordKey(recordKey, learnerId);
  const completed = readPracticeProgress(storage.getItem(key));
  if (!validIds.has(questionId) || completed.includes(questionId)) return completed;
  const next = [...completed, questionId];
  storage.setItem(key, JSON.stringify(next));
  return next;
}
