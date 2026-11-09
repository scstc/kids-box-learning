import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileAudio } from "lucide-react";
import { bookSections } from "../data/bookActivities";
import { useBookResources } from "../hooks/useBookResources";
import "./bookPages.css";
import BookPageReader from "./BookPageReader";
import type { CourseAudio } from "../hooks/useCourseAudio";

export default function BookLibrary({
  group,
  onBack,
  audio,
}: {
  group: string;
  onBack: () => void;
  audio: CourseAudio;
}) {
  const sections = bookSections.filter((section) => section.group === group);
  const [selected, setSelected] = useState(sections[0].id);
  const section = sections.find((item) => item.id === selected) ?? sections[0];
  const resources = useBookResources(`book1:section:${section.id}`);
  const player = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    audio.stop();
  }, [section.id, audio.stop]);
  return (
    <section className="kb-book-library">
      <button className="kb-btn kb-btn-secondary" onClick={onBack}>
        <ArrowLeft size={17} />
        Back to course map
      </button>
      <h1>{group}</h1>
      <p>Explore more of your book. Open a page and try its activities.</p>
      <div className="kb-book-library-layout">
        <nav className="kb-book-chapters" aria-label="More book sections">
          {sections.map((item) => (
            <button
              key={item.id}
              aria-pressed={item.id === section.id}
              onClick={() => setSelected(item.id)}
            >
              <strong>{item.title}</strong>
              <small>
                Page {item.page}
                {item.endPage !== item.page ? `–${item.endPage}` : ""}
              </small>
            </button>
          ))}
        </nav>
        <article className="kb-book-section-detail">
          <h2>{section.title}</h2>
          <p>
            Page {section.page}
            {section.endPage !== section.page ? `–${section.endPage}` : ""}
          </p>
          {section.activities.length > 0 && (
            <ol>
              {section.activities.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ol>
          )}
          <details className="kb-book-parent-tools"><summary>For parents: add section audio</summary>
          <div className="kb-book-resource-buttons">
            <label>
              <FileAudio size={18} />
              Add section recording
              <input
                aria-label="Add section audio"
                type="file"
                accept="audio/*,.mp3,.m4a,.wav,.ogg"
                disabled={resources.loading || resources.saving}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) void resources.add("audio", file);
                  event.currentTarget.value = "";
                }}
              />
            </label>
          </div>
          </details>
          {resources.error && <p role="alert">{resources.error}</p>}
          {resources.urls.audio ? (
            <audio
              ref={player}
              key={resources.urls.audio}
              src={resources.urls.audio}
              controls
              loop
              onPlay={audio.stop}
              style={{ width: "100%", marginTop: 15 }}
            />
          ) : (
            <p>
              Tap a blue CD icon on the book page to hear its recording.
            </p>
          )}
          <BookPageReader
            printedPage={section.page}
            audio={audio}
            beforeSpeak={() => player.current?.pause()}
          />
        </article>
      </div>
    </section>
  );
}
