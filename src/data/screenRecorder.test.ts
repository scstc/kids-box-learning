import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createWebScreenRecorder, type RecordingStore } from "./screenRecorder";

class Track extends EventTarget {
  readyState = "live";
  stop = vi.fn(() => { this.readyState = "ended"; });
  constructor(public kind: string) { super(); }
}
class Stream {
  constructor(private tracks: Track[]) {}
  getTracks() { return this.tracks; }
  getVideoTracks() { return this.tracks.filter(track => track.kind === "video"); }
  getAudioTracks() { return this.tracks.filter(track => track.kind === "audio"); }
}
class Recorder {
  static instances: Recorder[] = [];
  static isTypeSupported(type: string) { return type.includes("webm"); }
  state = "inactive";
  mimeType = "video/webm";
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  start = vi.fn(() => { this.state = "recording"; });
  stop = vi.fn(() => {
    this.state = "inactive";
    queueMicrotask(() => {
      this.ondataavailable?.({ data: new Blob(["recorded-screen-and-microphone"]) });
      this.onstop?.();
    });
  });
  constructor(public stream: Stream) { Recorder.instances.push(this); }
}
type Stored = Parameters<RecordingStore["save"]>[0];
const memoryStore = () => {
  const values = new Map<string, Stored>();
  return {
    values,
    save: vi.fn(async (recording: Stored) => { values.set(recording.id, recording); }),
    get: async (id: string) => values.get(id),
    list: async (learnerId: string) => [...values.values()].filter(recording => recording.learnerId === learnerId),
    remove: vi.fn(async (id: string) => { values.delete(id); }),
  };
};
const owner = { learnerId: "alice", learnerName: "Alice / Learner" };
const savedVideo = (id: string, learnerId: string): Stored => ({
  id, learnerId, name: `${id}.webm`, uri: `indexeddb:${id}`, createdAt: 1, duration: 1000,
  size: 5, playbackAudio: false, blob: new Blob(["video"]),
});
let video: Track;
let mic: Track;
let unexpectedDisplayAudio: Track;
let sharing: ReturnType<typeof vi.fn>;
let microphone: ReturnType<typeof vi.fn>;

beforeEach(() => {
  Recorder.instances = [];
  video = new Track("video");
  mic = new Track("audio");
  unexpectedDisplayAudio = new Track("audio");
  sharing = vi.fn(async () => new Stream([video, unexpectedDisplayAudio]));
  microphone = vi.fn(async () => new Stream([mic]));
  vi.stubGlobal("navigator", { mediaDevices: { getDisplayMedia: sharing, getUserMedia: microphone } });
  vi.stubGlobal("MediaStream", Stream);
  vi.stubGlobal("MediaRecorder", Recorder);
  vi.stubGlobal("isSecureContext", true);
});

describe("a learner can delete only their own finished videos", () => {
  it("removes the selected video while retaining other videos and refusing another learner's selection", async () => {
    const store = memoryStore();
    store.values.set("alice-selected", savedVideo("alice-selected", "alice"));
    store.values.set("alice-kept", savedVideo("alice-kept", "alice"));
    store.values.set("bob-kept", savedVideo("bob-kept", "bob"));
    const recorder = createWebScreenRecorder(store);
    await expect(recorder.remove({ id: "bob-kept", learnerId: "alice" })).rejects.toThrow("for this learner");
    expect(store.remove).not.toHaveBeenCalled();
    await recorder.remove({ id: "alice-selected", learnerId: "alice" });
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings.map(item => item.id)).toEqual(["alice-kept"]);
    expect((await recorder.listRecordings({ learnerId: "bob" })).recordings.map(item => item.id)).toEqual(["bob-kept"]);
    await expect(recorder.remove({ id: "missing", learnerId: "alice" })).resolves.toBeUndefined();
  });

  it.each([undefined, { damaged: true }])("allows an owned damaged video to be deleted without allowing it to be opened or shared (%j)", async blob => {
    const store = memoryStore();
    store.values.set("alice-damaged", { ...savedVideo("alice-damaged", "alice"), blob: blob as unknown as Blob });
    store.values.set("bob-kept", savedVideo("bob-kept", "bob"));
    const recorder = createWebScreenRecorder(store);
    const selection = { id: "alice-damaged", learnerId: "alice" };
    await expect(recorder.open(selection)).rejects.toThrow("for this learner");
    await expect(recorder.share(selection)).rejects.toThrow("for this learner");
    await expect(recorder.remove({ ...selection, learnerId: "bob" })).rejects.toThrow("for this learner");
    expect(store.remove).not.toHaveBeenCalled();
    await recorder.remove(selection);
    expect(store.values.has(selection.id)).toBe(false);
    expect(store.values.has("bob-kept")).toBe(true);
  });

  it("refuses deletion when a damaged row's ownership or stored identity cannot be verified", async () => {
    const store = memoryStore();
    store.values.set("no-owner", { ...savedVideo("no-owner", "alice"), learnerId: undefined as unknown as string });
    store.values.set("wrong-id", savedVideo("another-video", "alice"));
    const recorder = createWebScreenRecorder(store);
    await expect(recorder.remove({ id: "no-owner", learnerId: "alice" })).rejects.toThrow("for this learner");
    await expect(recorder.remove({ id: "wrong-id", learnerId: "alice" })).rejects.toThrow("for this learner");
    expect(store.remove).not.toHaveBeenCalled();
    expect(store.values.size).toBe(2);
  });

  it("treats repeated deletion and an already missing video as complete without touching another learner's latest status", async () => {
    const store = memoryStore();
    const recorder = createWebScreenRecorder(store);
    await recorder.start({ learnerId: "bob", learnerName: "Bob" });
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("saved"));
    const saved = await recorder.getStatus();
    const id = saved.recording!.id;
    store.values.delete(id);
    await recorder.remove({ id, learnerId: "alice" });
    expect(await recorder.getStatus()).toEqual(saved);
    await recorder.remove({ id, learnerId: "bob" });
    expect((await recorder.getStatus()).state).toBe("idle");
    await expect(recorder.remove({ id, learnerId: "bob" })).resolves.toBeUndefined();
    expect(store.remove).not.toHaveBeenCalled();
  });

  it("requires a complete list before learner deletion, while keeping unsaved-video recovery available after a read failure", async () => {
    const store = memoryStore();
    store.values.set("alice-persisted", savedVideo("alice-persisted", "alice"));
    store.values.set("bob-kept", savedVideo("bob-kept", "bob"));
    store.save.mockRejectedValueOnce(new Error("Quota exceeded"));
    const recorder = createWebScreenRecorder(store);
    await recorder.start(owner);
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("error"));
    const unsaved = (await recorder.getStatus()).recording!;
    const list = vi.spyOn(store, "list");
    list.mockRejectedValueOnce(new Error("Recording index is unavailable"));
    await expect(recorder.listRecordings({ learnerId: "alice", requireComplete: true })).rejects.toThrow("index is unavailable");
    expect(store.remove).not.toHaveBeenCalled();
    expect(store.values.has("alice-persisted")).toBe(true);
    list.mockRejectedValueOnce(new Error("Recording index is unavailable"));
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toEqual([unsaved]);
    const complete = await recorder.listRecordings({ learnerId: "alice", requireComplete: true });
    expect(complete.recordings.map(recording => recording.id).sort()).toEqual(["alice-persisted", unsaved.id].sort());
    expect((await recorder.listRecordings({ learnerId: "bob", requireComplete: true })).recordings.map(recording => recording.id)).toEqual(["bob-kept"]);
  });

  it("clears the latest saved-video status only after its persistent deletion succeeds", async () => {
    const store = memoryStore();
    const recorder = createWebScreenRecorder(store);
    await recorder.start(owner);
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("saved"));
    const selection = { id: (await recorder.getStatus()).recording!.id, learnerId: "alice" };
    store.remove.mockRejectedValueOnce(new Error("Read-only storage"));
    await expect(recorder.remove(selection)).rejects.toThrow("has been kept");
    expect((await recorder.getStatus()).state).toBe("saved");
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toHaveLength(1);
    await recorder.remove(selection);
    expect(store.values.has(selection.id)).toBe(false);
    expect(await recorder.getStatus()).toMatchObject({ state: "idle", message: "Recording deleted." });
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toEqual([]);
  });

  it("keeps an unsaved video's Blob and retry state until deletion commits, then discards it", async () => {
    const store = memoryStore();
    store.save.mockRejectedValueOnce(new Error("Quota exceeded"));
    const recorder = createWebScreenRecorder(store);
    await recorder.start(owner);
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("error"));
    const selection = { id: (await recorder.getStatus()).recording!.id, learnerId: "alice" };
    let commit!: () => void;
    store.remove.mockImplementationOnce(async id => {
      await new Promise<void>(resolve => { commit = resolve; });
      store.values.delete(id);
    });
    const deleting = recorder.remove(selection);
    await vi.waitFor(() => expect(store.remove).toHaveBeenCalledTimes(1));
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toHaveLength(1);
    expect((await recorder.getStatus()).state).toBe("error");
    await expect(recorder.stop()).rejects.toThrow("finish deleting");
    commit();
    await deleting;
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toEqual([]);
    expect((await recorder.getStatus()).state).toBe("idle");
    await recorder.stop();
    expect(store.save).toHaveBeenCalledTimes(1);
  });

  it("retains a recoverable unsaved video if deletion fails", async () => {
    const store = memoryStore();
    store.save.mockRejectedValueOnce(new Error("Quota exceeded"));
    const recorder = createWebScreenRecorder(store);
    await recorder.start(owner);
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("error"));
    const failed = await recorder.getStatus();
    store.remove.mockRejectedValueOnce(new Error("Deletion aborted"));
    await expect(recorder.remove({ id: failed.recording!.id, learnerId: "alice" })).rejects.toThrow("has been kept");
    expect(await recorder.getStatus()).toEqual(failed);
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toEqual([failed.recording]);
    expect((await recorder.stop()).state).toBe("saved");
    expect(store.values.has(failed.recording!.id)).toBe(true);
  });

  it("does not interrupt a new recording when an older video is deleted", async () => {
    const store = memoryStore();
    store.values.set("old-alice", savedVideo("old-alice", "alice"));
    const recorder = createWebScreenRecorder(store);
    await recorder.start({ learnerId: "bob", learnerName: "Bob" });
    await recorder.remove({ id: "old-alice", learnerId: "alice" });
    expect((await recorder.getStatus()).state).toBe("recording");
    expect(Recorder.instances[0].stop).not.toHaveBeenCalled();
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("saved"));
    expect((await recorder.listRecordings({ learnerId: "bob" })).recordings).toHaveLength(1);
  });

  it("waits for an in-flight retry to finish instead of deleting a video that could reappear", async () => {
    const store = memoryStore();
    store.save.mockRejectedValueOnce(new Error("Quota exceeded"));
    const recorder = createWebScreenRecorder(store);
    await recorder.start(owner);
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("error"));
    const selection = { id: (await recorder.getStatus()).recording!.id, learnerId: "alice" };
    let saved!: () => void;
    store.save.mockImplementationOnce(async recording => {
      await new Promise<void>(resolve => { saved = resolve; });
      store.values.set(recording.id, recording);
    });
    const saving = recorder.stop();
    await vi.waitFor(() => expect(store.save).toHaveBeenCalledTimes(2));
    await expect(recorder.remove(selection)).rejects.toThrow("finish saving");
    expect(store.remove).not.toHaveBeenCalled();
    saved();
    await saving;
    await recorder.remove(selection);
    expect(store.values.has(selection.id)).toBe(false);
  });
});
afterEach(() => { vi.unstubAllGlobals(); });

describe("screen recording captures the child, without directly capturing book audio", () => {
  it("requests sharing in the click's call stack and records only screen video plus microphone", async () => {
    const store = memoryStore();
    const recorder = createWebScreenRecorder(store);
    const starting = recorder.start(owner);
    expect(sharing).toHaveBeenCalledTimes(1);
    expect(sharing.mock.calls[0][0]).toMatchObject({ audio: false });
    await starting;
    expect(Recorder.instances[0].stream.getTracks()).toEqual([video, mic]);
    expect((await recorder.getInfo()).playbackAudio).toBe(false);
    expect(microphone).toHaveBeenCalledWith({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
    expect((await recorder.stop()).state).toBe("stopping");
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("saved"));
    const result = await recorder.listRecordings({ learnerId: owner.learnerId });
    expect(result.recordings).toHaveLength(1);
    expect(result.recordings[0]).toMatchObject({ learnerId: "alice", playbackAudio: false, size: 30 });
    expect(result.recordings[0].name).not.toContain("/");
    expect(result.recordings[0].duration).toBeGreaterThan(0);
    expect(video.stop).toHaveBeenCalled();
    expect(mic.stop).toHaveBeenCalled();
    expect(unexpectedDisplayAudio.stop).toHaveBeenCalled();
    expect((await recorder.listRecordings({ learnerId: "bob" })).recordings).toEqual([]);
    await expect(recorder.open({ id: result.recordings[0].id, learnerId: "bob" })).rejects.toThrow("for this learner");
  });

  it("cleans up screen sharing when microphone permission is refused, without saving a silent video", async () => {
    microphone.mockRejectedValueOnce(new DOMException("Denied", "NotAllowedError"));
    const store = memoryStore();
    const recorder = createWebScreenRecorder(store);
    await expect(recorder.start(owner)).rejects.toThrow("microphone permission");
    expect(video.stop).toHaveBeenCalled();
    expect(unexpectedDisplayAudio.stop).toHaveBeenCalled();
    expect(Recorder.instances).toHaveLength(0);
    expect(store.save).not.toHaveBeenCalled();
    expect((await recorder.getStatus()).state).toBe("error");
  });

  it("does not ask for microphone access after screen sharing is cancelled", async () => {
    sharing.mockRejectedValueOnce(new DOMException("Cancelled", "NotAllowedError"));
    const store = memoryStore();
    const recorder = createWebScreenRecorder(store);
    await expect(recorder.start(owner)).rejects.toThrow("Nothing was recorded");
    expect(microphone).not.toHaveBeenCalled();
    expect(store.save).not.toHaveBeenCalled();
  });

  it("stops a late permission result after cancelling startup instead of beginning an unnoticed recording", async () => {
    let grant!: (stream: Stream) => void;
    sharing.mockReturnValueOnce(new Promise<Stream>(resolve => { grant = resolve; }));
    const recorder = createWebScreenRecorder(memoryStore());
    const starting = recorder.start(owner);
    expect((await recorder.stop()).state).toBe("idle");
    grant(new Stream([video]));
    expect((await starting).state).toBe("idle");
    expect(video.stop).toHaveBeenCalled();
    expect(microphone).not.toHaveBeenCalled();
    expect(Recorder.instances).toHaveLength(0);
  });

  it("retains a finished video for download and allows saving again after a storage failure", async () => {
    const store = memoryStore();
    store.save.mockRejectedValueOnce(new Error("Quota exceeded"));
    const recorder = createWebScreenRecorder(store);
    await recorder.start(owner);
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("error"));
    const failed = await recorder.getStatus();
    expect(failed.message).toContain("Download it");
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toEqual([failed.recording]);
    expect(store.values.size).toBe(0);
    expect((await recorder.stop()).state).toBe("saved");
    expect(store.values.size).toBe(1);
  });

  it("saves for the captured learner when the browser's sharing control ends recording", async () => {
    const store = memoryStore();
    const recorder = createWebScreenRecorder(store);
    const selected = { ...owner };
    await recorder.start(selected);
    selected.learnerId = "bob";
    video.dispatchEvent(new Event("ended"));
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("saved"));
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toHaveLength(1);
    expect((await recorder.listRecordings({ learnerId: "bob" })).recordings).toHaveLength(0);
  });

  it("does not publish a partial recording when the encoder fails", async () => {
    const store = memoryStore();
    const recorder = createWebScreenRecorder(store);
    await recorder.start(owner);
    Recorder.instances[0].onerror?.();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("error"));
    expect(store.save).not.toHaveBeenCalled();
    expect((await recorder.listRecordings({ learnerId: "alice" })).recordings).toEqual([]);
    expect(mic.stop).toHaveBeenCalled();
  });

  it("waits for the final data event when sharing has already made the recorder inactive", async () => {
    const store = memoryStore();
    const recorder = createWebScreenRecorder(store);
    await recorder.start(owner);
    const encoder = Recorder.instances[0];
    encoder.state = "inactive";
    video.dispatchEvent(new Event("ended"));
    expect((await recorder.getStatus()).state).toBe("stopping");
    expect(store.save).not.toHaveBeenCalled();
    encoder.ondataavailable?.({ data: new Blob(["last frame and voice"]) });
    encoder.onstop?.();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("saved"));
    expect(store.values.size).toBe(1);
  });

  it("reports unsupported browsers without opening any permission prompt", async () => {
    vi.stubGlobal("isSecureContext", false);
    const recorder = createWebScreenRecorder(memoryStore());
    expect((await recorder.getInfo()).supported).toBe(false);
    await expect(recorder.start(owner)).rejects.toThrow("desktop browser");
    expect(sharing).not.toHaveBeenCalled();
    expect(microphone).not.toHaveBeenCalled();
  });

  it("does not let a late track-ended callback from an old video stop the next learner's recording", async () => {
    const recorder = createWebScreenRecorder(memoryStore());
    await recorder.start(owner);
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("saved"));
    const oldVideo = video;
    sharing.mockResolvedValueOnce(new Stream([new Track("video")]));
    microphone.mockResolvedValueOnce(new Stream([new Track("audio")]));
    await recorder.start({ learnerId: "bob", learnerName: "Bob" });
    oldVideo.dispatchEvent(new Event("ended"));
    expect((await recorder.getStatus()).state).toBe("recording");
    expect(Recorder.instances[1].stop).not.toHaveBeenCalled();
    await recorder.stop();
    await vi.waitFor(async () => expect((await recorder.getStatus()).state).toBe("saved"));
  });
});
