import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { pauseOtherMedia } from "../data/media";
import type { CourseAudio } from "../hooks/useCourseAudio";
import BookPageReader from "./BookPageReader";
import { unitStartPages } from "../data/bookActivities";
import { courseUnits } from "../data/course";

export default function FullscreenBook({ initialPage, audio, onClose }: { initialPage: number; audio: CourseAudio; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [page, setPage] = useState(initialPage);
  const [startPage, setStartPage] = useState(initialPage);
  const unitId = unitStartPages.reduce((unit, start, index) => page >= start ? index + 1 : unit, 1);
  const rememberPage = (next: number) => {
    setPage(next);
    try { localStorage.setItem("kids-box-reader-page-v1", String(next)); } catch { /* Reading still works without storage. */ }
  };
  const jump = (next: number) => {
    if (!Number.isInteger(next) || next < 4 || next > 95) return;
    audio.stop();
    pauseOtherMedia();
    rememberPage(next);
    setStartPage(next);
  };
  useEffect(() => {
    const node = dialog.current;
    const app = document.getElementById("root");
    const previousDisplay = app?.style.display ?? "";
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    audio.stop();
    pauseOtherMedia();
    node?.showModal();
    // GSAP sets visibility on descendants, so hiding the app requires display.
    if (app) app.style.display = "none";
    return () => { node?.close(); if (app) app.style.display = previousDisplay; document.body.style.overflow = previous; audio.stop(); pauseOtherMedia(); };
  }, [audio.stop]);
  const close = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    onClose();
  };
  return createPortal(<dialog ref={dialog} className="kb-fullscreen-book" aria-label="全屏电子课本点读" onCancel={(event) => { event.preventDefault(); close(); }}>
    <div className="kb-fullscreen-navigation">
      <select aria-label="跳转课本单元" value={unitId} onChange={(event) => jump(unitStartPages[Number(event.target.value) - 1])}>
        {courseUnits.map((unit) => <option key={unit.id} value={unit.id}>Unit {unit.id} · {unit.title}</option>)}
      </select>
      <label>第 <input key={page} aria-label="原书页码" type="number" min={4} max={95} defaultValue={page}
        onBlur={(event) => { const next=Number(event.currentTarget.value); if (Number.isInteger(next) && next >= 4 && next <= 95) jump(next); else event.currentTarget.value=String(page); }}
        onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} /> 页</label>
      <button className="kb-fullscreen-close" onClick={close} aria-label="退出课本点读"><X size={20} /></button>
    </div>
    <BookPageReader printedPage={startPage} onPageChange={rememberPage} audio={audio} fitPage minimal />
  </dialog>, document.body);
}
