import { allWordEntries } from "./course";
import { verifiedBookActivities } from "./bookActivities";
import { grammarQuestions } from "./grammarQuestions";
import { placementQuestions, sentenceQuestions, pictureFixQuestions } from "./checkActivities";
import { learnerRecordKey } from "./learnerProfiles";
import { readCourseProgress } from "../hooks/useCourseProgress";
import { readPracticeProgress } from "../hooks/usePracticeProgress";

const activityIds = new Set(Object.entries(verifiedBookActivities).flatMap(([unitId, activities]) =>
  activities.map(activity => `book1:unit${unitId}:activity${activity.number}`)));
export const learnerTotals = {
  words: allWordEntries.length,
  activities: activityIds.size,
  challenges: grammarQuestions.length + placementQuestions.length + sentenceQuestions.length + pictureFixQuestions.length,
};

export function readLearnerSummary(storage: Pick<Storage, "getItem">, learnerId: string) {
  const read = (key: string) => storage.getItem(learnerRecordKey(key, learnerId));
  const progress = readCourseProgress(read("kids-box-book1-progress-v1"), read("little-safari-progress-v1"));
  let activities = 0;
  const activityRecord = read("kids-box-book-activity-progress-v1");
  try {
    const saved: unknown = JSON.parse(activityRecord ?? "[]");
    if (Array.isArray(saved)) activities = new Set(saved.filter(id => typeof id === "string" && activityIds.has(id))).size;
  } catch { /* Invalid activity records start empty. */ }
  const page = Number(read("kids-box-reader-page-v1"));
  return {
    words: progress.learned.length,
    mistakes: progress.mistakes.length,
    activities,
    challenges: readPracticeProgress(read("kids-box-practice-progress-v1")).length,
    lastUnit: progress.lastUnit,
    page: Number.isInteger(page) && page >= 4 && page <= 95 ? page : 4,
  };
}
