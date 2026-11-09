import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Check, ChevronDown, Gauge, X } from "lucide-react";
import { pauseOtherMedia } from "../data/media";
import type { CourseAudio } from "../hooks/useCourseAudio";
import BookPageReader from "./BookPageReader";
import { unitStartPages } from "../data/bookActivities";
import { courseUnits } from "../data/course";

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5];

export default function FullscreenBook({ initialPage, audio, onClose }: { initialPage: number; audio: CourseAudio; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const unitButton = useRef<HTMLButtonElement>(null);
  const speedButton = useRef<HTMLButtonElement>(null);
  const [panel, setPanel] = useState<"units" | "speed" | null>(null);
  const [playbackRate, setPlaybackRate] = useState(() => {
    try {
      const saved = Number(localStorage.getItem("kids-box-reader-speed-v1"));
      return playbackSpeeds.includes(saved) ? saved : 1;
    } catch { return 1; }
  });
  const [page, setPage] = useState(initialPage);
  const [startPage, setStartPage] = useState(initialPage);
  const unitId = unitStartPages.reduce((unit, start, index) => page >= start ? index + 1 : unit, 1);
  const unit = courseUnits.find(unit => unit.id === unitId)!;
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
  return createPortal(<dialog ref={dialog} className="kb-fullscreen-book" aria-label="Fullscreen talking book"
    onPointerDown={(event) => { if (!(event.target as Element).closest(".kb-fullscreen-navigation")) setPanel(null); }}
    onCancel={(event) => {
      event.preventDefault();
      if (panel) { (panel === "units" ? unitButton : speedButton).current?.focus(); setPanel(null); }
      else close();
    }}>
    <header className="kb-fullscreen-navigation" aria-label="Book controls">
      <div className="kb-reader-controls">
        <div className="kb-reader-unit-picker">
          <button ref={unitButton} className="kb-reader-unit-button" aria-label="Go to book unit" aria-expanded={panel === "units"} aria-controls="kb-reader-unit-list"
            onClick={() => setPanel(panel === "units" ? null : "units")}>
            <span className="kb-reader-book-icon"><BookOpen size={21} /></span>
            <span className="kb-reader-unit-title"><small>UNIT {String(unit.id).padStart(2, "0")}</small><strong>{unit.title}</strong></span>
            <ChevronDown size={16} />
          </button>
          {panel === "units" && <section id="kb-reader-unit-list" className="kb-reader-popover kb-reader-unit-menu" aria-label="Choose a unit">
            <h2>Choose a unit</h2>
            <div>{courseUnits.map(item => <button key={item.id} aria-pressed={unitId === item.id}
              onClick={() => { jump(unitStartPages[item.id - 1]); setPanel(null); unitButton.current?.focus(); }}>
              <span>{String(item.id).padStart(2, "0")}</span><strong>{item.title}</strong>{item.id === unitId && <Check size={16} />}
            </button>)}</div>
          </section>}
        </div>
        <label className="kb-reader-page-field"><span>Page</span><input key={page} aria-label="Book page number" type="number" inputMode="numeric" min={4} max={95} defaultValue={page}
          onFocus={() => setPanel(null)}
          onBlur={(event) => { const next=Number(event.currentTarget.value); if (Number.isInteger(next) && next >= 4 && next <= 95) jump(next); else event.currentTarget.value=String(page); }}
          onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} /><span className="kb-reader-page-total">/ 95</span></label>
        <div className="kb-reader-speed-picker">
          <button ref={speedButton} className="kb-reader-speed-button" aria-label="CD playback speed" aria-expanded={panel === "speed"} aria-controls="kb-reader-speed-list" data-adjusted={playbackRate !== 1 || undefined}
            onClick={() => setPanel(panel === "speed" ? null : "speed")}><Gauge size={19} /><span>{playbackRate}×</span><ChevronDown size={13} /></button>
          {panel === "speed" && <section id="kb-reader-speed-list" className="kb-reader-popover kb-reader-speed-menu" aria-label="Audio speed">
            <h2>Audio speed</h2><p>For CD recordings</p>
            <div>{playbackSpeeds.map((speed, index) => <button key={speed} aria-pressed={playbackRate === speed} onClick={() => {
              setPlaybackRate(speed); setPanel(null); speedButton.current?.focus();
              try { localStorage.setItem("kids-box-reader-speed-v1", String(speed)); } catch { /* The chosen speed still applies. */ }
            }}><strong>{speed}×</strong><span>{["Very slow", "Slow", "Normal", "Faster", "Fast"][index]}</span>{playbackRate === speed && <Check size={17} />}</button>)}</div>
          </section>}
        </div>
        <button className="kb-fullscreen-close" onClick={close} aria-label="Close talking book"><X size={21} /></button>
      </div>
    </header>
    <BookPageReader printedPage={startPage} onPageChange={rememberPage} audio={audio} playbackRate={playbackRate} fitPage minimal />
  </dialog>, document.body);
}
