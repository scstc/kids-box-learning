import { useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { bookFlashcards, bookVideos } from "../data/bookMedia";
import { relatedBookAudio } from "../data/bookAudio";
import { mediaUrl } from "../data/media";
import { originalFlashcardArt } from "../data/originalArt";
import type { CourseAudio } from "../hooks/useCourseAudio";
import "./bookMedia.css";
import MediaSubtitles from "./MediaSubtitles";

const videoKinds: Record<string, string> = { song: "歌曲", karaoke: "伴奏跟唱", story: "故事", activity: "拓展活动" };
const audioKinds: Record<string, string> = { teacher: "教师配套", workbook: "练习册", pupil: "学生用书", disc: "CD 音轨" };

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
  return <section className="kb-media" aria-label={`第 ${unitId} 单元原版资源`}>
    <h2>看一看，唱一唱。</h2>
    <div className="kb-media-tabs" role="group" aria-label="原版资源类型">
      {([['video', `视频 · ${videos.length}`], ['cards', `闪卡 · ${cards.length}`], ['audio', '配套音频']] as const).map(([id, title]) =>
        <button key={id} aria-pressed={tab === id} onClick={() => { setTab(id); setSelected(""); setError(""); audio.stop(); }}>{title}</button>)}
    </div>
    {error && <p role="alert">{error}</p>}
    {tab === "video" && <>
      {video && <div className="kb-media-player">
        <strong>{videoKinds[video.kind]} · {video.name}</strong>
        <video ref={videoPlayer} key={video.file} controls playsInline preload="metadata" src={mediaUrl(video.file)} poster={mediaUrl(video.poster)} onPlay={audio.stop} onError={() => setError("视频未能加载，请重新选择视频。")} />
        <MediaSubtitles key={video.file} file={video.file} mediaRef={videoPlayer} />
      </div>}
      <div className="kb-media-grid">{videos.map((item) => <button key={item.file} aria-pressed={selected === item.file} onClick={() => { audio.stop(); setSelected(item.file); setError(""); }}>
        <img src={mediaUrl(item.poster)} alt="" loading="lazy" />
        <strong>{videoKinds[item.kind]}</strong><span>{item.name}</span>
      </button>)}</div>
    </>}
    {tab === "cards" && <>
      <p>点原版闪卡，听配套英式发音。</p>
      <div className="kb-media-grid kb-flashcards">{cards.map((card) => <button key={card.number} aria-label={`闪卡 ${card.name}，点击听发音`} onClick={() => void audio.play(card.name)}>
        <img src={mediaUrl(originalFlashcardArt[card.number]?.file ?? card.file)} alt={card.name} loading="lazy" /><strong>{card.name}</strong><Volume2 size={18} />
      </button>)}</div>
      {unitId === 3 && <p>提供的闪卡中缺少编号 073，其他闪卡已全部收录。</p>}
    </>}
    {tab === "audio" && <>
      <p>课本录音可直接在书页点读。这里保留学生用书、练习册和教师配套音频。</p>
      <label className="kb-audio-filter"><input type="checkbox" checked={allAudio} onChange={(event) => { setAllAudio(event.target.checked); setSelected(""); }} />查看全册全部 244 段音频（含 CD）</label>
      {recording && <div className="kb-media-player"><strong>{audioKinds[recording.kind]} · {recording.name}</strong>
        <audio ref={audioPlayer} key={recording.file} aria-label="配套音频播放器" src={mediaUrl(recording.file)} controls preload="metadata" onPlay={audio.stop} onError={() => setError("录音未能加载，请重新选择录音。")} />
        <MediaSubtitles key={recording.file} file={recording.file} mediaRef={audioPlayer} />
      </div>}
      <div className="kb-media-recordings">{recordings.map((item) => <button key={item.file} aria-pressed={selected === item.file} onClick={() => { audio.stop(); setSelected(item.file); setError(""); }}><Volume2 size={17} /><span><small>{audioKinds[item.kind]}</small>{item.name}</span></button>)}</div>
    </>}
  </section>;
}
