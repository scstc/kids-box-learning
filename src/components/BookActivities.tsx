import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  Ear,
  FileAudio,
  ImagePlus,
  Lightbulb,
  Mic2,
  Music,
  Repeat2,
  Upload,
  Users,
} from "lucide-react";
import {
  officialSampleAudioUrl,
  officialSampleUrl,
  verifiedBookActivities,
  type BookActivityKind,
} from "../data/bookActivities";
import { useBookResources } from "../hooks/useBookResources";
import "./bookActivities.css";

const icons = {
  point: Ear,
  repeat: AudioLines,
  actions: Users,
  chant: Mic2,
  song: Music,
  phonics: Lightbulb,
  questions: Users,
  story: BookOpen,
  respond: AudioLines,
};
const activitiesLabel: Record<BookActivityKind, string> = {
  point: "听音指认",
  repeat: "听读模仿",
  actions: "动作互动",
  chant: "节奏歌谣",
  song: "歌曲跟唱",
  phonics: "自然拼读",
  questions: "情景问答",
  story: "连环故事",
  respond: "听辨表达",
};
export default function BookActivities({
  unitId,
  onPractice,
}: {
  unitId: number;
  onPractice: () => void;
}) {
  const activities = verifiedBookActivities[unitId] ?? [];
  const [selected, setSelected] = useState(activities[0]?.number ?? 1);
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const parsed: unknown = JSON.parse(
        localStorage.getItem("kids-box-book-activity-progress-v1") ?? "[]",
      );
      return Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === "string")
        : [];
    } catch {
      return [];
    }
  });
  const [progressError, setProgressError] = useState(false);
  const [loop, setLoop] = useState(false);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [mediaError, setMediaError] = useState("");
  const activity =
    activities.find((activity) => activity.number === selected) ??
    activities[0];
  const resourceKey = `book1:unit${unitId}:activity${activity?.number ?? 0}`;
  const resources = useBookResources(resourceKey);
  const player = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setSelected(activities[0]?.number ?? 1);
  }, [unitId, activities]);
  useEffect(() => {
    setPoint(null);
    setMediaError("");
    player.current?.pause();
  }, [resourceKey]);
  const mark = () => {
    const next = [...new Set([...completed, resourceKey])];
    setCompleted(next);
    try {
      localStorage.setItem(
        "kids-box-book-activity-progress-v1",
        JSON.stringify(next),
      );
    } catch {
      setProgressError(true);
    }
  };
  const add = async (kind: "image" | "audio", files: FileList | null) => {
    const file = files?.[0];
    if (file) await resources.add(kind, file);
  };
  if (!activity)
    return (
      <section className="kb-book-unverified">
        <BookOpen size={41} />
        <span className="kb-eyebrow">
          FOLLOW THE BOOK, ACTIVITY BY ACTIVITY
        </span>
        <h2>这一单元的课本活动，还在等教材页。</h2>
        <p>
          不是每个单元都有相同的活动顺序。尚未取得这个单元的原书页面，因此暂不编造
          Listen and point、歌曲或故事的页码与内容。
        </p>
        <div className="kb-book-type-preview">
          <span>
            <Ear size={18} />
            Listen and point
          </span>
          <span>
            <Music size={18} />
            Sing the song
          </span>
          <span>
            <BookOpen size={18} />
            Listen to the story
          </span>
        </div>
        <p className="kb-book-resource-note">
          当前已根据外研社官方样张核实 Unit 1 的 12
          项活动，其他单元仍可进行原创配套练习。
        </p>
        <div className="kb-button-row">
          <button className="kb-btn" onClick={onPractice}>
            先做词语配套练习
            <ArrowRight size={18} />
          </button>
          <a
            className="kb-btn kb-btn-secondary"
            href="https://kb.unischool.cn/"
            target="_blank"
            rel="noreferrer"
          >
            查看官方教材资源
            <BookOpen size={17} />
          </a>
        </div>
      </section>
    );
  const Icon = icons[activity.kind];
  return (
    <section className="kb-book-activities">
      <div className="kb-book-activity-intro">
        <span className="kb-eyebrow">THE BOOK HAS MORE THAN WORDS</span>
        <h2>跟着课本，听、指、说、唱。</h2>
        <p>
          按原书活动顺序学习。Unit 1
          的活动标题、页码与录音编号已按外研社样张核对。
        </p>
        <div>
          <a href={officialSampleUrl} target="_blank" rel="noreferrer">
            官方第 1 单元样张
            <BookOpen size={14} />
          </a>
          <a href={officialSampleAudioUrl} target="_blank" rel="noreferrer">
            官方第 1 单元音频包
            <FileAudio size={14} />
          </a>
        </div>
      </div>
      <div className="kb-book-workspace">
        <aside className="kb-book-activity-list" aria-label="课本活动列表">
          {[1, 2, 3].map((lesson) => (
            <div key={lesson}>
              <h3>
                LESSON {lesson}
                <span>
                  第 {4 + (lesson - 1) * 2}–{5 + (lesson - 1) * 2} 页
                </span>
              </h3>
              {activities
                .filter((item) => item.lesson === lesson)
                .map((item) => {
                  const ItemIcon = icons[item.kind];
                  return (
                    <button
                      key={item.number}
                      aria-pressed={activity.number === item.number}
                      onClick={() => setSelected(item.number)}
                    >
                      <span className="kb-book-activity-number">
                        {item.number}
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.zh}</small>
                      </div>
                      {completed.includes(
                        `book1:unit${unitId}:activity${item.number}`,
                      ) ? (
                        <Check size={16} />
                      ) : (
                        <ItemIcon size={16} />
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </aside>
        <article className="kb-book-activity-detail" key={resourceKey}>
          <div className="kb-book-activity-meta">
            <span>
              ACTIVITY {String(activity.number).padStart(2, "0")} · P
              {activity.page}
            </span>
            <span>
              {activity.track
                ? `CD1 · Track ${String(activity.track).padStart(2, "0")}`
                : "情景问答活动"}
            </span>
          </div>
          <span className="kb-book-kind">
            <Icon size={18} />
            {activitiesLabel[activity.kind]}
          </span>
          <h3>{activity.title}</h3>
          <strong className="kb-book-activity-zh">{activity.zh}</strong>
          <p className="kb-book-focus">{activity.focus}</p>
          <div className="kb-book-instruction">
            <Lightbulb size={20} />
            <p>{activity.instruction}</p>
          </div>
          <div className="kb-private-book-notice">
            <Upload size={17} />
            <p>
              原书图片和音频由家长添加，<strong>只保存在本设备</strong>
              ，不会上传到网站或公开仓库。歌曲、歌谣与故事不使用合成语音代替。
            </p>
          </div>
          <div className="kb-book-resource-buttons">
            <label>
              <ImagePlus size={18} />
              {resources.urls.image ? "更换教材页照片" : "添加教材页照片"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={resources.saving || resources.loading}
                onChange={(event) => {
                  void add("image", event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <label>
              <FileAudio size={18} />
              {resources.urls.audio ? "更换对应原版音频" : "添加对应原版音频"}
              <input
                type="file"
                accept="audio/*,.mp3,.m4a,.wav,.ogg"
                disabled={resources.saving || resources.loading}
                onChange={(event) => {
                  void add("audio", event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            </label>
          </div>
          {resources.saving && (
            <p className="kb-book-save-status" role="status">
              正在保存在本设备…
            </p>
          )}
          {resources.error && (
            <p className="kb-book-resource-error" role="alert">
              {resources.error}
            </p>
          )}
          {resources.urls.audio ? (
            <div className="kb-book-player">
              <div>
                <FileAudio size={17} />
                <span>{resources.resources.audio?.name}</span>
                <label>
                  <input
                    type="checkbox"
                    checked={loop}
                    onChange={(event) => setLoop(event.target.checked)}
                  />
                  <Repeat2 size={15} />
                  循环
                </label>
              </div>
              <audio
                key={resources.urls.audio}
                ref={player}
                src={resources.urls.audio}
                controls
                preload="metadata"
                loop={loop}
                onError={() =>
                  setMediaError(
                    "这条音频无法播放，请尝试 MP3、M4A 或 WAV 格式。",
                  )
                }
              />
            </div>
          ) : (
            <div className="kb-book-audio-missing">
              <Music size={23} />
              <div>
                <strong>
                  {activity.kind === "song"
                    ? "原书歌曲尚未添加"
                    : activity.kind === "story"
                      ? "原版故事音频尚未添加"
                      : "本活动原版音频尚未添加"}
                </strong>
                <p>
                  {activity.track
                    ? `请添加 CD1 的第 ${activity.track} 轨，或使用纸质书配套的官方播放器。`
                    : "可以先按照纸质书和家人进行问答。"}
                </p>
              </div>
            </div>
          )}
          {resources.urls.image ? (
            <div
              className="kb-book-page-board"
              onPointerDown={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                setPoint({
                  x: ((event.clientX - bounds.left) / bounds.width) * 100,
                  y: ((event.clientY - bounds.top) / bounds.height) * 100,
                });
              }}
            >
              <img
                src={resources.urls.image}
                alt={`家长添加的课本第 ${activity.page} 页`}
                onError={() =>
                  setMediaError(
                    "教材页图片无法显示，请尝试 JPG、PNG 或 WebP 格式。",
                  )
                }
              />
              {point && (
                <span
                  className="kb-book-point"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  aria-hidden="true"
                />
              )}
            </div>
          ) : (
            <div className="kb-book-page-placeholder">
              <BookOpen size={35} />
              <strong>拿出课本第 {activity.page} 页，一起练习。</strong>
              <p>也可以添加自己拍摄的教材页，在平板上边听边指。</p>
            </div>
          )}
          {mediaError && (
            <p className="kb-book-resource-error" role="alert">
              {mediaError}
            </p>
          )}
          <p className="kb-book-pointer-note">
            屏幕点指只显示你指到的位置，不会自动判定答案。
          </p>
          <div className="kb-book-activity-footer">
            <button className="kb-btn" onClick={mark}>
              <Check size={18} />
              {completed.includes(resourceKey)
                ? "这项活动练习过啦"
                : "我练习好啦"}
            </button>
            {activity.number < activities.length && (
              <button
                className="kb-btn kb-btn-secondary"
                onClick={() => setSelected(activity.number + 1)}
              >
                下一项活动
                <ArrowRight size={17} />
              </button>
            )}
          </div>
          {progressError && (
            <p className="kb-book-resource-error" role="status">
              本次练习可以继续，但进度暂时无法保存。
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
