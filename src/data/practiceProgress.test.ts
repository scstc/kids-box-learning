import { describe, expect, it } from "vitest";
import { grammarQuestions } from "./grammarQuestions";
import { placementQuestions, sentenceQuestions, pictureFixQuestions } from "./checkActivities";
import { learnerRecordKey } from "./learnerProfiles";
import { readPracticeProgress, savePracticeCompletion } from "./practiceProgress";

const allQuestions = [...grammarQuestions, ...placementQuestions, ...sentenceQuestions, ...pictureFixQuestions];
const recordKey = "kids-box-practice-progress-v1";

describe("completed questions belong to each learner", () => {
  it("restores every supported practice form without counting stale or duplicate IDs", () => {
    const ids = allQuestions.map(question => question.id);
    expect(ids).toHaveLength(108);
    expect(readPracticeProgress(JSON.stringify([...ids, ids[0], "removed-question", 7, null]))).toEqual(ids);
    for (const invalid of [null, "", "{", "{}", '"unit1-name"']) expect(readPracticeProgress(invalid)).toEqual([]);
  });

  it("keeps another learner's progress intact and merges separate question completions", () => {
    const values = new Map<string, string>();
    let writes = 0;
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); writes++; },
    };
    const first = grammarQuestions[0].id;
    const second = placementQuestions[0].id;
    expect(savePracticeCompletion(storage, "alice", first)).toEqual([first]);
    expect(savePracticeCompletion(storage, "bob", second)).toEqual([second]);
    expect(savePracticeCompletion(storage, "alice", second)).toEqual([first, second]);
    expect(readPracticeProgress(values.get(learnerRecordKey(recordKey, "bob"))!)).toEqual([second]);
    expect(savePracticeCompletion(storage, "alice", first)).toEqual([first, second]);
    expect(savePracticeCompletion(storage, "alice", "unknown")).toEqual([first, second]);
    expect(writes).toBe(3);
  });

  it("reports read and write failures so the UI cannot claim a question was saved", () => {
    expect(() => savePracticeCompletion({
      getItem: () => { throw new Error("Read blocked"); },
      setItem: () => {},
    }, "alice", grammarQuestions[0].id)).toThrow("Read blocked");
    expect(() => savePracticeCompletion({
      getItem: () => null,
      setItem: () => { throw new Error("Storage full"); },
    }, "alice", grammarQuestions[0].id)).toThrow("Storage full");
  });
});
