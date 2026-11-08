import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize, X } from "lucide-react";
import { unitStartPages } from "../data/bookActivities";
import { courseUnits } from "../data/course";
import { pauseOtherMedia } from "../data/media";
import type { CourseAudio } from "../hooks/useCourseAudio";
import BookPageReader from "./BookPageReader";
import BookMedia from "./BookMedia";
import "./bookMedia.css";

export default function FullscreenBook({ initialPage, audio, onClose }: { initialPage: number; audio: CourseAudio; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [page, setPage] = useState(initialPage);
  const [startPage, setStartPage] = useState(initialPage);
  const [resources, setResources] = useState(false);
  const [fit, setFit] = useState(true);
  const unitId = unitStartPages.reduce((unit, start, index) => page >= start ? index + 1 : unit, 1);
  useEffect(() => {
    const node = dialog.current;
    const app = document.getElementById("root");
    const previousVisibility = app?.style.visibility ?? "";
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    audio.stop();
    pauseOtherMedia();
    node?.showModal();
    // Keep the background page out of Android WebView's fullscreen compositor.
    if (app) app.style.visibility = "hidden";
    return () => { node?.close(); if (app) app.style.visibility = previousVisibility; document.body.style.overflow = previous; audio.stop(); pauseOtherMedia(); };
  }, [audio.stop]);
  const close = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    onClose();
  };
  return createPortal(<dialog ref={dialog} className="kb-fullscreen-book" aria-label="全屏电子课本点读" onCancel={(event) => { event.preventDefault(); close(); }}>
    <div className="kb-fullscreen-header">
      <button onClick={close} aria-label="退出课本点读"><X size={21} /><span>返回</span></button>
      <select aria-label="跳转课本单元" value={unitId} onChange={(event) => { pauseOtherMedia(); audio.stop(); const next = unitStartPages[Number(event.target.value) - 1]; setPage(next); setStartPage(next); setResources(false); }}>
        {courseUnits.map((unit) => <option key={unit.id} value={unit.id}>Unit {unit.id} · {unit.title}</option>)}
      </select>
      <button aria-pressed={resources} onClick={() => { pauseOtherMedia(); audio.stop(); setStartPage(page); setResources(!resources); }}>{resources ? "返回书页" : "视频 / 闪卡"}</button>
      <button onClick={() => setFit(!fit)}>{fit ? "适合页宽" : "整页显示"}</button>
      <button aria-label="切换设备全屏" onClick={() => {
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
        else void document.documentElement.requestFullscreen?.().catch(() => {});
      }}><Maximize size={20} /></button>
    </div>
    {resources ? <div className="kb-fullscreen-resources"><BookMedia key={unitId} unitId={unitId} audio={audio} /></div> :
      <BookPageReader printedPage={startPage} onPageChange={(next) => {
        setPage(next);
        try { localStorage.setItem("kids-box-reader-page-v1", String(next)); } catch { /* Reading still works without storage. */ }
      }} audio={audio} fitPage={fit} />}
  </dialog>, document.body);
}
