import { describe, expect, it, vi } from "vitest";
import { createInkRepository, eraseInkStrokes, normalizedInkPoint, validInkStrokes, type InkPage, type InkStroke } from "./bookInk";

const stroke = (id: string, y = 0.2): InkStroke => ({ id, color: "#6941c6", width: 0.0032, points: [{ x: 0.1, y }, { x: 0.9, y }] });
const alice: InkPage = { learnerId: "alice", page: 14 };
const bob: InkPage = { learnerId: "bob", page: 14 };
const later: InkPage = { learnerId: "alice", page: 15 };
const key = (page: InkPage) => JSON.stringify([page.learnerId, page.page]);
const deferred = () => {
  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

describe("handwriting stays aligned with the original book", () => {
  it("uses page-relative positions across resizing and clamps captured pointers to the paper", () => {
    expect(normalizedInkPoint(200, 350, { left: 100, top: 150, width: 400, height: 800 })).toEqual({ x: 0.25, y: 0.25 });
    expect(normalizedInkPoint(300, 550, { left: 100, top: 150, width: 800, height: 1600 })).toEqual({ x: 0.25, y: 0.25 });
    expect(normalizedInkPoint(-10, 900, { left: 0, top: 0, width: 400, height: 800 })).toEqual({ x: 0, y: 1 });
  });

  it("erases a whole crossed stroke even when a fast pen skips over it, while keeping nearby writing", () => {
    const strokes = [stroke("crossed", 0.4), stroke("kept", 0.8)];
    expect(eraseInkStrokes(strokes, { x: 0.5, y: 0.2 }, { x: 0.5, y: 0.6 }, 0.01)).toEqual([strokes[1]]);
    expect(eraseInkStrokes(strokes, { x: 0.5, y: 0.3 }, { x: 0.5, y: 0.3 }, 0.01)).toBe(strokes);
  });

  it("can erase a pen tap as well as a continuous line", () => {
    const dot = { ...stroke("dot"), points: [{ x: 0.2, y: 0.2 }] };
    expect(eraseInkStrokes([dot], { x: 0.2, y: 0.2 }, { x: 0.2, y: 0.2 }, 0.01)).toEqual([]);
  });

  it("rejects malformed saved points without throwing or accepting an unreadable page", () => {
    expect(validInkStrokes([stroke("valid")])).toBe(true);
    for (const point of [null, undefined, 0, "point", {}, { x: 0.2 }, { x: NaN, y: 0.2 }, { x: 0.2, y: 2 }]) {
      expect(validInkStrokes([{ ...stroke("invalid"), points: [point] }])).toBe(false);
    }
  });
});

describe("persistent notes belong to one learner and one printed page", () => {
  it("loads and saves three independent documents without mixing the same page between children", async () => {
    const saved = new Map<string, InkStroke[]>();
    const repository = createInkRepository({ read: async page => saved.get(key(page)) ?? [], write: async (page, strokes) => { saved.set(key(page), strokes); } });
    [alice, bob, later].forEach(page => repository.subscribe(page, () => {}));
    await vi.waitFor(() => expect([alice, bob, later].map(page => repository.getSnapshot(page).status)).toEqual(["saved", "saved", "saved"]));
    repository.commit(alice, [stroke("Alice p14")]);
    repository.commit(bob, [stroke("Bob p14")]);
    repository.commit(later, [stroke("Alice p15")]);
    await Promise.all([alice, bob, later].map(page => repository.settled(page)));
    expect(saved.get(key(alice))?.[0].id).toBe("Alice p14");
    expect(saved.get(key(bob))?.[0].id).toBe("Bob p14");
    expect(saved.get(key(later))?.[0].id).toBe("Alice p15");
    const reopened = createInkRepository({ read: async page => saved.get(key(page)) ?? [], write: async () => {} });
    reopened.subscribe(alice, () => {});
    await vi.waitFor(() => expect(reopened.getSnapshot(alice).strokes[0]?.id).toBe("Alice p14"));
  });

  it("finishes old writes before newer ones and continues saving after the reader closes", async () => {
    const first = deferred();
    const second = deferred();
    const write = vi.fn().mockImplementationOnce(() => first.promise).mockImplementationOnce(() => second.promise);
    const repository = createInkRepository({ read: async () => [], write });
    const unsubscribe = repository.subscribe(alice, () => {});
    await vi.waitFor(() => expect(repository.getSnapshot(alice).status).toBe("saved"));
    repository.commit(alice, [stroke("old")]);
    repository.commit(alice, [stroke("old"), stroke("latest")]);
    unsubscribe();
    await vi.waitFor(() => expect(write).toHaveBeenCalledTimes(1));
    first.resolve();
    await vi.waitFor(() => expect(write).toHaveBeenCalledTimes(2));
    expect(repository.getSnapshot(alice).status).toBe("saving");
    expect(write.mock.calls[1][1].map((item: InkStroke) => item.id)).toEqual(["old", "latest"]);
    second.resolve();
    await repository.settled(alice);
    repository.subscribe(alice, () => {});
    expect(repository.getSnapshot(alice)).toMatchObject({ status: "saved", strokes: [stroke("old"), stroke("latest")] });
  });

  it("keeps unsaved writing available for retry instead of reporting a failed transaction as Saved", async () => {
    const write = vi.fn().mockRejectedValueOnce(new Error("Storage full")).mockResolvedValue(undefined);
    const repository = createInkRepository({ read: async () => [], write });
    repository.subscribe(alice, () => {});
    await vi.waitFor(() => expect(repository.getSnapshot(alice).status).toBe("saved"));
    repository.commit(alice, [stroke("keep me")]);
    await repository.settled(alice);
    expect(repository.getSnapshot(alice)).toMatchObject({ status: "save-error", strokes: [stroke("keep me")] });
    repository.retry(alice);
    await repository.settled(alice);
    expect(write).toHaveBeenLastCalledWith(alice, [stroke("keep me")]);
    expect(repository.getSnapshot(alice).status).toBe("saved");
  });

  it("reports an old page's delayed save failure after changing pages, then retries that page for its learner", async () => {
    const oldPageSave = deferred();
    const write = vi.fn().mockImplementationOnce(() => oldPageSave.promise).mockResolvedValue(undefined);
    const repository = createInkRepository({ read: async () => [], write });
    const notices = vi.fn();
    repository.subscribeLearner(alice.learnerId, notices);
    const closeOldPage = repository.subscribe(alice, () => {});
    repository.subscribe(later, () => {});
    await vi.waitFor(() => expect(repository.getSnapshot(alice).status).toBe("saved"));
    const original = repository.getLearnerSnapshot(alice.learnerId);
    expect(repository.getLearnerSnapshot(alice.learnerId)).toBe(original);
    repository.commit(alice, [stroke("keep after leaving")]);
    closeOldPage();
    expect(repository.getSnapshot(later).status).toBe("saved");
    expect(repository.getLearnerSnapshot(alice.learnerId)).toEqual({ savingPages: [14], failedPages: [] });
    await vi.waitFor(() => expect(write).toHaveBeenCalledTimes(1));
    oldPageSave.reject(new Error("Storage unavailable"));
    await repository.settled(alice);
    expect(repository.getLearnerSnapshot(alice.learnerId)).toEqual({ savingPages: [], failedPages: [14] });
    expect(repository.getSnapshot(alice).strokes).toEqual([stroke("keep after leaving")]);
    expect(repository.hasUnsaved()).toBe(true);
    expect(notices).toHaveBeenCalledTimes(2);
    repository.retryFailed(alice.learnerId);
    await repository.settled(alice);
    expect(write).toHaveBeenLastCalledWith(alice, [stroke("keep after leaving")]);
    expect(repository.getLearnerSnapshot(alice.learnerId)).toEqual({ savingPages: [], failedPages: [] });
    expect(repository.hasUnsaved()).toBe(false);
  });

  it("retries only the selected learner's failed pages and keeps aggregate snapshots stable on unrelated changes", async () => {
    const write = vi.fn().mockRejectedValue(new Error("Storage unavailable"));
    const repository = createInkRepository({ read: async () => [], write });
    [alice, bob, later].forEach(page => repository.subscribe(page, () => {}));
    await vi.waitFor(() => expect([alice, bob, later].map(page => repository.getSnapshot(page).status)).toEqual(["saved", "saved", "saved"]));
    const bobSnapshot = repository.getLearnerSnapshot(bob.learnerId);
    repository.commit(alice, [stroke("Alice")]);
    expect(repository.getLearnerSnapshot(bob.learnerId)).toBe(bobSnapshot);
    repository.commit(bob, [stroke("Bob")]);
    await Promise.all([repository.settled(alice), repository.settled(bob)]);
    write.mockResolvedValue(undefined);
    repository.retryFailed(alice.learnerId);
    await repository.settled(alice);
    expect(write).toHaveBeenCalledTimes(3);
    expect(repository.getLearnerSnapshot(alice.learnerId).failedPages).toEqual([]);
    expect(repository.getLearnerSnapshot(bob.learnerId).failedPages).toEqual([14]);
  });

  it("does not overwrite unreadable notes with an empty page; a successful retry restores them", async () => {
    const read = vi.fn().mockRejectedValueOnce(new Error("Unavailable")).mockResolvedValue([stroke("original")]);
    const write = vi.fn();
    const repository = createInkRepository({ read, write });
    repository.subscribe(alice, () => {});
    await vi.waitFor(() => expect(repository.getSnapshot(alice).status).toBe("load-error"));
    repository.commit(alice, [stroke("new")]);
    expect(write).not.toHaveBeenCalled();
    repository.retry(alice);
    await vi.waitFor(() => expect(repository.getSnapshot(alice)).toMatchObject({ status: "saved", strokes: [stroke("original")] }));
  });

  it("undo restores erased strokes and persists the restoration", async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    const original = [stroke("original")];
    const repository = createInkRepository({ read: async () => original, write });
    repository.subscribe(alice, () => {});
    await vi.waitFor(() => expect(repository.getSnapshot(alice).status).toBe("saved"));
    repository.commit(alice, []);
    expect(repository.getSnapshot(alice).canUndo).toBe(true);
    repository.undo(alice);
    await repository.settled(alice);
    expect(repository.getSnapshot(alice)).toMatchObject({ strokes: original, status: "saved", canUndo: false });
    expect(write).toHaveBeenLastCalledWith(alice, original);
  });
});

describe("deleting a learner's handwriting", () => {
  it("waits for every queued write and the deletion transaction, blocking new gestures until deletion finishes", async () => {
    const firstWrite = deferred();
    const secondWrite = deferred();
    const remove = deferred();
    const saved = new Map<string, InkStroke[]>();
    const write = vi.fn().mockImplementationOnce(async (page: InkPage, strokes: InkStroke[]) => {
      await firstWrite.promise;
      saved.set(key(page), strokes);
    }).mockImplementationOnce(async (page: InkPage, strokes: InkStroke[]) => {
      await secondWrite.promise;
      saved.set(key(page), strokes);
    });
    const deleteLearner = vi.fn(async (learnerId: string) => {
      await remove.promise;
      for (const savedKey of saved.keys()) if (JSON.parse(savedKey)[0] === learnerId) saved.delete(savedKey);
    });
    const repository = createInkRepository({ read: async () => [], write, deleteLearner });
    repository.subscribe(alice, () => {});
    await vi.waitFor(() => expect(repository.getSnapshot(alice).status).toBe("saved"));
    repository.commit(alice, [stroke("first")]);
    repository.commit(alice, [stroke("first"), stroke("second")]);
    const deletion = repository.deleteLearner(alice.learnerId);
    expect(repository.deleteLearner(alice.learnerId)).toBe(deletion);
    repository.commit(alice, [stroke("blocked")]);
    repository.undo(alice);
    repository.retry(alice);
    repository.retryFailed(alice.learnerId);
    await vi.waitFor(() => expect(write).toHaveBeenCalledTimes(1));
    expect(deleteLearner).not.toHaveBeenCalled();
    firstWrite.resolve();
    await vi.waitFor(() => expect(write).toHaveBeenCalledTimes(2));
    expect(deleteLearner).not.toHaveBeenCalled();
    secondWrite.resolve();
    await vi.waitFor(() => expect(deleteLearner).toHaveBeenCalledWith(alice.learnerId));
    expect(repository.getSnapshot(alice).strokes.map(item => item.id)).toEqual(["first", "second"]);
    expect(saved.has(key(alice))).toBe(true);
    remove.resolve();
    await deletion;
    expect(saved.has(key(alice))).toBe(false);
    expect(repository.getSnapshot(alice)).toMatchObject({ strokes: [], canUndo: false, status: "saved" });
    expect(repository.hasUnsaved()).toBe(false);
    expect(write).toHaveBeenCalledTimes(2);
  });

  it("deletes all the learner's saved pages including unopened pages, while preserving another learner's data and cache", async () => {
    const unopened = { learnerId: alice.learnerId, page: 95 };
    const saved = new Map([alice, later, unopened, bob].map(page => [key(page), [stroke(`${page.learnerId}-${page.page}`)]]));
    const read = vi.fn(async (page: InkPage) => saved.get(key(page)) ?? []);
    const repository = createInkRepository({
      read,
      write: async (page, strokes) => { saved.set(key(page), strokes); },
      deleteLearner: async learnerId => { for (const savedKey of saved.keys()) if (JSON.parse(savedKey)[0] === learnerId) saved.delete(savedKey); },
    });
    const closeAlice = repository.subscribe(alice, () => {});
    repository.subscribe(bob, () => {});
    await vi.waitFor(() => expect(repository.getSnapshot(alice).strokes[0]?.id).toBe("alice-14"));
    const bobCache = repository.getSnapshot(bob);
    closeAlice();
    await repository.deleteLearner(alice.learnerId);
    expect([...saved.keys()]).toEqual([key(bob)]);
    expect(repository.getSnapshot(bob)).toBe(bobCache);
    expect(repository.getLearnerSnapshot(alice.learnerId)).toEqual({ savingPages: [], failedPages: [] });
    repository.subscribe(alice, () => {});
    repository.subscribe(later, () => {});
    repository.subscribe(unopened, () => {});
    await vi.waitFor(() => expect([alice, later, unopened].map(page => repository.getSnapshot(page))).toEqual([
      { strokes: [], status: "saved", canUndo: false },
      { strokes: [], status: "saved", canUndo: false },
      { strokes: [], status: "saved", canUndo: false },
    ]));
    expect(read.mock.calls.filter(([page]) => key(page) === key(alice))).toHaveLength(2);
  });

  it("keeps strokes, undo history and failed saves retryable if deletion fails, without touching other learners", async () => {
    const saved = new Map([[key(bob), [stroke("Bob's notes")]]]);
    const write = vi.fn().mockRejectedValueOnce(new Error("Write failed")).mockImplementation(async (page: InkPage, strokes: InkStroke[]) => { saved.set(key(page), strokes); });
    const deleteLearner = vi.fn().mockRejectedValueOnce(new Error("Delete failed")).mockImplementation(async (learnerId: string) => {
      for (const savedKey of saved.keys()) if (JSON.parse(savedKey)[0] === learnerId) saved.delete(savedKey);
    });
    const repository = createInkRepository({ read: async page => saved.get(key(page)) ?? [], write, deleteLearner });
    repository.subscribe(alice, () => {});
    repository.subscribe(bob, () => {});
    await vi.waitFor(() => expect(repository.getSnapshot(alice).status).toBe("saved"));
    repository.commit(alice, [stroke("keep until deletion succeeds")]);
    await repository.settled(alice);
    const aliceCache = repository.getSnapshot(alice);
    const bobCache = repository.getSnapshot(bob);
    await expect(repository.deleteLearner(alice.learnerId)).rejects.toThrow("Delete failed");
    expect(repository.getSnapshot(alice)).toBe(aliceCache);
    expect(repository.getSnapshot(alice)).toMatchObject({ status: "save-error", canUndo: true });
    expect(repository.getSnapshot(bob)).toBe(bobCache);
    repository.retryFailed(alice.learnerId);
    await repository.settled(alice);
    expect(saved.get(key(alice))).toEqual([stroke("keep until deletion succeeds")]);
    await repository.deleteLearner(alice.learnerId);
    expect(repository.getSnapshot(alice)).toMatchObject({ strokes: [], status: "saved", canUndo: false });
    expect(saved.get(key(bob))).toEqual([stroke("Bob's notes")]);
    expect(deleteLearner).toHaveBeenCalledTimes(2);
  });

  it("does not restore old cached strokes if an earlier page read resolves after deletion", async () => {
    let finishRead!: (strokes: InkStroke[]) => void;
    const repository = createInkRepository({
      read: () => new Promise<InkStroke[]>(resolve => { finishRead = resolve; }),
      write: async () => {},
      deleteLearner: async () => {},
    });
    repository.subscribe(alice, () => {});
    await repository.deleteLearner(alice.learnerId);
    finishRead([stroke("deleted notes")]);
    await Promise.resolve();
    expect(repository.getSnapshot(alice)).toMatchObject({ strokes: [], status: "saved", canUndo: false });
  });
});
