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
    try { await action(); } catch (error) { setError(error instanceof Error ? error.message : "操作未完成，请重试。"); }
    finally { setBusy(false); }
  };
  const check = () => void run(async () => {
    const next = await updater.check(); setRelease(next);
    setMessage(next.available ? `发现新版本 ${next.version}` : "已经是最新版本。");
  });
  const install = () => void run(async () => {
    const result = await updater.install();
    setMessage(result.state === "permission-required" ? "请允许小小英语安装更新，再点继续安装。" : "已打开系统安装页面，请确认更新；学习进度会保留。");
  });
  const progress = Math.max(0, Math.min(100, Math.floor((download.downloaded ?? 0) / Math.max(1, download.total ?? 1) * 100)));
  return <section className="kb-app-update" aria-label="应用版本与更新">
    <div className="kb-update-heading"><Download size={21} /><strong>应用更新</strong><span>当前 {info.version}</span></div>
    {!native ? <p>安卓安装包可从 <a href={releasesUrl} target="_blank" rel="noreferrer">GitHub Releases 下载</a>。网页版会随网站发布更新。</p> : <>
      <p>更新会保留学习进度。下载完成后，需要在系统页面确认安装。</p>
      {release?.available && <div className="kb-update-release"><strong>{release.version} · {mb(release.size)}</strong><p>{release.notes || "改进学习体验。"}</p></div>}
      {active && <div className="kb-update-progress" role="status">
        <span>{download.state === "verifying" ? "正在校验安装包…" : download.state === "paused" ? "等待网络，连接后会继续下载…" : `正在下载 ${download.version ?? ""} · ${progress}%`}</span>
        <progress aria-label="更新下载进度" max={100} value={progress} />
        {download.state !== "verifying" && <small>{mb(download.downloaded)} / {mb(download.total)}</small>}
      </div>}
      {(error || download.message) && <p className="kb-update-error" role="alert">{error || download.message}</p>}
      {message && <p role="status">{message}</p>}
      <div className="kb-update-actions">
        <button className="kb-btn kb-btn-secondary" disabled={busy || active} onClick={check}><RefreshCw size={17} />{busy ? "请稍候…" : "检查更新"}</button>
        {release?.available && !active && download.state !== "ready" && <button className="kb-btn" disabled={busy} onClick={() => void run(async () => setDownload(await updater.download()))}>下载更新（{mb(release.size)}）</button>}
        {download.state === "ready" && <button className="kb-btn" disabled={busy} onClick={install}>安装 {download.version}</button>}
        {active && <button className="kb-update-cancel" disabled={busy} onClick={() => void run(async () => { await updater.cancel(); setDownload({ state: "idle" }); })}>取消下载</button>}
      </div>
      <a className="kb-update-history" href={release?.releaseUrl ?? releasesUrl} target="_blank" rel="noreferrer">查看 GitHub 版本记录</a>
    </>}
  </section>;
}
