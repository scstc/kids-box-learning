import { Capacitor, registerPlugin } from "@capacitor/core";

export type RecordingOwner = { learnerId: string; learnerName: string };
export type Recording = {
  id: string;
  name: string;
  uri: string;
  createdAt: number;
  duration: number;
  size: number;
  learnerId: string;
  playbackAudio: boolean;
};
export type RecordingStatus = {
  state: "idle" | "starting" | "recording" | "stopping" | "saved" | "error";
  startedAt?: number;
  message?: string;
  recording?: Recording;
};
export type RecorderInfo = { supported: boolean; playbackAudio: boolean; reason?: string };
type RecordingSelection = { id: string; learnerId: string };
export type ScreenRecorder = {
  getInfo(): Promise<RecorderInfo>;
  getStatus(): Promise<RecordingStatus>;
  start(owner: RecordingOwner): Promise<RecordingStatus>;
  stop(): Promise<RecordingStatus>;
  listRecordings(owner: Pick<RecordingOwner, "learnerId">): Promise<{ recordings: Recording[] }>;
  open(selection: RecordingSelection): Promise<void>;
  share(selection: RecordingSelection): Promise<void>;
};

type StoredRecording = Recording & { blob: Blob };
export type RecordingStore = {
  save(recording: StoredRecording): Promise<void>;
  get(id: string): Promise<StoredRecording | undefined>;
  list(learnerId: string): Promise<StoredRecording[]>;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("kids-box-recordings-v1", 1);
    request.onupgradeneeded = () => {
      const recordings = request.result.createObjectStore("recordings", { keyPath: "id" });
      recordings.createIndex("learnerId", "learnerId");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Recording storage is busy. Please try again."));
  });
}

const browserStore: RecordingStore = {
  async save(recording) {
    const database = await openDatabase();
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction("recordings", "readwrite");
        transaction.objectStore("recordings").put(recording);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally { database.close(); }
  },
  async get(id) {
    const database = await openDatabase();
    try {
      return await new Promise<StoredRecording | undefined>((resolve, reject) => {
        const transaction = database.transaction("recordings");
        const request = transaction.objectStore("recordings").get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally { database.close(); }
  },
  async list(learnerId) {
    const database = await openDatabase();
    try {
      return await new Promise<StoredRecording[]>((resolve, reject) => {
        const transaction = database.transaction("recordings");
        const request = transaction.objectStore("recordings").index("learnerId").getAll(learnerId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally { database.close(); }
  },
};

function recordingInfo(): RecorderInfo {
  const supported = typeof navigator !== "undefined" && globalThis.isSecureContext !== false
    && typeof navigator.mediaDevices?.getDisplayMedia === "function"
    && typeof navigator.mediaDevices?.getUserMedia === "function"
    && typeof MediaRecorder !== "undefined" && typeof MediaStream !== "undefined";
  return { supported, playbackAudio: false, ...(!supported ? { reason: "Use the Android app or a desktop browser with screen sharing to record your screen and microphone." } : {}) };
}

function metadata(recording: StoredRecording): Recording {
  const { blob: _blob, ...details } = recording;
  return details;
}

function stopTracks(stream?: MediaStream) {
  stream?.getTracks().forEach(track => track.stop());
}

function download(recording: StoredRecording) {
  const url = URL.createObjectURL(recording.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = recording.name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function captureError(error: unknown) {
  if (error instanceof DOMException && ["NotAllowedError", "SecurityError"].includes(error.name))
    return "Screen sharing and microphone permission are needed. Nothing was recorded.";
  if (error instanceof DOMException && error.name === "NotFoundError")
    return "No screen or microphone was available. Nothing was recorded.";
  return error instanceof Error ? error.message : "The recording could not start. Please try again.";
}

type CaptureSession = {
  owner: RecordingOwner;
  display: MediaStream;
  microphone: MediaStream;
  recorder: MediaRecorder;
  chunks: Blob[];
  startedAt: number;
  stoppedAt?: number;
  stopping: boolean;
  finalizing: boolean;
  failed?: string;
  notice?: string;
  timeout?: ReturnType<typeof setTimeout>;
};

export function createWebScreenRecorder(store: RecordingStore = browserStore): ScreenRecorder {
  let status: RecordingStatus = { state: "idle" };
  let session: CaptureSession | null = null;
  let starting = false;
  let cancelled = false;
  const unsaved = new Map<string, StoredRecording>();

  const save = async (recording: StoredRecording, notice?: string) => {
    try {
      await store.save(recording);
      unsaved.delete(recording.id);
      status = { state: "saved", recording: metadata(recording), message: notice ?? "Recording saved on this device." };
    } catch {
      unsaved.set(recording.id, recording);
      status = { state: "error", recording: metadata(recording), message: "The video could not be saved. Download it from My recordings before closing this page, or retry saving." };
    }
  };
  const finish = async (capture: CaptureSession) => {
    if (capture.finalizing) return;
    capture.finalizing = true;
    capture.stopping = true;
    capture.stoppedAt ??= Date.now();
    status = { state: "stopping", startedAt: capture.startedAt, message: "Saving your recording…" };
    clearTimeout(capture.timeout);
    stopTracks(capture.display);
    stopTracks(capture.microphone);
    if (capture.failed) {
      status = { state: "error", message: capture.failed };
      session = null;
      return;
    }
    const mimeType = capture.recorder.mimeType || "video/webm";
    const blob = new Blob(capture.chunks, { type: mimeType });
    capture.chunks = [];
    if (!blob.size) {
      status = { state: "error", message: "The recording was empty. Please record for a little longer and try again." };
      session = null;
      return;
    }
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const learnerName = capture.owner.learnerName.normalize("NFKC").replace(/[<>:"/\\|?*\p{Cc}\p{Cf}]/gu, "-").trim().slice(0, 48) || "Learner";
    const timestamp = new Date(capture.startedAt).toISOString().replace(/[:.]/g, "-");
    const recording: StoredRecording = {
      id, learnerId: capture.owner.learnerId, name: `Kids-Box_${learnerName}_${timestamp}.${mimeType.includes("mp4") ? "mp4" : "webm"}`,
      uri: `indexeddb:${id}`, createdAt: capture.startedAt, duration: Math.max(1, (capture.stoppedAt ?? Date.now()) - capture.startedAt),
      size: blob.size, playbackAudio: false, blob,
    };
    await save(recording, capture.notice);
    session = null;
  };
  const requestStop = (capture = session) => {
    if (!capture || capture !== session || capture.stopping) return;
    capture.stopping = true;
    capture.stoppedAt = Date.now();
    status = { state: "stopping", startedAt: capture.startedAt, message: "Saving your recording…" };
    if (capture.recorder.state !== "inactive") {
      try { capture.recorder.stop(); }
      catch { capture.failed = "The browser could not finish the recording. Please try again."; void finish(capture); }
    }
    // An ended sharing track may already have made the recorder inactive. Its
    // final dataavailable event still arrives before onstop; wait for both.
    if (!capture.finalizing) capture.timeout = setTimeout(() => {
      if (capture.finalizing) return;
      capture.failed = "The browser did not finish the video. Please try again.";
      void finish(capture);
    }, 10_000);
    stopTracks(capture.display);
    stopTracks(capture.microphone);
  };
  const find = async ({ id, learnerId }: RecordingSelection) => {
    const recording = unsaved.get(id) ?? await store.get(id);
    if (!recording || recording.learnerId !== learnerId || !(recording.blob instanceof Blob))
      throw new Error("This recording could not be found for this learner.");
    return recording;
  };
  if (typeof window !== "undefined") window.addEventListener("beforeunload", event => {
    if (!session && !starting && !unsaved.size) return;
    event.preventDefault();
    event.returnValue = "";
  });

  return {
    getInfo: async () => recordingInfo(),
    getStatus: async () => ({ ...status }),
    async start(owner) {
      if (!owner.learnerId || !owner.learnerName.trim()) throw new Error("Choose a learner before recording.");
      if (session || starting) throw new Error("Finish the current recording or sharing prompt first.");
      const info = recordingInfo();
      if (!info.supported) throw new Error(info.reason);
      starting = true;
      cancelled = false;
      status = { state: "starting", message: "Choose a screen to share, then allow your microphone." };
      let display: MediaStream | undefined;
      let microphone: MediaStream | undefined;
      try {
        // Keep this call before the first await: browsers require the button's user activation.
        const sharing = navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 30, max: 30 } }, audio: false });
        display = await sharing;
        if (cancelled) { stopTracks(display); return status; }
        if (!display.getVideoTracks().some(track => track.readyState === "live")) throw new Error("Screen sharing ended before recording could start.");
        microphone = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
        if (cancelled) { stopTracks(display); stopTracks(microphone); return status; }
        if (!microphone.getAudioTracks().some(track => track.readyState === "live")) throw new Error("A working microphone is needed to record your voice.");
        const stream = new MediaStream([...display.getVideoTracks(), ...microphone.getAudioTracks()]);
        const mimeType = ["video/webm;codecs=vp8,opus", "video/webm", "video/mp4"].find(type => MediaRecorder.isTypeSupported(type));
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        const capture: CaptureSession = { owner: { ...owner }, display, microphone, recorder, chunks: [], startedAt: Date.now(), stopping: false, finalizing: false };
        session = capture;
        recorder.ondataavailable = event => { if (event.data.size) capture.chunks.push(event.data); };
        recorder.onstop = () => { void finish(capture); };
        recorder.onerror = () => { capture.failed = "The browser could not record the video. Please try again."; requestStop(capture); };
        display.getVideoTracks().forEach(track => track.addEventListener("ended", () => requestStop(capture), { once: true }));
        microphone.getAudioTracks().forEach(track => track.addEventListener("ended", () => {
          if (!capture.stopping) capture.notice = "Your microphone stopped. The recording was saved up to that point.";
          requestStop(capture);
        }, { once: true }));
        recorder.start(1000);
        status = { state: "recording", startedAt: capture.startedAt, message: "Recording screen and microphone. Book audio is not captured directly." };
        return status;
      } catch (error) {
        stopTracks(display);
        stopTracks(microphone);
        session = null;
        if (cancelled) return status;
        const message = captureError(error);
        status = { state: "error", message };
        throw new Error(message);
      } finally { starting = false; }
    },
    async stop() {
      if (starting) {
        cancelled = true;
        status = { state: "idle", message: "Recording cancelled. Close the browser sharing prompt if it is still open." };
      } else if (session) requestStop();
      else if (status.recording && unsaved.has(status.recording.id)) {
        const recording = unsaved.get(status.recording.id)!;
        status = { state: "stopping", message: "Saving your recording…" };
        await save(recording);
      }
      return status;
    },
    async listRecordings({ learnerId }) {
      let recordings: StoredRecording[];
      try { recordings = await store.list(learnerId); }
      catch (error) {
        recordings = [...unsaved.values()].filter(recording => recording.learnerId === learnerId);
        if (!recordings.length) throw error;
      }
      const own = new Map(recordings.filter(recording => recording.learnerId === learnerId).map(recording => [recording.id, recording]));
      for (const recording of unsaved.values()) if (recording.learnerId === learnerId) own.set(recording.id, recording);
      return { recordings: [...own.values()].sort((a, b) => b.createdAt - a.createdAt).map(metadata) };
    },
    async open(selection) { download(await find(selection)); },
    async share(selection) {
      const recording = await find(selection);
      const file = new File([recording.blob], recording.name, { type: recording.blob.type });
      if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "Kids Box recording" }); }
        catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) throw error; }
      } else download(recording);
    },
  };
}

const nativeRecorder = registerPlugin<ScreenRecorder>("ScreenRecorder");
const webRecorder = createWebScreenRecorder();
const recorder = () => Capacitor.getPlatform() === "android" ? nativeRecorder : webRecorder;

export const screenRecorder: ScreenRecorder = {
  getInfo: () => recorder().getInfo(),
  getStatus: () => recorder().getStatus(),
  start: owner => recorder().start(owner),
  stop: () => recorder().stop(),
  listRecordings: owner => recorder().listRecordings(owner),
  open: selection => recorder().open(selection),
  share: selection => recorder().share(selection),
};
