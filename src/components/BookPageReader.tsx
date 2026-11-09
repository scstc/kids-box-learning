import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { bookHotspots } from "../data/bookHotspots";
import { bookAudioReferences, type BookAudioReference } from "../data/bookAudio";
import { mediaUrl } from "../data/media";
import type { CourseAudio } from "../hooks/useCourseAudio";
import "./bookPages.css";
import MediaSubtitles from "./MediaSubtitles";
import BookSceneActivity from "./BookSceneActivity";

type ReaderProps = {
  printedPage: number;
  audio: CourseAudio;
  beforeSpeak?: () => void;
  onPageChange?: (page: number) => void;
  fitPage?: boolean;
  minimal?: boolean;
  playbackRate?: number;
};
function Page({ printedPage, audio, beforeSpeak, onPageChange, fitPage, minimal, playbackRate = 1 }: ReaderProps) {
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
    const width = Math.max(44, (hotspot.width / 100) * imageSize.width);
    const height = Math.max(44, (hotspot.height / 100) * imageSize.height);
    const y = top + height / 2 - 11;
    for (const side of ["right", "left"] as const) {
      const x = side === "right" ? left + width + 6 : left - 28;
      if (x < 0 || x + 22 > imageSize.width) continue;
      const overlaps = hotspots.some((other, otherIndex) => {
        if (otherIndex === index || other.kind !== "label") return false;
        const otherLeft = (other.x / 100) * imageSize.width;
        const otherTop = (other.y / 100) * imageSize.height;
        return (
          x < otherLeft + (other.width / 100) * imageSize.width + 2 &&
          x + 22 > otherLeft - 2 &&
          y < otherTop + (other.height / 100) * imageSize.height + 2 &&
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
        </button></>}
      </div>
      {!minimal && <div className="kb-reader-tracks" aria-label="Page recordings">
        {tracks.map((track) => (
          <button
            key={track.activity}
            aria-pressed={selected?.activity === track.activity}
            onClick={() => playTrack(track)}
          >
            <Volume2 size={17} />Activity {track.activity} · CD{track.disc}/{track.track}
            {!track.file && "(recording missing)"}
          </button>
        ))}
        {tracks.length > 0 && <label><input type="checkbox" checked={loop} onChange={(event) => setLoop(event.target.checked)} />Loop</label>}
      </div>}
      <div className="kb-reader-audio" hidden={minimal || !selected?.file}>
        <audio ref={player} controls={!minimal} preload="none" loop={loop}
          aria-label="Book recording player"
          onLoadedMetadata={(event) => { event.currentTarget.playbackRate = playbackRate; }}
          onPlay={() => { audio.stop(); setIsPlaying(true); }}
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
                }}
                aria-label={hotspot.kind === "text" ? `Read aloud: ${hotspot.word}` : `Play ${hotspot.word} pronunciation (${hotspot.kind === "label" ? "word label" : "picture area"})`}
                aria-pressed={audio.playingText === hotspot.word}
                onClick={() => {
                  beforeSpeak?.();
                  player.current?.pause();
                  void audio.play(hotspot.word);
                }}
              >
                <Volume2 size={15} aria-hidden="true" />
              </button>
            ))}
          {loaded && !error && tracks.map((track) => (
            <button key={`cd:${track.activity}`} className="kb-book-cd-hotspot"
              style={{ left: `${track.x}%`, top: `${track.y}%`, width: `${track.width}%`, height: `${track.height}%` }}
              aria-label={`Play page activity ${track.activity}, CD${track.disc} track ${track.track}${track.file ? "" : ", recording missing"}`}
              aria-pressed={selected?.activity === track.activity && isPlaying}
              data-missing={!track.file || undefined}
              onClick={() => playTrack(track)} />
          ))}
          {loaded && !error && <BookSceneActivity key={page} page={page} speak={(text) => { beforeSpeak?.(); player.current?.pause(); void audio.play(text); }} />}
          {point && loaded && (
            <span
              className="kb-book-point"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            />
          )}
        </div>
      </div>
      <div className="kb-reader-playback">
        {minimal && selected?.file && <button className="kb-reader-pause" aria-label={isPlaying ? "Pause recording" : "Resume recording"} onClick={() => playTrack(selected)}>{isPlaying ? <Pause size={22} /> : <Play size={22} />}</button>}
        {audio.playingText ? <div className="kb-media-subtitles" lang="en">{audio.playingText}</div> : <MediaSubtitles file={selected?.file} mediaRef={player} />}
      </div>
      {!minimal && <p className="kb-book-page-note">
        {tracks.length ? "Tap a blue CD icon to hear the activity recording." : "This page has no CD recording markers."}
        {hotspots.length > 0 && "Tap an outlined word or phrase to hear it."}
        Swipe sideways after zooming in.
      </p>}
    </section>
  );
}

export default function BookPageReader(props: ReaderProps) {
  return <Page key={props.printedPage} {...props} />;
}
