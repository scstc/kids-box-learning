import { useEffect, useState } from "react";
import { Circle, Download, Share2, Square, Video } from "lucide-react";
import { screenRecorder, type Recording } from "../data/screenRecorder";
import { useLearner } from "../hooks/useLearner";
import { useScreenRecording } from "../hooks/useScreenRecording";
import "./screenRecording.css";

const duration = (milliseconds: number) => {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

export function ScreenRecordControl({ floating = false }: { floating?: boolean }) {
  const { profile } = useLearner();
  const { info, status, busy, notice, start, stop } = useScreenRecording();
  const recording = status.state === "recording";
  const retrySave = status.state === "error" && !!status.recording;
  const pending = status.state === "starting" || status.state === "stopping";
  return <div className={`kb-recorder-control${floating ? " kb-recorder-floating" : ""}`}>
    <button className="kb-recorder-button" data-recording={recording || undefined} disabled={busy || pending || info === null || !info.supported}
      aria-label={retrySave ? "Retry saving recording" : recording ? "Stop screen recording" : "Start screen recording"}
      title={info?.supported === false ? "Use the Android app or a supported desktop browser to record." : "Record this screen and your microphone"}
      onClick={() => { if (recording || retrySave) void stop(); else void start({ learnerId: profile.id, learnerName: profile.name }); }}>
      {recording ? <Square size={16} fill="currentColor" aria-hidden="true" /> : <Circle size={17} aria-hidden="true" />}
      <span>{status.state === "starting" ? "Starting…" : status.state === "stopping" ? "Saving…" : retrySave ? "Retry save" : recording ? `Stop · ${duration(Date.now() - (status.startedAt ?? Date.now()))}` : "Record"}</span>
    </button>
    {notice && <p className="kb-recorder-notice" role={status.state === "error" ? "alert" : "status"}>{notice}</p>}
  </div>;
}

export default function ScreenRecordingPanel() {
  const { profile } = useLearner();
  const { info, status } = useScreenRecording();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void screenRecorder.listRecordings({ learnerId: profile.id }).then(result => {
      if (!cancelled) { setRecordings(result.recordings); setError(""); }
    }).catch(() => { if (!cancelled) setError("Saved videos could not be read. Please open this panel again."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [profile.id, status.state]);
  const open = async (recording: Recording, share: boolean) => {
    setWorking(recording.id); setError("");
    try {
      if (share) await screenRecorder.share({ id: recording.id, learnerId: profile.id });
      else await screenRecorder.open({ id: recording.id, learnerId: profile.id });
    } catch (error) { setError(error instanceof Error ? error.message : "The video could not be opened. Please try again."); }
    finally { setWorking(null); }
  };
  return <section className="kb-screen-recording" aria-label="Screen recording">
    <h3><Video size={21} aria-hidden="true" />Screen recording</h3>
    <p>Record the screen and your child’s microphone voice. Book audio is not mixed into the video. Headphones help keep speaker sound out of the microphone.</p>
    <p>A little hand shows each tap while recording. Select the Kids Box tab or screen to include these actions in your video.</p>
    <p>{info?.supported === false ? "Recording is available in the Android app or a supported desktop browser. Mobile browsers may not support screen sharing." : "Start recording, then confirm screen sharing and microphone access. Stop to save the video on this device."}</p>
    <ScreenRecordControl />
    {error && <p className="kb-recorder-error" role="alert">{error}</p>}
    <h4>{profile.name}’s recordings</h4>
    {loading ? <p role="status">Opening recordings…</p> : !recordings.length ? !error && <p>No recordings yet.</p> : <ul>{recordings.map(recording => <li key={recording.id}>
      <div><strong>{recording.name}</strong><span>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(recording.createdAt))} · {duration(recording.duration)} · {Math.max(1, Math.ceil(recording.size / 1024 / 1024))} MB</span></div>
      <div><button disabled={working !== null} aria-label={`Open video ${recording.name}`} onClick={() => void open(recording, false)}><Download size={17} aria-hidden="true" />Open</button>
        <button disabled={working !== null} aria-label={`Share video ${recording.name}`} onClick={() => void open(recording, true)}><Share2 size={17} aria-hidden="true" />Share</button></div>
    </li>)}</ul>}
  </section>;
}
