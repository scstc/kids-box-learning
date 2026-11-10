import { describe, expect, it, vi } from "vitest";
import {
  chooseLearner,
  learnerRecordKey,
  learningRecordKeys,
  openLearner,
  readLearnerRegistry,
} from "./learnerProfiles";

const registryKey = "kids-box-learners-v1";
const firstId = "f26d0109-129c-4e57-8c57-cb777297bde1";
const secondId = "5fc3ce24-aa2f-4db1-b095-3012f83ddc21";

function memoryStorage(initial: [string, string][] = []) {
  const values = new Map(initial);
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

describe("local learner profiles", () => {
  it("creates UUIDs on older tablet WebViews without randomUUID", () => {
    const getRandomValues = crypto.getRandomValues.bind(crypto);
    vi.stubGlobal("crypto", { getRandomValues });
    try {
      const { profile } = openLearner(memoryStorage(), "Alice");
      expect(profile.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("gives only the first learner a copy of all existing records, keeping originals", () => {
    const legacy = learningRecordKeys.map((key, index): [string, string] => [key, `record-${index}`]);
    const storage = memoryStorage(legacy);
    const first = openLearner(storage, "Alice");
    expect(first.profile.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(first.registry.activeId).toBe(first.profile.id);
    for (const [key, value] of legacy) {
      expect(storage.getItem(learnerRecordKey(key, first.profile.id))).toBe(value);
      expect(storage.getItem(key)).toBe(value);
    }
    const second = openLearner(storage, "Bob");
    expect(second.profile.id).not.toBe(first.profile.id);
    for (const key of learningRecordKeys)
      expect(storage.getItem(learnerRecordKey(key, second.profile.id))).toBeNull();
    expect(readLearnerRegistry(storage)).toEqual(second.registry);
  });

  it("reopens normalized names and switches stable profiles without changing their progress", () => {
    const storage = memoryStorage();
    const alice = openLearner(storage, "  Ａlice   Smith  ").profile;
    expect(alice.name).toBe("Alice Smith");
    const aliceKey = learnerRecordKey(learningRecordKeys[0], alice.id);
    storage.setItem(aliceKey, "Alice progress");
    const bob = openLearner(storage, "小 明").profile;
    const bobKey = learnerRecordKey(learningRecordKeys[0], bob.id);
    storage.setItem(bobKey, "Bob progress");
    expect(openLearner(storage, "alice smith").profile).toEqual(alice);
    expect(chooseLearner(storage, bob.id).profile).toEqual(bob);
    expect(readLearnerRegistry(storage).profiles).toEqual([alice, bob]);
    expect(storage.getItem(aliceKey)).toBe("Alice progress");
    expect(storage.getItem(bobKey)).toBe("Bob progress");
  });

  it.each(["", "   ", "A\nB", "A\tB", "A\u0000B", "A\u202eB", "a".repeat(33)])(
    "rejects invalid names before saving: %j", (name) => {
      const storage = memoryStorage();
      expect(() => openLearner(storage, name)).toThrow();
      expect(storage.values.size).toBe(0);
    },
  );

  it.each([
    "{",
    "null",
    "[]",
    JSON.stringify({ profiles: [], activeId: firstId }),
    JSON.stringify({ profiles: [{ id: firstId, name: "A" }, { id: firstId, name: "B" }], activeId: firstId }),
    JSON.stringify({ profiles: [{ id: firstId, name: "Alice" }, { id: secondId, name: "alice" }], activeId: firstId }),
    JSON.stringify({ profiles: [{ id: "bad-id", name: "A" }], activeId: null }),
    JSON.stringify({ profiles: [{ id: firstId, name: "" }], activeId: firstId }),
  ])("keeps damaged registries intact for recovery: %s", (raw) => {
    const storage = memoryStorage([[registryKey, raw], [learningRecordKeys[0], "backup"]]);
    expect(() => readLearnerRegistry(storage)).toThrow("Saved learner profiles");
    expect(() => openLearner(storage, "New learner")).toThrow("Saved learner profiles");
    expect(storage.getItem(registryKey)).toBe(raw);
    expect(storage.values.size).toBe(2);
  });

  it("fails an unknown selection without overwriting the active learner", () => {
    const storage = memoryStorage();
    const { registry } = openLearner(storage, "Alice");
    expect(() => chooseLearner(storage, secondId)).toThrow("could not be found");
    expect(readLearnerRegistry(storage)).toEqual(registry);
  });

  it.each(["record", "registry"])("rolls back migration when a %s write fails", (failure) => {
    const legacy = learningRecordKeys.map((key): [string, string] => [key, "backup"]);
    const storage = memoryStorage(legacy);
    const failing = {
      ...storage,
      setItem: (key: string, value: string) => {
        if (failure === "registry" ? key === registryKey : key.endsWith(learningRecordKeys[1]))
          throw new Error("Storage full");
        storage.setItem(key, value);
      },
    };
    expect(() => openLearner(failing, "Alice")).toThrow("Storage full");
    expect(Object.fromEntries(storage.values)).toEqual(Object.fromEntries(legacy));
    expect(readLearnerRegistry(storage)).toEqual({ profiles: [], activeId: null });
  });

  it("reports a blocked switch instead of announcing a new active learner", () => {
    const storage = memoryStorage();
    const alice = openLearner(storage, "Alice").profile;
    const bob = openLearner(storage, "Bob").profile;
    expect(() => chooseLearner({
      ...storage,
      setItem: () => { throw new Error("Storage blocked"); },
    }, alice.id)).toThrow("Storage blocked");
    expect(readLearnerRegistry(storage).activeId).toBe(bob.id);
  });
});
