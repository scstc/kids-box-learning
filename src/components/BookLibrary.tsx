import { useState } from "react";
import { ArrowLeft, FileAudio } from "lucide-react";
import { bookSections } from "../data/bookActivities";
import { useBookResources } from "../hooks/useBookResources";
import "./bookPages.css";
import BookPageReader from "./BookPageReader";

export default function BookLibrary({
  group,
  onBack,
}: {
  group: string;
  onBack: () => void;
}) {
  const sections = bookSections.filter((section) => section.group === group);
  const [selected, setSelected] = useState(sections[0].id);
  const section = sections.find((item) => item.id === selected) ?? sections[0];
  const resources = useBookResources(`book1:section:${section.id}`);
  return (
    <section className="kb-book-library">
      <button className="kb-btn kb-btn-secondary" onClick={onBack}>
        <ArrowLeft size={17} />
        返回课程地图
      </button>
      <h1>{group}</h1>
      <p>这些也是本册的一部分。打开对应原书页，按页面里的活动练习。</p>
      <div className="kb-book-library-layout">
        <nav className="kb-book-chapters" aria-label="教材补充板块目录">
          {sections.map((item) => (
            <button
              key={item.id}
              aria-pressed={item.id === section.id}
              onClick={() => setSelected(item.id)}
            >
              <strong>{item.title}</strong>
              <small>
                {item.zh} · 第 {item.page}
                {item.endPage !== item.page ? `–${item.endPage}` : ""} 页
              </small>
            </button>
          ))}
        </nav>
        <article className="kb-book-section-detail">
          <h2>{section.title}</h2>
          <p>
            {section.zh} · 书上第 {section.page}
            {section.endPage !== section.page ? `–${section.endPage}` : ""} 页
          </p>
          {section.activities.length > 0 && (
            <ol>
              {section.activities.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ol>
          )}
          <div className="kb-book-resource-buttons">
            <label>
              <FileAudio size={18} />
              添加本板块原版音频
              <input
                aria-label="添加板块音频"
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
          {resources.error && <p role="alert">{resources.error}</p>}
          {resources.urls.audio ? (
            <audio
              key={resources.urls.audio}
              src={resources.urls.audio}
              controls
              loop
              style={{ width: "100%", marginTop: 15 }}
            />
          ) : (
            <p>
              原版录音尚未添加。可以先看图练习；听力、歌谣需要相应的教材录音。
            </p>
          )}
          <BookPageReader printedPage={section.page} />
        </article>
      </div>
    </section>
  );
}
