import { useEffect, useState, type RefObject } from "react";
import { bookSubtitles } from "../data/bookSubtitles";
import { visibleSubtitle, type SubtitleDocument } from "../data/subtitles";
import { mediaUrl } from "../data/media";
import "./mediaSubtitles.css";

const cache = new Map<string, Promise<SubtitleDocument>>();
export default function MediaSubtitles({ file, mediaRef }: { file?: string; mediaRef: RefObject<HTMLMediaElement | null> }) {
  const [document, setDocument] = useState<SubtitleDocument | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const path = file && bookSubtitles[file];
  useEffect(() => {
    let cancelled = false;
    setDocument(null);
    setFailed(false);
    if (!path) return;
    if (!cache.has(path)) cache.set(path, fetch(mediaUrl(path)).then((response) => {
      if (!response.ok) throw new Error("Subtitle load failed");
      return response.json() as Promise<SubtitleDocument>;
    }).catch((error) => { cache.delete(path); throw error; }));
    void cache.get(path)!.then((value) => { if (!cancelled) setDocument(value); }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [path]);
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    let frame = 0, sampledAt = -Infinity;
    const sample = () => { setTime(media.currentTime); setPlaying(!media.paused && !media.ended); };
    const tick = (now: number) => {
      frame = 0;
      if (media.paused || media.ended) { sample(); return; }
      if (now - sampledAt >= 50) { sampledAt = now; sample(); }
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      sample();
      if (media.paused || media.ended) { cancelAnimationFrame(frame); frame = 0; }
      else if (!frame) frame = requestAnimationFrame(tick);
    };
    const events = ["timeupdate", "play", "playing", "pause", "ended", "seeking", "seeked", "emptied", "loadedmetadata", "ratechange"];
    events.forEach((event) => media.addEventListener(event, update));
    update();
    return () => { cancelAnimationFrame(frame); events.forEach((event) => media.removeEventListener(event, update)); };
  }, [mediaRef, file]);
  if (!playing || !path) return null;
  const cue = document && visibleSubtitle(document.cues, time);
  if (failed) return <div className="kb-media-subtitles" role="status">Captions could not load</div>;
  if (!cue) return null;
  const timedText = cue.words?.map((word) => word.text).join(" ").replace(/\s+/g, " ").trim();
  const completeTimings = timedText === cue.text.replace(/\s+/g, " ").trim();
  return <div className="kb-media-subtitles" lang="en" aria-label="English captions" title="Automatically transcribed captions">
    {completeTimings && cue.words?.length ? cue.words.map((word, index) => <span key={index} className={time >= word.start && time < word.end ? "kb-caption-current" : undefined}>{word.text}{" "}</span>) : cue.text}
  </div>;
}
