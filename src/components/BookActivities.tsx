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
import BookPageReader from "./BookPageReader";
import type { CourseAudio } from "../hooks/useCourseAudio";
import { findBookAudio } from "../data/bookAudio";
import { mediaUrl } from "../data/media";
import MediaSubtitles from "./MediaSubtitles";

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
  craft: ImagePlus,
  game: Users,
  reading: BookOpen,
};
const activitiesLabel: Record<BookActivityKind, string> = {
  point: "Listen and point",
  repeat: "Listen and repeat",
  actions: "Listen and act",
  chant: "Say the chant",
  song: "Sing along",
  phonics: "Phonics",
  questions: "Ask and answer",
  story: "Story time",
  respond: "Listen and respond",
  craft: "Make and create",
  game: "Play together",
  reading: "Read and listen",
};
const practiceTips: Record<BookActivityKind, string> = {
  point: "Listen to the recording. Point to the person or picture you hear, then listen again.",
  repeat: "Listen to the whole recording. Pause and repeat. Try the words in a complete sentence.",
  actions: "Listen and do the actions. Take turns playing the different characters.",
  chant: "Listen to the chant, then clap along and join in with its rhythm.",
  song: "Listen to the song, then sing along. Use Loop to enjoy it again.",
  phonics: "Listen for the sound in each word. Repeat the sound, then say the whole word.",
  questions: "Look at the pictures. Take turns asking and answering. Try your own information too.",
  story: "Listen to the whole story and follow the pictures in order. Then act it out together.",
  respond: "Listen carefully. Pause to say your answer, then play the recording again.",
  craft: "Follow the pictures in your book. Make it together and use English as you work.",
  game: "Follow the example in the book. Take turns, listen to each other and have fun.",
  reading: "Read and look at the pictures. Follow the instructions, then listen and check.",
};
export default function BookActivities({
  unitId,
  onPractice,
  audio,
}: {
  unitId: number;
  onPractice: () => void;
  audio: CourseAudio;
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
  const original = activity && findBookAudio(activity.page, activity.number);
  const audioSource = resources.urls.audio ?? (original?.file ? mediaUrl(original.file) : undefined);
  const player = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setSelected(activities[0]?.number ?? 1);
  }, [unitId, activities]);
  useEffect(() => {
    setPoint(null);
    setMediaError("");
    player.current?.pause();
    audio.stop();
  }, [resourceKey, audio.stop]);
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
        <h2>No book activities were found for this unit.</h2>
        <p>Choose a unit from 1–12 on the course map, or try word practice.</p>
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
          Book activities are available for all 12 units.
        </p>
        <div className="kb-button-row">
          <button className="kb-btn" onClick={onPractice}>
            Try word practice
            <ArrowRight size={18} />
          </button>
          <a
            className="kb-btn kb-btn-secondary"
            href="https://kb.unischool.cn/"
            target="_blank"
            rel="noreferrer"
          >
            Publisher resources
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
        <h2>Listen, point, speak and sing.</h2>
        <p>Follow the book. Open an activity to see its page.</p>
        <div>
          <a href={officialSampleUrl} target="_blank" rel="noreferrer">
            Unit 1 publisher sample
            <BookOpen size={14} />
          </a>
          <a href={officialSampleAudioUrl} target="_blank" rel="noreferrer">
            Unit 1 publisher audio
            <FileAudio size={14} />
          </a>
        </div>
      </div>
      <div className="kb-book-workspace">
        <aside className="kb-book-activity-list" aria-label="Book activities">
          {[1, 2, 3].map((lesson) => (
            <div key={lesson}>
              <h3>
                LESSON {lesson}
                <span>
                  Page {activities[0].page + (lesson - 1) * 2}–
                  {activities[0].page + (lesson - 1) * 2 + 1}
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
        <article className="kb-book-activity-detail">
          <div className="kb-book-activity-meta">
            <span>
              ACTIVITY {String(activity.number).padStart(2, "0")} · P
              {activity.page}
            </span>
            <span>
              {activity.track
                ? `CD${original?.disc ?? 1} · Track ${String(activity.track).padStart(2, "0")}`
                : "Picture activity"}
            </span>
          </div>
          <span className="kb-book-kind">
            <Icon size={18} />
            {activitiesLabel[activity.kind]}
          </span>
          <h3>{activity.title}</h3>
          <details className="kb-book-teacher-note">
            <summary>Practice tips</summary>
            <div className="kb-book-instruction">
              <Lightbulb size={20} />
              <p>{practiceTips[activity.kind]}</p>
            </div>
          </details>
          <details className="kb-book-parent-tools">
            <summary>For parents: add audio or a page photo</summary>
            <div className="kb-private-book-notice">
              <Upload size={17} />
              <p>
                Book pages and recordings are included. Any extra files you add
                <strong>stay on this device</strong>.
              </p>
            </div>
            <div className="kb-book-resource-buttons">
              <label>
                <ImagePlus size={18} />
                {resources.urls.image ? "Replace page photo" : "Add page photo"}
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
                {resources.urls.audio ? "Replace activity audio" : "Add activity audio"}
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
                Saving on this device…
              </p>
            )}
            {resources.error && (
              <p className="kb-book-resource-error" role="alert">
                {resources.error}
              </p>
            )}
          </details>
          {audioSource ? (
            <div className="kb-book-player">
              <div>
                <FileAudio size={17} />
                <span>{resources.resources.audio?.name ?? `Book recording · CD${original?.disc} / ${original?.track}`}</span>
                <label>
                  <input
                    type="checkbox"
                    checked={loop}
                    onChange={(event) => setLoop(event.target.checked)}
                  />
                  <Repeat2 size={15} />
                  Loop
                </label>
              </div>
              <audio
                key={audioSource}
                ref={player}
                src={audioSource}
                controls
                preload="metadata"
                loop={loop}
                onPlay={audio.stop}
                onError={() =>
                  setMediaError(
                    "This recording could not play. Try an MP3, M4A or WAV file.",
                  )
                }
              />
              <MediaSubtitles key={audioSource} file={resources.urls.audio ? undefined : original?.file} mediaRef={player} />
            </div>
          ) : (
            <div className="kb-book-audio-missing">
              <Music size={23} />
              <div>
                <strong>
                  {original ? "This recording is missing" : "Look, create and practise together"}
                </strong>
                <p>
                  {original
                    ? `Missing CD${original.disc}, track ${original.track} (page ${activity.page}, activity ${activity.number}). You can add it using the parent tools.`
                    : "This activity has no CD track. Follow the example in the book."}
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
                alt={`Parent-added book page ${activity.page}`}
                onError={() =>
                  setMediaError(
                    "This picture could not load. Try JPG, PNG or WebP.",
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
            <BookPageReader
              printedPage={activity.page}
              audio={audio}
              beforeSpeak={() => player.current?.pause()}
            />
          )}
          {mediaError && (
            <p className="kb-book-resource-error" role="alert">
              {mediaError}
            </p>
          )}
          <p className="kb-book-pointer-note">
            Tap to point at the picture. This activity does not check your answer.
          </p>
          <div className="kb-book-activity-footer">
            <button className="kb-btn" onClick={mark}>
              <Check size={18} />
              {completed.includes(resourceKey)
                ? "Activity practised"
                : "I've practised!"}
            </button>
            {activity.number < activities.length && (
              <button
                className="kb-btn kb-btn-secondary"
                onClick={() => setSelected(activity.number + 1)}
              >
                Next activity
                <ArrowRight size={17} />
              </button>
            )}
          </div>
          {progressError && (
            <p className="kb-book-resource-error" role="status">
              You can keep practising, but progress could not be saved.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
