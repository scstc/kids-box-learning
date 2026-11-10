import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { bookHotspots } from "../data/bookHotspots";
import { bookTouchTargets } from "../data/bookTouchTargets";
import { bookAudioReferences, type BookAudioReference } from "../data/bookAudio";
import { mediaUrl } from "../data/media";
import type { CourseAudio } from "../hooks/useCourseAudio";
import "./bookPages.css";
import MediaSubtitles from "./MediaSubtitles";
import BookSceneActivity from "./BookSceneActivity";
import BookInkOverlay, { type BookAnnotation } from "./BookInkOverlay";
import { bookReadPreferencesStore } from "../data/bookReadPreferences";
import { useBookReadPreferences } from "../hooks/useBookReadPreferences";
import { useLearner } from "../hooks/useLearner";

type ReaderProps = {
  printedPage: number;
  audio: CourseAudio;
  beforeSpeak?: () => void;
  onPageChange?: (page: number) => void;
  fitPage?: boolean;
  minimal?: boolean;
  playbackRate?: number;
  annotation?: BookAnnotation;
};
function Page({ printedPage, audio, beforeSpeak, onPageChange, fitPage, minimal, playbackRate = 1, annotation }: ReaderProps) {
  const { profile } = useLearner();
  const { enabled, setEnabled, storageError } = useBookReadPreferences();
  const canRead = () => bookReadPreferencesStore.getSnapshot(profile.id).enabled;
  const [page, setPage] = useState(printedPage);
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<BookAudioReference | null>(null);
  const [mediaError, setMediaError] = useState("");
  const [loop, setLoop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (enabled) return;
    audio.stop();
    player.current?.pause();
    setIsPlaying(false);
  }, [enabled, audio.stop]);
  useEffect(() => {
    if (!player.current) return;
    player.current.defaultPlaybackRate = playbackRate;
    player.current.playbackRate = playbackRate;
    player.current.preservesPitch = true;
  }, [playbackRate]);
  useEffect(() => {
    const media = player.current;
    return () => media?.pause();
  }, []);
  const scroll = useRef<HTMLDivElement>(null);
  const tracks = bookAudioReferences.filter((ref) => ref.page === page);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const hotspots = bookHotspots[page] ?? [];
  const board = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const touchRegions = [
    ...hotspots,
    ...tracks.map(track => ({ ...track, word: `CD${track.disc}/${track.track}`, kind: "picture" as const })),
  ];
  const touchTargets = bookTouchTargets(touchRegions, imageSize.width, imageSize.height);
  useEffect(() => {
    if (!board.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setImageSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(board.current);
    return () => observer.disconnect();
  }, []);
  const playTrack = (track: BookAudioReference) => {
    if (!canRead()) { player.current?.pause(); return; }
    beforeSpeak?.();
    audio.stop();
    if (selected?.activity === track.activity && selected.file === track.file && player.current?.src) {
      if (!player.current.paused) player.current.pause();
      else void player.current.play().catch(() => setMediaError("This recording could not play. Please try again."));
      return;
    }
    player.current?.pause();
    setSelected(track);
    setMediaError("");
    if (!track.file || !player.current) return;
    player.current.src = mediaUrl(track.file);
    void player.current.play().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setMediaError("This recording could not play. Check the volume and try again.");
    });
  };
  const speakerSide = (index: number) => {
    const hotspot = hotspots[index];
    if (hotspot.kind !== "label" || !imageSize.height) return "hidden";
    const left = (hotspot.x / 100) * imageSize.width;
    const top = (hotspot.y / 100) * imageSize.height;
    const width = Math.max(touchTargets[index].minWidth, (hotspot.width / 100) * imageSize.width);
    const height = Math.max(touchTargets[index].minHeight, (hotspot.height / 100) * imageSize.height);
    const y = top + height / 2 - 11;
    for (const side of ["right", "left"] as const) {
      const x = side === "right" ? left + width + 6 : left - 28;
      if (x < 0 || x + 22 > imageSize.width) continue;
      const overlaps = touchRegions.some((other, otherIndex) => {
        if (otherIndex === index || other.word === hotspot.word) return false;
        const otherLeft = (other.x / 100) * imageSize.width;
        const otherTop = (other.y / 100) * imageSize.height;
        const otherWidth = Math.max(touchTargets[otherIndex].minWidth, (other.width / 100) * imageSize.width);
        const otherHeight = Math.max(touchTargets[otherIndex].minHeight, (other.height / 100) * imageSize.height);
        return (
          x < otherLeft + otherWidth + 2 &&
          x + 22 > otherLeft - 2 &&
          y < otherTop + otherHeight + 2 &&
          y + 22 > otherTop - 2
        );
      });
      if (!overlaps) return side;
    }
    return "hidden";
  };
  const go = (next: number) => {
    if (next < 4 || next > 95 || next === page) return;
    audio.stop();
    player.current?.pause();
    player.current?.removeAttribute("src");
    setSelected(null);
    setMediaError("");
    setPage(next);
    onPageChange?.(next);
    scroll.current?.scrollTo(0, 0);
    setPoint(null);
    setLoaded(false);
    setError(false);
  };
  return (
    <section className={`kb-book-reader${fitPage ? " kb-reader-fit" : ""}${minimal ? " kb-reader-minimal" : ""}`} aria-label="Book page">
      <div className="kb-book-page-toolbar">
        <button
          aria-label="Previous book page"
          disabled={page <= 4}
          onClick={() => go(page - 1)}
        >
          <ChevronLeft size={20} />
        </button>
        {!minimal && <label>
          Page{" "}
          <input
            aria-label="Book page number"
            type="number"
            min={4}
            max={95}
            value={page}
            onChange={(event) => {
              const next = Number(event.currentTarget.value);
              if (Number.isInteger(next)) go(next);
            }}
          />{" "}

        </label>}
        <button
          aria-label="Next book page"
          disabled={page >= 95}
          onClick={() => go(page + 1)}
        >
          <ChevronRight size={20} />
        </button>
        {!minimal && <><button
          aria-label="Zoom out"
          disabled={zoom <= 1}
          onClick={() => setZoom(Math.max(1, zoom - 0.25))}
        >
          <ZoomOut size={19} />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button
          aria-label="Zoom in"
          disabled={zoom >= 2}
          onClick={() => setZoom(Math.min(2, zoom + 0.25))}
        >
          <ZoomIn size={19} />
        </button>
        <button className="kb-tap-to-read-switch" role="switch" aria-label="Tap to read" aria-checked={enabled}
          onClick={() => setEnabled(!enabled)}>{enabled ? <Volume2 size={19} /> : <VolumeX size={19} />}<span>Tap to read</span><strong>{enabled ? "On" : "Off"}</strong></button></>}
      </div>
      {!minimal && storageError && <p className="kb-tap-to-read-error" role="alert">Tap to read settings could not be saved. Your choice applies for now.<button onClick={() => setEnabled(enabled)}>Retry</button></p>}
      {!minimal && <div className="kb-reader-tracks" aria-label="Page recordings">
        {tracks.map((track) => (
          <button
            key={track.activity}
            aria-pressed={selected?.activity === track.activity}
            disabled={!enabled}
            onClick={() => playTrack(track)}
          >
            <Volume2 size={17} />Activity {track.activity} · CD{track.disc}/{track.track}
            {!track.file && "(recording missing)"}
          </button>
        ))}
        {tracks.length > 0 && <label><input type="checkbox" checked={loop} onChange={(event) => setLoop(event.target.checked)} />Loop</label>}
      </div>}
      <div className="kb-reader-audio" hidden={minimal || !selected?.file || !enabled}>
        <audio ref={player} controls={!minimal && enabled} preload="none" loop={loop} muted={!enabled}
          aria-label="Book recording player"
          onLoadedMetadata={(event) => { event.currentTarget.playbackRate = playbackRate; }}
          onPlay={event => { if (!canRead()) { event.currentTarget.pause(); setIsPlaying(false); return; } audio.stop(); setIsPlaying(true); }}
          onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)}
          onError={() => setMediaError("This recording could not load. Please try again.")} />
      </div>
      {selected && !selected.file && <p role="status">The supplied files are missing CD{selected.disc}, track {selected.track} (activity {selected.activity}).</p>}
      {mediaError && <p role="alert">{mediaError}<button onClick={() => selected && playTrack(selected)}>Retry recording</button></p>}
      {!loaded && !error && <p role="status">Opening the book page…</p>}
      {error && (
        <p role="alert">
          This page could not load.
          <button
            onClick={() => {
              setError(false);
              setLoaded(false);
              setRetry((value) => value + 1);
            }}
          >
            Retry
          </button>
        </p>
      )}
      <div ref={scroll} className="kb-book-page-scroll" aria-busy={!loaded && !error}>
        <div
          ref={board}
          className="kb-book-page-image"
          style={{ width: fitPage ? `min(${zoom * 100}%, calc(var(--reader-page-height) * ${1259 / 1600 * zoom}))` : `${zoom * 100}%` }}
          onPointerDown={(event) => {
            if (!canRead()) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            setPoint({
              x: ((event.clientX - bounds.left) / bounds.width) * 100,
              y: ((event.clientY - bounds.top) / bounds.height) * 100,
            });
          }}
        >
          {!error && (
            <img
              key={`${page}:${retry}`}
              src={`${import.meta.env.BASE_URL}book-pages/page-${String(page).padStart(3, "0")}.jpg`}
              alt={`Book page ${page}`}
              decoding="async"
              draggable={false}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
            />
          )}
          <div className="kb-book-page-hotspots" hidden={!enabled} inert={!enabled || annotation?.writing || undefined}>
          {loaded &&
            !error &&
            hotspots.map((hotspot, index) => (
              <button
                key={`${page}:${index}`}
                className="kb-book-word-hotspot"
                data-kind={hotspot.kind}
                data-speaker-side={speakerSide(index)}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`,
                  ...touchTargets[index],
                }}
                aria-label={hotspot.kind === "text" ? `Read aloud: ${hotspot.word}` : `Play ${hotspot.word} pronunciation (${hotspot.kind === "label" ? "word label" : "picture area"})`}
                aria-pressed={audio.playingText === hotspot.word}
                disabled={!enabled}
                onClick={() => {
                  if (!canRead()) return;
                  beforeSpeak?.();
                  player.current?.pause();
                  void audio.play(hotspot.word);
                }}
              >
                <Volume2 size={15} aria-hidden="true" />
              </button>
            ))}
          {loaded && !error && tracks.map((track, index) => (
            <button key={`cd:${track.activity}`} className="kb-book-cd-hotspot"
              style={{ left: `${track.x}%`, top: `${track.y}%`, width: `${track.width}%`, height: `${track.height}%`, ...touchTargets[hotspots.length + index] }}
              aria-label={`Play page activity ${track.activity}, CD${track.disc} track ${track.track}${track.file ? "" : ", recording missing"}`}
              aria-pressed={selected?.activity === track.activity && isPlaying}
              data-missing={!track.file || undefined}
              disabled={!enabled}
              onClick={() => playTrack(track)} />
          ))}
          {loaded && !error && <BookSceneActivity key={page} page={page} speak={(text) => { if (!canRead()) return; beforeSpeak?.(); player.current?.pause(); void audio.play(text); }} />}
          {point && loaded && (
            <span
              className="kb-book-point"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            />
          )}
          </div>
          {loaded && !error && annotation?.ink.page === page && <BookInkOverlay key={`${annotation.ink.learnerId}:${page}`} {...annotation} />}
        </div>
      </div>
      <div className="kb-reader-playback">
        {minimal && selected?.file && enabled && <button className="kb-reader-pause" aria-label={isPlaying ? "Pause recording" : "Resume recording"} onClick={() => playTrack(selected)}>{isPlaying ? <Pause size={22} /> : <Play size={22} />}</button>}
        {enabled && (audio.playingText ? <div className="kb-media-subtitles" lang="en">{audio.playingText}</div> : <MediaSubtitles file={selected?.file} mediaRef={player} />)}
      </div>
      {!minimal && <p className="kb-book-page-note">
        {enabled ? tracks.length ? "Tap a blue CD icon to hear the activity recording." : "This page has no CD recording markers." : "Tap to read is off. You can still turn pages and zoom."}
        {enabled && hotspots.length > 0 && "Tap an outlined word or phrase to hear it."}
        Swipe sideways after zooming in.
      </p>}
    </section>
  );
}

export default function BookPageReader(props: ReaderProps) {
  return <Page key={props.printedPage} {...props} />;
}
