import { useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { bookFlashcards, bookVideos } from "../data/bookMedia";
import { relatedBookAudio } from "../data/bookAudio";
import { mediaUrl } from "../data/media";
import { originalFlashcardArt } from "../data/originalArt";
import type { CourseAudio } from "../hooks/useCourseAudio";
import "./bookMedia.css";
import MediaSubtitles from "./MediaSubtitles";

const videoKinds: Record<string, string> = { song: "Song", karaoke: "Karaoke", story: "Story", activity: "Extra activity" };
const audioKinds: Record<string, string> = { teacher: "Teacher resources", workbook: "Activity book", pupil: "Pupil's book", disc: "CD track" };

export default function BookMedia({ unitId, audio }: { unitId: number; audio: CourseAudio }) {
  const [tab, setTab] = useState<"video" | "cards" | "audio">("video");
  const [selected, setSelected] = useState("");
  const [allAudio, setAllAudio] = useState(false);
  const [error, setError] = useState("");
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const videos = bookVideos.filter((item) => item.unitId === unitId);
  const cards = bookFlashcards.filter((item) => item.unitId === unitId);
  const recordings = relatedBookAudio.filter((item) => allAudio || item.unitId === unitId);
  const video = videos.find((item) => item.file === selected);
  const recording = recordings.find((item) => item.file === selected);
  return <section className="kb-media" aria-label={`Page${unitId}unit resources`}>
    <h2>Watch, listen and sing.</h2>
    <div className="kb-media-tabs" role="group" aria-label="Resource types">
      {([['video', `Videos ·${videos.length}`], ['cards', `Flashcards ·${cards.length}`], ['audio', "Recordings"]] as const).map(([id, title]) =>
        <button key={id} aria-pressed={tab === id} onClick={() => { setTab(id); setSelected(""); setError(""); audio.stop(); }}>{title}</button>)}
    </div>
    {error && <p role="alert">{error}</p>}
    {tab === "video" && <>
      {video && <div className="kb-media-player">
        <strong>{videoKinds[video.kind]} · {video.name}</strong>
        <video ref={videoPlayer} key={video.file} controls playsInline preload="metadata" src={mediaUrl(video.file)} poster={mediaUrl(video.poster)} onPlay={audio.stop} onError={() => setError("This video could not load. Please select it again.")} />
        <MediaSubtitles key={video.file} file={video.file} mediaRef={videoPlayer} />
      </div>}
      <div className="kb-media-grid">{videos.map((item) => <button key={item.file} aria-pressed={selected === item.file} onClick={() => { audio.stop(); setSelected(item.file); setError(""); }}>
        <img src={mediaUrl(item.poster)} alt="" loading="lazy" />
        <strong>{videoKinds[item.kind]}</strong><span>{item.name}</span>
      </button>)}</div>
    </>}
    {tab === "cards" && <>
      <p>Tap a flashcard to hear the British pronunciation.</p>
      <div className="kb-media-grid kb-flashcards">{cards.map((card) => <button key={card.number} aria-label={`Flashcard ${card.name}. Tap to listen.`} onClick={() => void audio.play(card.name)}>
        <img src={mediaUrl(originalFlashcardArt[card.number]?.file ?? card.file)} alt={card.name} loading="lazy" /><strong>{card.name}</strong><Volume2 size={18} />
      </button>)}</div>
      {unitId === 3 && <p>Flashcard 073 was missing from the supplied files. All other flashcards are included.</p>}
    </>}
    {tab === "audio" && <>
      <p>Tap CD icons in the book for recordings. Find pupil's book, activity book and teacher audio here.</p>
      <label className="kb-audio-filter"><input type="checkbox" checked={allAudio} onChange={(event) => { setAllAudio(event.target.checked); setSelected(""); }} />Show all 244 recordings, including CD tracks</label>
      {recording && <div className="kb-media-player"><strong>{audioKinds[recording.kind]} · {recording.name}</strong>
        <audio ref={audioPlayer} key={recording.file} aria-label="Recording player" src={mediaUrl(recording.file)} controls preload="metadata" onPlay={audio.stop} onError={() => setError("This recording could not load. Select it again.")} />
        <MediaSubtitles key={recording.file} file={recording.file} mediaRef={audioPlayer} />
      </div>}
      <div className="kb-media-recordings">{recordings.map((item) => <button key={item.file} aria-pressed={selected === item.file} onClick={() => { audio.stop(); setSelected(item.file); setError(""); }}><Volume2 size={17} /><span><small>{audioKinds[item.kind]}</small>{item.name}</span></button>)}</div>
    </>}
  </section>;
}
