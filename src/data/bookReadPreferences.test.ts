import { describe, expect, it, vi } from "vitest";
import { bookReadPreferenceKey, createBookReadPreferencesStore, readBookReadPreference } from "./bookReadPreferences";
import { learnerRecordKey } from "./learnerProfiles";
import { clearLearningRecords } from "./learningRecords";

function memoryStorage(values = new Map<string, string>()) {
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

describe("each learner controls tap to read throughout the book", () => {
  it("starts enabled and accepts only the explicit off value as disabled", () => {
    for (const raw of [null, "on", "", "false", "0", "OFF", "{}", "broken"]) expect(readBookReadPreference(raw)).toBe(true);
    expect(readBookReadPreference("off")).toBe(false);
  });

  it("persists on/off under each learner key and restores it without borrowing another learner's choice", () => {
    const storage = memoryStorage(new Map([[bookReadPreferenceKey, "off"]]));
    const store = createBookReadPreferencesStore(storage);
    expect(store.getSnapshot("alice")).toEqual({ enabled: true, storageError: false });
    store.setEnabled("alice", false);
    expect(storage.values.get(learnerRecordKey(bookReadPreferenceKey, "alice"))).toBe("off");
    expect(store.getSnapshot("bob")).toEqual({ enabled: true, storageError: false });
    const reopened = createBookReadPreferencesStore(storage);
    expect(reopened.getSnapshot("alice").enabled).toBe(false);
    expect(reopened.getSnapshot("bob").enabled).toBe(true);
    reopened.setEnabled("alice", true);
    expect(storage.values.get(learnerRecordKey(bookReadPreferenceKey, "alice"))).toBe("on");
  });

  it("synchronizes embedded and fullscreen subscribers immediately while keeping other learners stable", () => {
    const store = createBookReadPreferencesStore(memoryStorage());
    const embedded = vi.fn();
    const fullscreen = vi.fn();
    const other = vi.fn();
    const closeEmbedded = store.subscribe("alice", embedded);
    store.subscribe("alice", fullscreen);
    store.subscribe("bob", other);
    const bob = store.getSnapshot("bob");
    const original = store.getSnapshot("alice");
    expect(store.getSnapshot("alice")).toBe(original);
    store.setEnabled("alice", false);
    expect(embedded).toHaveBeenCalledTimes(1);
    expect(fullscreen).toHaveBeenCalledTimes(1);
    expect(other).not.toHaveBeenCalled();
    expect(store.getSnapshot("bob")).toBe(bob);
    const snapshot = store.getSnapshot("alice");
    store.setEnabled("alice", false);
    expect(store.getSnapshot("alice")).toBe(snapshot);
    closeEmbedded();
    store.setEnabled("alice", true);
    expect(embedded).toHaveBeenCalledTimes(1);
    expect(fullscreen).toHaveBeenCalledTimes(2);
  });

  it("applies a failed save to every open reader, reports it, and supports retrying the same choice", () => {
    const storage = memoryStorage();
    const write = vi.fn().mockImplementationOnce(() => { throw new Error("Storage full"); }).mockImplementation(storage.setItem);
    const store = createBookReadPreferencesStore({ getItem: storage.getItem, setItem: write });
    const reader = vi.fn();
    store.subscribe("alice", reader);
    store.setEnabled("alice", false);
    expect(store.getSnapshot("alice")).toEqual({ enabled: false, storageError: true });
    expect(reader).toHaveBeenCalledTimes(1);
    expect(storage.values.has(learnerRecordKey(bookReadPreferenceKey, "alice"))).toBe(false);
    // Opening another reader uses the unsaved choice instead of re-enabling speech.
    const secondReader = vi.fn();
    store.subscribe("alice", secondReader);
    expect(store.getSnapshot("alice").enabled).toBe(false);
    store.setEnabled("alice", false);
    expect(store.getSnapshot("alice")).toEqual({ enabled: false, storageError: false });
    expect(storage.values.get(learnerRecordKey(bookReadPreferenceKey, "alice"))).toBe("off");
    expect(secondReader).toHaveBeenCalledTimes(1);
  });

  it("reports unreadable settings and lets an explicit choice recover after storage becomes available", () => {
    const storage = memoryStorage();
    const read = vi.fn().mockImplementationOnce(() => { throw new Error("Read blocked"); }).mockImplementation(storage.getItem);
    const store = createBookReadPreferencesStore({ getItem: read, setItem: storage.setItem });
    expect(store.getSnapshot("alice")).toEqual({ enabled: true, storageError: true });
    store.setEnabled("alice", false);
    expect(store.getSnapshot("alice")).toEqual({ enabled: false, storageError: false });
    expect(storage.values.get(learnerRecordKey(bookReadPreferenceKey, "alice"))).toBe("off");
  });

  it("preserves the tap-to-read choice when clearing learning progress", () => {
    const storage = memoryStorage();
    const store = createBookReadPreferencesStore(storage);
    store.setEnabled("alice", false);
    clearLearningRecords(storage, "alice");
    expect(createBookReadPreferencesStore(storage).getSnapshot("alice")).toEqual({ enabled: false, storageError: false });
  });
});
