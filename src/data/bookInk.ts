export type InkPoint = { x: number; y: number };
export type InkStroke = { id: string; points: InkPoint[]; color: string; width: number };
export type InkStatus = "loading" | "saved" | "saving" | "load-error" | "save-error";
export type InkSnapshot = { strokes: InkStroke[]; status: InkStatus; canUndo: boolean };
export type LearnerInkSnapshot = { savingPages: number[]; failedPages: number[] };
export type InkPage = { learnerId: string; page: number };
export const inkPageRatio = 1600 / 1259;

export function normalizedInkPoint(x: number, y: number, bounds: { left: number; top: number; width: number; height: number }): InkPoint {
  return { x: Math.max(0, Math.min(1, (x - bounds.left) / bounds.width)), y: Math.max(0, Math.min(1, (y - bounds.top) / bounds.height)) };
}

function pointDistance(point: InkPoint, from: InkPoint, to: InkPoint) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = dx * dx + dy * dy;
  const position = length ? Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / length)) : 0;
  return Math.hypot(point.x - from.x - position * dx, point.y - from.y - position * dy);
}

function segmentDistance(a: InkPoint, b: InkPoint, c: InkPoint, d: InkPoint) {
  const cross = (p: InkPoint, q: InkPoint, r: InkPoint) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  if (cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0) return 0;
  return Math.min(pointDistance(a, c, d), pointDistance(b, c, d), pointDistance(c, a, b), pointDistance(d, a, b));
}

// Scale y into page-width units so the eraser is circular on the portrait page.
export function eraseInkStrokes(strokes: InkStroke[], from: InkPoint, to: InkPoint, radius: number): InkStroke[] {
  const scaled = (point: InkPoint) => ({ x: point.x, y: point.y * inkPageRatio });
  const a = scaled(from);
  const b = scaled(to);
  const remaining = strokes.filter(stroke => !stroke.points.some((point, index) => segmentDistance(a, b, scaled(point), scaled(stroke.points[Math.max(0, index - 1)])) <= radius + stroke.width / 2));
  return remaining.length === strokes.length ? strokes : remaining;
}

type InkAdapter = { read: (page: InkPage) => Promise<InkStroke[]>; write: (page: InkPage, strokes: InkStroke[]) => Promise<void> };
type Entry = { page: InkPage; snapshot: InkSnapshot; ready: boolean; loading: boolean; revision: number; history: InkStroke[][]; listeners: Set<() => void>; tail: Promise<void> };

// Sessions outlive reader mounts: changing pages never cancels an outstanding save.
export function createInkRepository(adapter: InkAdapter) {
  const entries = new Map<string, Entry>();
  const learners = new Map<string, { snapshot: LearnerInkSnapshot; listeners: Set<() => void> }>();
  const learnerFor = (learnerId: string) => {
    let learner = learners.get(learnerId);
    if (!learner) {
      learner = { snapshot: { savingPages: [], failedPages: [] }, listeners: new Set() };
      learners.set(learnerId, learner);
    }
    return learner;
  };
  const publishLearner = (learnerId: string) => {
    const learner = learnerFor(learnerId);
    const pages = [...entries.values()].filter(entry => entry.page.learnerId === learnerId).sort((a, b) => a.page.page - b.page.page);
    const next = {
      savingPages: pages.filter(entry => entry.snapshot.status === "saving").map(entry => entry.page.page),
      failedPages: pages.filter(entry => entry.snapshot.status === "save-error").map(entry => entry.page.page),
    };
    if (JSON.stringify(next) === JSON.stringify(learner.snapshot)) return;
    learner.snapshot = next;
    learner.listeners.forEach(listener => listener());
  };
  const entryFor = (page: InkPage) => {
    const key = JSON.stringify([page.learnerId, page.page]);
    let entry = entries.get(key);
    if (!entry) {
      entry = { page, snapshot: { strokes: [], status: "loading", canUndo: false }, ready: false, loading: false, revision: 0, history: [], listeners: new Set(), tail: Promise.resolve() };
      entries.set(key, entry);
    }
    return entry;
  };
  const publish = (entry: Entry, changes: Partial<InkSnapshot>) => {
    entry.snapshot = { ...entry.snapshot, ...changes };
    publishLearner(entry.page.learnerId);
    entry.listeners.forEach(listener => listener());
  };
  const load = (page: InkPage, entry: Entry) => {
    if (entry.ready || entry.loading) return;
    entry.loading = true;
    publish(entry, { status: "loading" });
    void adapter.read(page).then(strokes => {
      entry.ready = true;
      publish(entry, { strokes, status: "saved" });
    }, () => publish(entry, { status: "load-error" })).finally(() => { entry.loading = false; });
  };
  const persist = (page: InkPage, entry: Entry) => {
    const revision = ++entry.revision;
    const strokes = entry.snapshot.strokes;
    publish(entry, { status: "saving" });
    // Each page has its own queue. An older save cannot overwrite a newer one.
    entry.tail = entry.tail.then(() => adapter.write(page, strokes)).then(() => {
      if (entry.revision === revision) publish(entry, { status: "saved" });
    }, () => {
      if (entry.revision === revision) publish(entry, { status: "save-error" });
    });
  };
  return {
    getLearnerSnapshot: (learnerId: string) => learnerFor(learnerId).snapshot,
    subscribeLearner(learnerId: string, listener: () => void) {
      const learner = learnerFor(learnerId);
      learner.listeners.add(listener);
      return () => { learner.listeners.delete(listener); };
    },
    getSnapshot: (page: InkPage) => entryFor(page).snapshot,
    subscribe(page: InkPage, listener: () => void) {
      const entry = entryFor(page);
      entry.listeners.add(listener);
      load(page, entry);
      return () => { entry.listeners.delete(listener); };
    },
    commit(page: InkPage, strokes: InkStroke[]) {
      const entry = entryFor(page);
      if (!entry.ready || strokes === entry.snapshot.strokes) return;
      entry.history = [...entry.history.slice(-49), entry.snapshot.strokes];
      publish(entry, { strokes, canUndo: true });
      persist(page, entry);
    },
    undo(page: InkPage) {
      const entry = entryFor(page);
      const previous = entry.history.pop();
      if (!entry.ready || !previous) return;
      publish(entry, { strokes: previous, canUndo: entry.history.length > 0 });
      persist(page, entry);
    },
    retry(page: InkPage) {
      const entry = entryFor(page);
      if (!entry.ready) load(page, entry);
      else if (entry.snapshot.status === "save-error") persist(page, entry);
    },
    retryFailed(learnerId: string) {
      for (const entry of entries.values()) {
        if (entry.page.learnerId === learnerId && entry.snapshot.status === "save-error") persist(entry.page, entry);
      }
    },
    hasUnsaved: () => [...entries.values()].some(entry => entry.snapshot.status === "saving" || entry.snapshot.status === "save-error"),
    settled: (page: InkPage) => entryFor(page).tail,
  };
}

function openInkDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("kids-box-handwriting-v1", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("pages", { keyPath: ["learnerId", "page"] });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Handwriting storage is busy."));
  });
}

export function validInkStrokes(value: unknown): value is InkStroke[] {
  return Array.isArray(value) && value.every(stroke => typeof stroke?.id === "string" && typeof stroke.color === "string" && Number.isFinite(stroke.width) && stroke.width > 0 && Array.isArray(stroke.points) && stroke.points.length > 0 && stroke.points.every((point: unknown) => typeof point === "object" && point !== null && "x" in point && "y" in point && typeof point.x === "number" && typeof point.y === "number" && Number.isFinite(point.x) && point.x >= 0 && point.x <= 1 && Number.isFinite(point.y) && point.y >= 0 && point.y <= 1));
}

export const bookInkRepository = createInkRepository({
  async read(page) {
    const database = await openInkDatabase();
    try {
      return await new Promise<InkStroke[]>((resolve, reject) => {
        const transaction = database.transaction("pages", "readonly");
        const request = transaction.objectStore("pages").get([page.learnerId, page.page]);
        request.onsuccess = () => {
          const record: unknown = request.result;
          if (record === undefined) resolve([]);
          else if (typeof record === "object" && record !== null && "strokes" in record && validInkStrokes(record.strokes)) resolve(record.strokes);
          else reject(new Error("The saved handwriting could not be read."));
        };
        request.onerror = () => reject(request.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally { database.close(); }
  },
  async write(page, strokes) {
    const database = await openInkDatabase();
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction("pages", "readwrite");
        transaction.objectStore("pages").put({ ...page, strokes, updatedAt: Date.now() });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally { database.close(); }
  },
});

if (typeof window !== "undefined") window.addEventListener("beforeunload", event => {
  if (!bookInkRepository.hasUnsaved()) return;
  event.preventDefault();
  event.returnValue = "";
});
