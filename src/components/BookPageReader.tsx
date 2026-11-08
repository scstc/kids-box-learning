import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { bookHotspots } from "../data/bookHotspots";
import type { CourseAudio } from "../hooks/useCourseAudio";
import "./bookPages.css";

type ReaderProps = {
  printedPage: number;
  audio: CourseAudio;
  beforeSpeak?: () => void;
};
function Page({ printedPage, audio, beforeSpeak }: ReaderProps) {
  const [page, setPage] = useState(printedPage);
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const hotspots = bookHotspots[page] ?? [];
  const go = (next: number) => {
    if (next < 4 || next > 95 || next === page) return;
    audio.stop();
    setPage(next);
    setPoint(null);
    setLoaded(false);
    setError(false);
  };
  return (
    <section className="kb-book-reader" aria-label="原书页面">
      <div className="kb-book-page-toolbar">
        <button
          aria-label="原书上一页"
          disabled={page <= 4}
          onClick={() => go(page - 1)}
        >
          <ChevronLeft size={20} />
        </button>
        <label>
          第{" "}
          <input
            aria-label="原书页码"
            type="number"
            min={4}
            max={95}
            value={page}
            onChange={(event) => {
              const next = Number(event.currentTarget.value);
              if (Number.isInteger(next)) go(next);
            }}
          />{" "}
          页
        </label>
        <button
          aria-label="原书下一页"
          disabled={page >= 95}
          onClick={() => go(page + 1)}
        >
          <ChevronRight size={20} />
        </button>
        <button
          aria-label="缩小原书"
          disabled={zoom <= 1}
          onClick={() => setZoom(Math.max(1, zoom - 0.25))}
        >
          <ZoomOut size={19} />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button
          aria-label="放大原书"
          disabled={zoom >= 2}
          onClick={() => setZoom(Math.min(2, zoom + 0.25))}
        >
          <ZoomIn size={19} />
        </button>
      </div>
      {!loaded && !error && <p role="status">正在打开原书页面…</p>}
      {error && (
        <p role="alert">
          这一页没有加载成功。
          <button
            onClick={() => {
              setError(false);
              setLoaded(false);
            }}
          >
            重试
          </button>
        </p>
      )}
      <div className="kb-book-page-scroll" aria-busy={!loaded && !error}>
        <div
          className="kb-book-page-image"
          style={{ width: `${zoom * 100}%` }}
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
              key={page}
              src={`${import.meta.env.BASE_URL}book-pages/page-${String(page).padStart(3, "0")}.jpg`}
              alt={`原书第 ${page} 页`}
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
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`,
                }}
                aria-label={`播放 ${hotspot.word} 单词发音（${hotspot.kind === "label" ? "词语标签" : "动物图片"}）`}
                aria-pressed={audio.playingText === hotspot.word}
                onClick={() => {
                  beforeSpeak?.();
                  void audio.play(hotspot.word);
                }}
              >
                <Volume2 size={15} aria-hidden="true" />
              </button>
            ))}
          {point && loaded && (
            <span
              className="kb-book-point"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            />
          )}
        </div>
      </div>
      <p className="kb-book-page-note">
        {hotspots.length
          ? "点动物图片或带喇叭的词语标签，听单词英式发音（配套词典音频）。"
          : "这一页暂支持点指，词语点读区域尚未配置。"}
        放大后可左右滑动查看。
      </p>
    </section>
  );
}

export default function BookPageReader(props: ReaderProps) {
  return <Page key={props.printedPage} {...props} />;
}
