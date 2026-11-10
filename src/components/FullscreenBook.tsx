import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Check, ChevronDown, Eraser, Gauge, Palette, PenLine, Undo2, Volume2, VolumeX, X } from "lucide-react";
import { pauseOtherMedia } from "../data/media";
import type { CourseAudio } from "../hooks/useCourseAudio";
import BookPageReader from "./BookPageReader";
import { unitStartPages } from "../data/bookActivities";
import { courseUnits } from "../data/course";
import { learnerRecordKey } from "../data/learnerProfiles";
import { useLearner } from "../hooks/useLearner";
import { useBookInk } from "../hooks/useBookInk";
import type { InkTool } from "./BookInkOverlay";
import { inkColors, inkWidths } from "../data/bookInkPreferences";
import { useBookInkPreferences } from "../hooks/useBookInkPreferences";
import { ScreenRecordControl } from "./ScreenRecording";
import LearnerAvatar from "./LearnerAvatar";
import { useBookReadPreferences } from "../hooks/useBookReadPreferences";
import "./fullscreenBook.css";

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5];

export default function FullscreenBook({ initialPage, audio, onClose }: { initialPage: number; audio: CourseAudio; onClose: () => void }) {
  const { profile } = useLearner();
  const { enabled: tapToRead, setEnabled: setTapToRead, storageError: readPreferenceError } = useBookReadPreferences();
  const dialog = useRef<HTMLDialogElement>(null);
  const unitButton = useRef<HTMLButtonElement>(null);
  const pageButton = useRef<HTMLButtonElement>(null);
  const pageDialog = useRef<HTMLDialogElement>(null);
  const pageSlider = useRef<HTMLInputElement>(null);
  const speedButton = useRef<HTMLButtonElement>(null);
  const inkButton = useRef<HTMLButtonElement>(null);
  const scrubbing = useRef(false);
  const [panel, setPanel] = useState<"units" | "pages" | "speed" | "ink" | null>(null);
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
  const { preferences, setColor, setWidth, storageError: preferenceError } = useBookInkPreferences();
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
  const closePageDialog = () => {
    pageDialog.current?.close();
    setPanel(null);
    pageButton.current?.focus();
  };
  useEffect(() => {
    if (panel !== "pages") return;
    const node = pageDialog.current;
    node?.showModal();
    pageSlider.current?.focus();
    return () => node?.close();
  }, [panel]);
  return createPortal(<dialog ref={dialog} className="kb-fullscreen-book" aria-label="Fullscreen talking book" data-ink-tools={showInkTools || undefined} data-ink-error={inkError || undefined}
    onPointerDown={(event) => { if (!(event.target as Element).closest(".kb-fullscreen-navigation")) setPanel(null); }}
    onCancel={(event) => {
      event.preventDefault();
      if (panel) { (panel === "units" ? unitButton : panel === "pages" ? pageButton : panel === "speed" ? speedButton : inkButton).current?.focus(); setPanel(null); }
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
          <button ref={pageButton} className="kb-reader-page-button" aria-label={`Choose book page, current page ${page}`} aria-haspopup="dialog" aria-expanded={panel === "pages"} aria-controls="kb-reader-page-list"
            onClick={() => { scrubbing.current = false; setPreviewPage(page); setPanel(panel === "pages" ? null : "pages"); }}>
            <span>Page</span><strong>{page}</strong><span className="kb-reader-page-total">/ 95</span><ChevronDown size={13} />
          </button>
          <dialog ref={pageDialog} id="kb-reader-page-list" className="kb-reader-page-dialog" aria-labelledby="kb-reader-page-title"
            onCancel={event => { event.preventDefault(); event.stopPropagation(); closePageDialog(); }}
            onClick={event => {
              if (event.target !== event.currentTarget) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePageDialog();
            }}>
            <div className="kb-reader-page-dialog-heading"><h2 id="kb-reader-page-title">Choose a page</h2><button onClick={closePageDialog} aria-label="Close page picker"><X size={21} /></button></div>
            <div className="kb-reader-page-preview"><span>Page</span><output htmlFor="kb-reader-page-slider">{previewPage}</output><span>/ 95</span></div>
            <p id="kb-reader-page-help">Slide to choose a page. Release to open it.</p>
            <input ref={pageSlider} id="kb-reader-page-slider" className="kb-reader-page-slider" aria-label="Book page" aria-describedby="kb-reader-page-help" aria-valuetext={`Page ${previewPage} of 95`}
              type="range" min={4} max={95} step={1} value={previewPage} style={{ "--page-progress": `${(previewPage - 4) / 91 * 100}%` } as CSSProperties}
              onPointerDown={() => { scrubbing.current = true; }}
              onChange={(event) => { const next = Number(event.currentTarget.value); setPreviewPage(next); if (!scrubbing.current) jump(next); }}
              onPointerUp={(event) => { scrubbing.current = false; jump(Number(event.currentTarget.value)); closePageDialog(); }}
              onPointerCancel={() => { scrubbing.current = false; setPreviewPage(page); }} />
            <div className="kb-reader-page-limits" aria-hidden="true"><span>4</span><span>95</span></div>
            <button className="kb-reader-page-open" onClick={() => { jump(previewPage); closePageDialog(); }}>Open page {previewPage}</button>
          </dialog>
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
        <button className="kb-reader-read-switch" type="button" role="switch" aria-label="Tap to read" aria-checked={tapToRead}
          title={`Tap to read: ${tapToRead ? "on" : "off"}`}
          onClick={() => { setTapToRead(!tapToRead); setPanel(null); if (tapToRead) { audio.stop(); pauseOtherMedia(); } }}>
          {tapToRead ? <Volume2 size={22} aria-hidden="true" /> : <VolumeX size={22} aria-hidden="true" />}</button>
        <div className="kb-reader-learner" aria-label={`Current learner: ${profile.name}`} title={profile.name}>
          <LearnerAvatar avatarId={profile.avatarId} /><span>{profile.name}</span>
        </div>
        <button className="kb-fullscreen-close" onClick={close} aria-label="Close talking book"><X size={21} /></button>
      </div>
      {readPreferenceError && <p className="kb-reader-read-error" role="status">Tap to read could not be saved. Your choice applies for now.<button onClick={() => setTapToRead(tapToRead)}>Retry</button></p>}
      {showInkTools && <div className="kb-reader-ink-tools" aria-label="Handwriting tools">
        {writing && <div className="kb-reader-ink-actions">
          <button aria-label="Pen" aria-pressed={inkTool === "pen"} disabled={!inkReady} onClick={() => setInkTool("pen")}><PenLine size={19} /><span>Pen</span></button>
          <button aria-label="Eraser" aria-pressed={inkTool === "eraser"} disabled={!inkReady} onClick={() => setInkTool("eraser")}><Eraser size={19} /><span>Eraser</span></button>
          <button aria-label="Undo handwriting" disabled={!ink.canUndo} onClick={ink.undo}><Undo2 size={19} /><span>Undo</span></button>
        </div>}
        {writing && <div className="kb-reader-ink-picker">
          <button ref={inkButton} className="kb-reader-ink-button" aria-label="Pen color and thickness" aria-expanded={panel === "ink"} aria-controls="kb-reader-ink-options"
            onClick={() => setPanel(panel === "ink" ? null : "ink")}><Palette size={20} /><span>Ink</span><i aria-hidden="true" style={{ background: preferences.color }} /></button>
          {panel === "ink" && <section id="kb-reader-ink-options" className="kb-reader-popover kb-reader-ink-menu" aria-label="Pen color and thickness">
            <h2>Pen settings</h2>
            <div role="group" aria-label="Pen color"><h3>Color</h3><div className="kb-reader-ink-colors">
              {inkColors.map(color => <button key={color.value} aria-label={`${color.name} ink`} aria-pressed={preferences.color === color.value} onClick={() => { setColor(color.value); setInkTool("pen"); }}>
                <i aria-hidden="true" style={{ background: color.value, color: color.name === "White" ? "#172033" : "#ffffff" }}>{preferences.color === color.value && <Check size={17} />}</i><span>{color.name}</span>
              </button>)}
            </div></div>
            <div role="group" aria-label="Pen thickness"><h3>Thickness</h3><div className="kb-reader-ink-widths">
              {inkWidths.map(width => <button key={width.value} aria-label={`${width.name} pen`} aria-pressed={preferences.width === width.value} onClick={() => { setWidth(width.value); setInkTool("pen"); }}>
                <svg width="38" height="14" aria-hidden="true"><path d="M4 7H34" stroke="currentColor" strokeWidth={width.value * 1000} strokeLinecap="round" /></svg><span>{width.name}</span>
              </button>)}
            </div></div>
            <p role={preferenceError ? "status" : undefined} className={preferenceError ? "kb-reader-ink-preference-error" : undefined}>{preferenceError ? "Pen settings could not be saved. Choose again to retry." : "Remembered for you. Changes apply to new strokes."}</p>
          </section>}
        </div>}
        <div className="kb-reader-ink-feedback" data-error={inkError || undefined}>
          <strong title={profile.name}>{profile.name}’s notes</strong><span role="status" aria-live="polite">{inkStatus}</span>
        </div>
        {inkError && <button className="kb-reader-ink-retry" onClick={() => { if (ink.status === "load-error") ink.retry(); ink.retryFailed(); }}>Retry</button>}
      </div>}
    </header>
    <BookPageReader key={pageRequest.revision} printedPage={pageRequest.page} onPageChange={rememberPage} audio={audio} playbackRate={playbackRate} annotation={{ ink, writing, tool: inkTool, preferences }} fitPage minimal />
    <ScreenRecordControl floating />
  </dialog>, document.body);
}
