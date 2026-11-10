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
  };
};
const owner = { learnerId: "alice", learnerName: "Alice / Learner" };
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
