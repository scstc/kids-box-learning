import { describe, expect, it, vi } from "vitest";
import {
  chooseLearner,
  learnerRecordKey,
  learningRecordKeys,
  openLearner,
  readLearnerRegistry,
  removeLearner,
} from "./learnerProfiles";
import { defaultLearnerAvatarId, learnerAvatars } from "./learnerAvatars";

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
  it("restores old profiles with a safe avatar without rewriting their saved records", () => {
    const raw = JSON.stringify({ profiles: [{ id: firstId, name: "Alice" }], activeId: firstId });
    const storage = memoryStorage([[registryKey, raw]]);
    expect(readLearnerRegistry(storage).profiles).toEqual([{ id: firstId, name: "Alice", avatarId: defaultLearnerAvatarId }]);
    expect(storage.getItem(registryKey)).toBe(raw);
  });

  it("saves the chosen avatar for a new learner and preserves it when reopening their name", () => {
    const storage = memoryStorage();
    const selected = learnerAvatars[1].id;
    const alice = openLearner(storage, "Alice", selected).profile;
    expect(alice.avatarId).toBe(selected);
    expect(readLearnerRegistry(storage).profiles[0]).toEqual(alice);
    expect(openLearner(storage, "  ALICE  ", defaultLearnerAvatarId).profile).toEqual(alice);
    expect(openLearner(storage, "Bob", "https://untrusted.example/avatar.svg").profile.avatarId).toBe(defaultLearnerAvatarId);
  });

  it("reopens a legacy learner without replacing their identity or learning records", () => {
    const recordKey = learnerRecordKey(learningRecordKeys[0], firstId);
    const storage = memoryStorage([
      [registryKey, JSON.stringify({ profiles: [{ id: firstId, name: "Alice" }], activeId: null })],
      [recordKey, "existing learning"],
    ]);
    const { registry, profile } = openLearner(storage, "  ALICE  ", learnerAvatars[1].id);
    expect(profile).toEqual({ id: firstId, name: "Alice", avatarId: defaultLearnerAvatarId });
    expect(registry).toEqual({ profiles: [profile], activeId: firstId });
    expect(storage.getItem(recordKey)).toBe("existing learning");
    expect(readLearnerRegistry(storage)).toEqual(registry);
  });

  it("falls back for unsupported saved avatar values instead of trusting arbitrary asset URLs", () => {
    for (const avatarId of [null, 10, {}, "unknown", "https://untrusted.example/avatar.svg"]) {
      const storage = memoryStorage([[registryKey, JSON.stringify({ profiles: [{ id: firstId, name: "Alice", avatarId }], activeId: firstId })]]);
      expect(readLearnerRegistry(storage).profiles[0].avatarId).toBe(defaultLearnerAvatarId);
    }
  });

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

  it("deletes only the selected learner and their scoped local progress/preferences", () => {
    const storage = memoryStorage([[learningRecordKeys[0], "legacy backup"], ["kids-box-reader-speed-v1", "0.75"]]);
    const alice = openLearner(storage, "Alice").profile;
    const bob = openLearner(storage, "Bob", learnerAvatars[1].id).profile;
    const ownedKeys = [...learningRecordKeys, "kids-box-ink-preferences-v1", "kids-box-tap-to-read-v1"];
    for (const key of ownedKeys) {
      storage.setItem(learnerRecordKey(key, alice.id), "Alice record");
      storage.setItem(learnerRecordKey(key, bob.id), "Bob record");
    }
    const result = removeLearner(storage, alice.id);
    expect(result.removed).toEqual(alice);
    expect(result.registry).toEqual({ profiles: [bob], activeId: bob.id });
    for (const key of ownedKeys) {
      expect(storage.getItem(learnerRecordKey(key, alice.id))).toBeNull();
      expect(storage.getItem(learnerRecordKey(key, bob.id))).toBe("Bob record");
    }
    expect(storage.getItem(learningRecordKeys[0])).toBe("legacy backup");
    expect(storage.getItem("kids-box-reader-speed-v1")).toBe("0.75");
    expect(readLearnerRegistry(storage)).toEqual(result.registry);
  });

  it("returns to the learner picker when the active profile is removed", () => {
    const storage = memoryStorage();
    const alice = openLearner(storage, "Alice").profile;
    const bob = openLearner(storage, "Bob").profile;
    expect(removeLearner(storage, bob.id).registry).toEqual({ profiles: [alice], activeId: null });
  });

  it("starts fresh when a deleted name is reused while keeping the other learner's records", () => {
    const storage = memoryStorage();
    const alice = openLearner(storage, "Alice").profile;
    const bob = openLearner(storage, "Bob").profile;
    storage.setItem(learnerRecordKey(learningRecordKeys[0], alice.id), "deleted learning");
    storage.setItem(learnerRecordKey(learningRecordKeys[0], bob.id), "Bob learning");
    removeLearner(storage, alice.id);
    const replacement = openLearner(storage, "Alice", learnerAvatars[1].id).profile;
    expect(replacement.id).not.toBe(alice.id);
    expect(replacement.avatarId).toBe(learnerAvatars[1].id);
    expect(storage.getItem(learnerRecordKey(learningRecordKeys[0], replacement.id))).toBeNull();
    expect(storage.getItem(learnerRecordKey(learningRecordKeys[0], bob.id))).toBe("Bob learning");
    expect(readLearnerRegistry(storage).profiles).toEqual([bob, replacement]);
  });

  it("does not resurrect legacy learning after all profiles have been deleted", () => {
    const storage = memoryStorage(learningRecordKeys.map(key => [key, "legacy backup"]));
    const alice = openLearner(storage, "Alice").profile;
    expect(storage.getItem(learnerRecordKey(learningRecordKeys[0], alice.id))).toBe("legacy backup");
    expect(removeLearner(storage, alice.id).registry).toEqual({ profiles: [], activeId: null });
    expect(storage.getItem(registryKey)).not.toBeNull();
    const bob = openLearner(storage, "Bob").profile;
    for (const key of learningRecordKeys) {
      expect(storage.getItem(learnerRecordKey(key, bob.id))).toBeNull();
      expect(storage.getItem(key)).toBe("legacy backup");
    }
  });

  it("rejects unknown profile deletion without touching any stored data", () => {
    const storage = memoryStorage();
    openLearner(storage, "Alice");
    const original = Object.fromEntries(storage.values);
    expect(() => removeLearner(storage, secondId)).toThrow("could not be found");
    expect(Object.fromEntries(storage.values)).toEqual(original);
  });

  it.each(["record", "registry"])("keeps the profile and restores local records if a deletion %s write fails", failure => {
    const storage = memoryStorage();
    const alice = openLearner(storage, "Alice").profile;
    for (const key of [...learningRecordKeys, "kids-box-ink-preferences-v1", "kids-box-tap-to-read-v1"])
      storage.setItem(learnerRecordKey(key, alice.id), `Alice ${key}`);
    const original = Object.fromEntries(storage.values);
    expect(() => removeLearner({
      ...storage,
      removeItem: key => {
        if (failure === "record" && key.endsWith(learningRecordKeys[1])) throw new Error("Storage blocked");
        storage.removeItem(key);
      },
      setItem: (key, value) => {
        if (failure === "registry" && key === registryKey) throw new Error("Storage blocked");
        storage.setItem(key, value);
      },
    }, alice.id)).toThrow("Storage blocked");
    expect(Object.fromEntries(storage.values)).toEqual(original);
    expect(readLearnerRegistry(storage).profiles).toEqual([alice]);
  });
});
