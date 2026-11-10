export type LearnerProfile = { id: string; name: string };
export type LearnerRegistry = {
  profiles: LearnerProfile[];
  activeId: string | null;
};

const registryKey = "kids-box-learners-v1";
export const learningRecordKeys = [
  "kids-box-book1-progress-v1",
  "kids-box-book-activity-progress-v1",
  "little-safari-progress-v1",
  "kids-box-reader-page-v1",
  "kids-box-practice-progress-v1",
];

function normalizeName(name: string) {
  if (/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(name))
    throw new Error("Names cannot contain control characters.");
  const normalized = name.normalize("NFKC").trim().replace(/\s+/gu, " ");
  if (!normalized) throw new Error("Enter a learner name.");
  if (normalized.length > 32)
    throw new Error("Use a name with 32 characters or fewer.");
  return normalized;
}

export function learnerRecordKey(baseKey: string, learnerId: string) {
  return `kids-box-learner:${learnerId}:${baseKey}`;
}

export function readLearnerRegistry(
  storage: Pick<Storage, "getItem">,
): LearnerRegistry {
  const raw = storage.getItem(registryKey);
  if (raw === null) return { profiles: [], activeId: null };
  try {
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object" || Array.isArray(saved))
      throw new Error();
    const registry = saved as Record<string, unknown>;
    if (!Array.isArray(registry.profiles)) throw new Error();
    const ids = new Set<string>();
    const names = new Set<string>();
    const profiles = registry.profiles.map((value: unknown): LearnerProfile => {
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error();
      const profile = value as Record<string, unknown>;
      if (
        typeof profile.id !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profile.id) ||
        typeof profile.name !== "string"
      ) throw new Error();
      const name = normalizeName(profile.name);
      const identity = name.toLowerCase();
      const id = profile.id.toLowerCase();
      if (ids.has(id) || names.has(identity)) throw new Error();
      ids.add(id);
      names.add(identity);
      return { id, name };
    });
    if (
      registry.activeId !== null &&
      (typeof registry.activeId !== "string" || !ids.has(registry.activeId))
    ) throw new Error();
    return { profiles, activeId: registry.activeId };
  } catch {
    throw new Error("Saved learner profiles could not be read. Your records have been kept.");
  }
}

type WritableStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function createProfileId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function chooseLearner(storage: WritableStorage, id: string) {
  const saved = readLearnerRegistry(storage);
  const profile = saved.profiles.find((item) => item.id === id);
  if (!profile) throw new Error("This learner profile could not be found.");
  const registry = { ...saved, activeId: profile.id };
  storage.setItem(registryKey, JSON.stringify(registry));
  return { registry, profile };
}

export function openLearner(storage: WritableStorage, name: string) {
  const normalized = normalizeName(name);
  const saved = readLearnerRegistry(storage);
  const existing = saved.profiles.find(
    (profile) => profile.name.toLowerCase() === normalized.toLowerCase(),
  );
  if (existing) return chooseLearner(storage, existing.id);
  const profile = { id: createProfileId(), name: normalized };
  const registry = {
    profiles: [...saved.profiles, profile],
    activeId: profile.id,
  };
  const copiedKeys: string[] = [];
  try {
    if (saved.profiles.length === 0) {
      for (const baseKey of learningRecordKeys) {
        const legacy = storage.getItem(baseKey);
        if (legacy !== null) {
          const key = learnerRecordKey(baseKey, profile.id);
          storage.setItem(key, legacy);
          copiedKeys.push(key);
        }
      }
    }
    // Commit last: a failed migration must not leave a usable but empty profile.
    storage.setItem(registryKey, JSON.stringify(registry));
  } catch (error) {
    for (const key of copiedKeys) {
      try { storage.removeItem(key); } catch { /* Keep the original failure. */ }
    }
    throw error;
  }
  return { registry, profile };
}
