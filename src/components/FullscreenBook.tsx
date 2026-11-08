import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { pauseOtherMedia } from "../data/media";
import type { CourseAudio } from "../hooks/useCourseAudio";
import BookPageReader from "./BookPageReader";

export default function FullscreenBook({ initialPage, audio, onClose }: { initialPage: number; audio: CourseAudio; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
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
    <button className="kb-fullscreen-close" onClick={close} aria-label="退出课本点读"><X size={20} /></button>
      <BookPageReader printedPage={initialPage} onPageChange={(next) => {
        try { localStorage.setItem("kids-box-reader-page-v1", String(next)); } catch { /* Reading still works without storage. */ }
      }} audio={audio} fitPage minimal />
  </dialog>, document.body);
}
