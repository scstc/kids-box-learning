import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { screenRecorder, type RecorderInfo, type RecordingOwner, type RecordingStatus } from "../data/screenRecorder";
import RecordingPointer from "../components/RecordingPointer";

const active = (status: RecordingStatus) => ["starting", "recording", "stopping"].includes(status.state);
type Session = {
  info: RecorderInfo | null;
  status: RecordingStatus;
  busy: boolean;
  notice: string;
  start: (owner: RecordingOwner) => Promise<void>;
  stop: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  stopBeforeSwitch: () => Promise<boolean>;
};
const RecordingContext = createContext<Session | null>(null);

export function ScreenRecordingProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<RecorderInfo | null>(null);
  const [status, setStatus] = useState<RecordingStatus>({ state: "idle" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const current = useRef(status);
  const running = useRef(false);
  const apply = useCallback((next: RecordingStatus) => {
    if (next.state !== current.current.state || next.message !== current.current.message) {
      if (next.state === "saved") setNotice(`${next.message || "Video saved."} Find it in For parents → Screen recording.`);
      else if (next.state === "error") setNotice(next.message || "The video could not be saved. Please try again.");
      else if (next.state === "idle") setNotice("");
    }
    current.current = next;
    setStatus(next);
  }, []);
  useEffect(() => {
    let cancelled = false;
    void Promise.all([screenRecorder.getInfo(), screenRecorder.getStatus()]).then(([details, next]) => {
      if (!cancelled) { setInfo(details); current.current = next; setStatus(next); }
    }).catch(() => { if (!cancelled) setNotice("Screen recording could not be opened. Please try again."); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!active(status)) return;
    let cancelled = false;
    const timer = window.setInterval(() => {
      void screenRecorder.getStatus().then(next => { if (!cancelled) apply(next); })
        .catch(() => { if (!cancelled) setNotice("Recording status could not be read. Use the system recording controls to stop if needed."); });
    }, 1000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [status.state, apply]);
  useEffect(() => {
    const recording = active(status);
    document.body.toggleAttribute("data-screen-recording", recording);
    return () => document.body.removeAttribute("data-screen-recording");
  }, [status.state]);
  useEffect(() => {
    if (!notice || status.state === "error") return;
    const timer = window.setTimeout(() => setNotice(""), 9000);
    return () => clearTimeout(timer);
  }, [notice, status.state]);
  const start = async (owner: RecordingOwner) => {
    if (running.current || active(current.current)) return;
    running.current = true;
    setBusy(true); setNotice("");
    try {
      // Invoke capture before awaiting anything: browsers require the button gesture.
      const request = screenRecorder.start(owner);
      apply({ state: "starting" });
      apply(await request);
    } catch (error) { apply({ state: "error", message: error instanceof Error ? error.message : "Recording did not start. Please try again." }); }
    finally { running.current = false; setBusy(false); }
  };
  const stop = async () => {
    if (running.current) return;
    running.current = true; setBusy(true);
    try { apply(await screenRecorder.stop()); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Recording could not stop. Please try again."); }
    finally { running.current = false; setBusy(false); }
  };
  const stopBeforeSwitch = async () => {
    if (!active(current.current) && !(current.current.state === "error" && current.current.recording)) return true;
    if (running.current) return false;
    running.current = true; setBusy(true);
    try {
      let next = await screenRecorder.stop(); apply(next);
      const deadline = Date.now() + 30000;
      while (active(next) && Date.now() < deadline) {
        await new Promise(resolve => window.setTimeout(resolve, 250));
        next = await screenRecorder.getStatus(); apply(next);
      }
      if (active(next)) { setNotice("The video is still saving. Please wait before switching learners."); return false; }
      if (next.state === "error" && next.recording) { setNotice("Save or download this learner’s video before switching learners."); return false; }
      if (next.state === "error") { setNotice(next.message || "This recording could not be saved. Check the message before switching learners."); return false; }
      return true;
    } catch (error) { setNotice(error instanceof Error ? error.message : "Stop recording before switching learners."); return false; }
    finally { running.current = false; setBusy(false); }
  };
  const refreshStatus = async () => apply(await screenRecorder.getStatus());
  return <RecordingContext.Provider value={{ info, status, busy, notice, start, stop, refreshStatus, stopBeforeSwitch }}>{children}<RecordingPointer enabled={status.state === "recording"} /></RecordingContext.Provider>;
}

export function useScreenRecording() {
  const session = useContext(RecordingContext);
  if (!session) throw new Error("Screen recording controls need their provider.");
  return session;
}
