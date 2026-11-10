import { describe, expect, it } from "vitest";
import { allWordEntries, entryKey } from "./course";
import { verifiedBookActivities } from "./bookActivities";
import { grammarQuestions } from "./grammarQuestions";
import { placementQuestions, sentenceQuestions, pictureFixQuestions } from "./checkActivities";
import { learnerRecordKey, learningRecordKeys } from "./learnerProfiles";
import { learnerTotals, readLearnerSummary } from "./learnerSummary";

const emptySummary = { words: 0, mistakes: 0, activities: 0, challenges: 0, lastUnit: 1, page: 4 };
const wordIds = allWordEntries.map(entryKey);
const activityIds = Object.entries(verifiedBookActivities).flatMap(([unitId, activities]) =>
  activities.map(activity => `book1:unit${unitId}:activity${activity.number}`));
const challengeIds = [...grammarQuestions, ...placementQuestions, ...sentenceQuestions, ...pictureFixQuestions].map(question => question.id);
const storageOf = (values: Map<string, string>) => ({ getItem: (key: string) => values.get(key) ?? null });
const scoped = (learnerId: string, key: string, value: unknown): [string, string] =>
  [learnerRecordKey(key, learnerId), JSON.stringify(value)];

describe("each learner's progress summary", () => {
  it("reads only the requested learner, ignoring other learners and unmigrated global records", () => {
    const values = new Map([
      scoped("alice", "kids-box-book1-progress-v1", { learned: [wordIds[0]], mistakes: [wordIds[1]], lastUnit: 7 }),
      scoped("alice", "kids-box-book-activity-progress-v1", [activityIds[0]]),
      scoped("alice", "kids-box-practice-progress-v1", [challengeIds[0]]),
      scoped("alice", "kids-box-reader-page-v1", 48),
      scoped("bob", "kids-box-book1-progress-v1", { learned: wordIds.slice(0, 2), mistakes: [], lastUnit: 2 }),
      scoped("bob", "kids-box-reader-page-v1", 14),
      ["kids-box-book1-progress-v1", JSON.stringify({ learned: wordIds, mistakes: wordIds, lastUnit: 12 })],
      ["little-safari-progress-v1", '["giraffe"]'],
      ["kids-box-book-activity-progress-v1", JSON.stringify(activityIds)],
      ["kids-box-practice-progress-v1", JSON.stringify(challengeIds)],
      ["kids-box-reader-page-v1", "95"],
    ]);
    const storage = storageOf(values);
    expect(readLearnerSummary(storage, "alice")).toEqual({ words: 1, mistakes: 1, activities: 1, challenges: 1, lastUnit: 7, page: 48 });
    expect(readLearnerSummary(storage, "bob")).toEqual({ ...emptySummary, words: 2, lastUnit: 2, page: 14 });
    expect(readLearnerSummary(storage, "new-learner")).toEqual(emptySummary);
  });

  it("counts the complete known curriculum once and ignores stale IDs and non-string values", () => {
    const noisy = (ids: string[]) => [...ids, ids[0], "removed-item", 5, null, {}, false];
    const storage = storageOf(new Map([
      scoped("alice", "kids-box-book1-progress-v1", { learned: noisy(wordIds), mistakes: noisy(wordIds), lastUnit: 12 }),
      scoped("alice", "kids-box-book-activity-progress-v1", noisy(activityIds)),
      scoped("alice", "kids-box-practice-progress-v1", noisy(challengeIds)),
      scoped("alice", "kids-box-reader-page-v1", 95),
    ]));
    expect(learnerTotals.challenges).toBe(108);
    expect(readLearnerSummary(storage, "alice")).toEqual({
      words: learnerTotals.words,
      mistakes: learnerTotals.words,
      activities: learnerTotals.activities,
      challenges: learnerTotals.challenges,
      lastUnit: 12,
      page: 95,
    });
  });

  it("defaults damaged individual records without counting their properties as progress", () => {
    const values = new Map([
      scoped("alice", "kids-box-book1-progress-v1", { learned: "all", mistakes: {}, lastUnit: 13 }),
      scoped("alice", "kids-box-book-activity-progress-v1", { [activityIds[0]]: true }),
      scoped("alice", "kids-box-practice-progress-v1", { [challengeIds[0]]: true }),
      scoped("alice", "kids-box-reader-page-v1", 48.5),
    ]);
    expect(readLearnerSummary(storageOf(values), "alice")).toEqual(emptySummary);
    for (const key of learningRecordKeys) values.set(learnerRecordKey(key, "alice"), "{broken");
    expect(readLearnerSummary(storageOf(values), "alice")).toEqual(emptySummary);
  });

  it("uses the learner's legacy animal record only until an explicit course record exists", () => {
    const values = new Map([scoped("alice", "little-safari-progress-v1", ["giraffe", "giraffe", "unknown"])]);
    expect(readLearnerSummary(storageOf(values), "alice")).toEqual({ ...emptySummary, words: 1 });
    values.set(...scoped("alice", "kids-box-book1-progress-v1", { learned: [], mistakes: [], lastUnit: 1 }));
    expect(readLearnerSummary(storageOf(values), "alice")).toEqual(emptySummary);
  });

  it.each(learningRecordKeys)("reports storage read failure for %s instead of showing an empty progress count", baseKey => {
    const key = learnerRecordKey(baseKey, "alice");
    expect(() => readLearnerSummary({
      getItem: requestedKey => {
        if (requestedKey === key) throw new Error("Storage read blocked");
        return null;
      },
    }, "alice")).toThrow("Storage read blocked");
  });
});
