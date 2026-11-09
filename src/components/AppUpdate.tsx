import { useEffect, useState } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { Download, RefreshCw } from "lucide-react";
import appVersion from "../../app-version.json";
import "./appUpdate.css";

type VersionInfo = { version: string; versionCode: number; canInstall: boolean };
type Release = { version: string; versionCode: number; available: boolean; size: number; notes: string; releaseUrl: string };
type DownloadState = { state: "idle" | "downloading" | "paused" | "verifying" | "ready" | "error"; version?: string; downloaded?: number; total?: number; message?: string };
const updater = registerPlugin<{
  getInfo(): Promise<VersionInfo>;
  check(): Promise<Release>;
  download(): Promise<DownloadState>;
  getStatus(): Promise<DownloadState>;
  cancel(): Promise<void>;
  install(): Promise<{ state: "installer-opened" | "permission-required" }>;
}>("AppUpdater");
const releasesUrl = "https://github.com/scstc/kids-box-learning/releases";
const mb = (bytes = 0) => `${Math.ceil(bytes / 1024 / 1024)} MB`;

export default function AppUpdate() {
  const native = Capacitor.getPlatform() === "android";
  const [info, setInfo] = useState<VersionInfo>({ ...appVersion, canInstall: false });
  const [release, setRelease] = useState<Release | null>(null);
  const [download, setDownload] = useState<DownloadState>({ state: "idle" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const active = ["downloading", "paused", "verifying"].includes(download.state);
  useEffect(() => {
    if (!native) return;
    let cancelled = false;
    void Promise.all([updater.getInfo(), updater.getStatus()]).then(([version, state]) => {
      if (!cancelled) { setInfo(version); setDownload(state); }
    }).catch((error: Error) => { if (!cancelled) setError(error.message); });
    return () => { cancelled = true; };
  }, [native]);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const timer = window.setInterval(() => {
      void updater.getStatus().then((state) => { if (!cancelled) setDownload(state); })
        .catch((error: Error) => { if (!cancelled) { setError(error.message); setDownload({ state: "error" }); } });
    }, 1200);
    return () => { cancelled = true; clearInterval(timer); };
  }, [active]);
  const run = async (action: () => Promise<void>) => {
    setBusy(true); setError(""); setMessage("");
    try { await action(); } catch (error) { setError(error instanceof Error ? error.message : "That did not finish. Please try again."); }
    finally { setBusy(false); }
  };
  const check = () => void run(async () => {
    const next = await updater.check(); setRelease(next);
    setMessage(next.available ? `New version available: ${next.version}` : "You are up to date.");
  });
  const install = () => void run(async () => {
    const result = await updater.install();
    setMessage(result.state === "permission-required" ? "Allow Kids Box to install updates, then tap Install again." : "Confirm the update in the system installer. Your learning progress will be kept.");
  });
  const progress = Math.max(0, Math.min(100, Math.floor((download.downloaded ?? 0) / Math.max(1, download.total ?? 1) * 100)));
  return <section className="kb-app-update" aria-label="App version and updates">
    <div className="kb-update-heading"><Download size={21} /><strong>App updates</strong><span>Current version {info.version}</span></div>
    {!native ? <p>Get the Android app from <a href={releasesUrl} target="_blank" rel="noreferrer">GitHub Releases</a>. The website updates automatically when a new version is published.</p> : <>
      <p>Updates keep your progress. Confirm installation when the download finishes.</p>
      {release?.available && <div className="kb-update-release"><strong>{release.version} · {mb(release.size)}</strong><p>{release.notes || "Learning experience improvements."}</p></div>}
      {active && <div className="kb-update-progress" role="status">
        <span>{download.state === "verifying" ? "Verifying download…" : download.state === "paused" ? "Waiting for a connection. The download will resume automatically…" : `Downloading ${download.version ?? ""} · ${progress}%`}</span>
        <progress aria-label="Update download progress" max={100} value={progress} />
        {download.state !== "verifying" && <small>{mb(download.downloaded)} / {mb(download.total)}</small>}
      </div>}
      {(error || download.message) && <p className="kb-update-error" role="alert">{error || download.message}</p>}
      {message && <p role="status">{message}</p>}
      <div className="kb-update-actions">
        <button className="kb-btn kb-btn-secondary" disabled={busy || active} onClick={check}><RefreshCw size={17} />{busy ? "Please wait…" : "Check for updates"}</button>
        {release?.available && !active && download.state !== "ready" && <button className="kb-btn" disabled={busy} onClick={() => void run(async () => setDownload(await updater.download()))}>Download update ({mb(release.size)})</button>}
        {download.state === "ready" && <button className="kb-btn" disabled={busy} onClick={install}>Install {download.version}</button>}
        {active && <button className="kb-update-cancel" disabled={busy} onClick={() => void run(async () => { await updater.cancel(); setDownload({ state: "idle" }); })}>Cancel download</button>}
      </div>
      <a className="kb-update-history" href={release?.releaseUrl ?? releasesUrl} target="_blank" rel="noreferrer">View release history on GitHub</a>
    </>}
  </section>;
}
