import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Check, ChevronDown, Eraser, Gauge, PenLine, Undo2, X } from "lucide-react";
import { pauseOtherMedia } from "../data/media";
import type { CourseAudio } from "../hooks/useCourseAudio";
import BookPageReader from "./BookPageReader";
import { unitStartPages } from "../data/bookActivities";
import { courseUnits } from "../data/course";
import { learnerRecordKey } from "../data/learnerProfiles";
import { useLearner } from "../hooks/useLearner";
import { useBookInk } from "../hooks/useBookInk";
import type { InkTool } from "./BookInkOverlay";

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5];

export default function FullscreenBook({ initialPage, audio, onClose }: { initialPage: number; audio: CourseAudio; onClose: () => void }) {
  const { profile } = useLearner();
  const dialog = useRef<HTMLDialogElement>(null);
  const unitButton = useRef<HTMLButtonElement>(null);
  const pageButton = useRef<HTMLButtonElement>(null);
  const speedButton = useRef<HTMLButtonElement>(null);
  const scrubbing = useRef(false);
  const [panel, setPanel] = useState<"units" | "pages" | "speed" | null>(null);
  const [playbackRate, setPlaybackRate] = useState(() => {
    try {
      const saved = Number(localStorage.getItem("kids-box-reader-speed-v1"));
      return playbackSpeeds.includes(saved) ? saved : 1;
    } catch { return 1; }
  });
  const [page, setPage] = useState(initialPage);
  const [previewPage, setPreviewPage] = useState(initialPage);
  const [pageRequest, setPageRequest] = useState({ page: initialPage, revision: 0 });
  const [writing, setWriting] = useState(false);
  const [inkTool, setInkTool] = useState<InkTool>("pen");
  const ink = useBookInk(profile.id, page);
  const inkError = ink.status === "load-error" || ink.failedPages.length > 0;
  const showInkTools = writing || inkError || ink.savingPages.length > 0;
  const inkReady = ink.status !== "loading" && ink.status !== "load-error";
  const inkStatus = ink.failedPages.length > 0 ? `${ink.failedPages.length === 1 ? `Page ${ink.failedPages[0]}` : `${ink.failedPages.length} pages`} not saved. Retry.` : ink.savingPages.length > 0 ? "Saving notes…" : ink.status === "loading" ? "Opening notes…" : ink.status === "load-error" ? "Could not open notes." : "Saved on this device";
  const unitId = unitStartPages.reduce((unit, start, index) => page >= start ? index + 1 : unit, 1);
  const unit = courseUnits.find(unit => unit.id === unitId)!;
  const rememberPage = (next: number) => {
    setPage(next);
    try { localStorage.setItem(learnerRecordKey("kids-box-reader-page-v1", profile.id), String(next)); } catch { /* Reading still works without storage. */ }
  };
  const jump = (next: number) => {
    if (!Number.isInteger(next) || next < 4 || next > 95 || next === page) return;
    audio.stop();
    pauseOtherMedia();
    rememberPage(next);
    setPageRequest(current => ({ page: next, revision: current.revision + 1 }));
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
  return createPortal(<dialog ref={dialog} className="kb-fullscreen-book" aria-label="Fullscreen talking book" data-ink-tools={showInkTools || undefined}
    onPointerDown={(event) => { if (!(event.target as Element).closest(".kb-fullscreen-navigation")) setPanel(null); }}
    onCancel={(event) => {
      event.preventDefault();
      if (panel) { (panel === "units" ? unitButton : panel === "pages" ? pageButton : speedButton).current?.focus(); setPanel(null); }
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
        <div className="kb-reader-page-picker">
          <button ref={pageButton} className="kb-reader-page-button" aria-label={`Choose book page, current page ${page}`} aria-expanded={panel === "pages"} aria-controls="kb-reader-page-list"
            onClick={() => { scrubbing.current = false; setPreviewPage(page); setPanel(panel === "pages" ? null : "pages"); }}>
            <span>Page</span><strong>{page}</strong><span className="kb-reader-page-total">/ 95</span><ChevronDown size={13} />
          </button>
          {panel === "pages" && <section id="kb-reader-page-list" className="kb-reader-popover kb-reader-page-menu" aria-label="Choose a page">
            <div className="kb-reader-page-preview"><span>Page</span><output htmlFor="kb-reader-page-slider">{previewPage}</output><span>/ 95</span></div>
            <p id="kb-reader-page-help">Slide to choose a page. Release to open it.</p>
            <input id="kb-reader-page-slider" className="kb-reader-page-slider" aria-label="Book page" aria-describedby="kb-reader-page-help" aria-valuetext={`Page ${previewPage} of 95`}
              type="range" min={4} max={95} step={1} value={previewPage} style={{ "--page-progress": `${(previewPage - 4) / 91 * 100}%` } as CSSProperties}
              onPointerDown={() => { scrubbing.current = true; }}
              onChange={(event) => { const next = Number(event.currentTarget.value); setPreviewPage(next); if (!scrubbing.current) jump(next); }}
              onPointerUp={(event) => { scrubbing.current = false; jump(Number(event.currentTarget.value)); }}
              onPointerCancel={() => { scrubbing.current = false; setPreviewPage(page); }} />
            <div className="kb-reader-page-limits" aria-hidden="true"><span>4</span><span>95</span></div>
          </section>}
        </div>
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
        <button className="kb-reader-write-button" aria-label="Write on this page" aria-pressed={writing}
          onClick={() => { setWriting(!writing); setPanel(null); audio.stop(); pauseOtherMedia(); }}><PenLine size={20} /><span>Write</span></button>
        <button className="kb-fullscreen-close" onClick={close} aria-label="Close talking book"><X size={21} /></button>
      </div>
      {showInkTools && <div className="kb-reader-ink-tools" aria-label="Handwriting tools">
        {writing && <div className="kb-reader-ink-actions">
          <button aria-label="Pen" aria-pressed={inkTool === "pen"} disabled={!inkReady} onClick={() => setInkTool("pen")}><PenLine size={19} /><span>Pen</span></button>
          <button aria-label="Eraser" aria-pressed={inkTool === "eraser"} disabled={!inkReady} onClick={() => setInkTool("eraser")}><Eraser size={19} /><span>Eraser</span></button>
          <button aria-label="Undo handwriting" disabled={!ink.canUndo} onClick={ink.undo}><Undo2 size={19} /><span>Undo</span></button>
        </div>}
        <div className="kb-reader-ink-feedback" data-error={inkError || undefined}>
          <strong title={profile.name}>{profile.name}’s notes</strong><span role="status" aria-live="polite">{inkStatus}</span>
        </div>
        {inkError && <button className="kb-reader-ink-retry" onClick={() => { if (ink.status === "load-error") ink.retry(); ink.retryFailed(); }}>Retry</button>}
      </div>}
    </header>
    <BookPageReader key={pageRequest.revision} printedPage={pageRequest.page} onPageChange={rememberPage} audio={audio} playbackRate={playbackRate} annotation={{ ink, writing, tool: inkTool }} fitPage minimal />
  </dialog>, document.body);
}
