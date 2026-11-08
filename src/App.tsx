import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Ear,
  Footprints,
  Headphones,
  Heart,
  HelpCircle,
  Leaf,
  Lightbulb,
  Map,
  PawPrint,
  Play,
  RotateCcw,
  Sparkles,
  Sprout,
  Star,
  Turtle,
  Volume2,
  X,
} from "lucide-react";
import { animals, makeQuizChoices, type AnimalId } from "./data/animals";
import AnimalArt, { SceneLeaves } from "./components/AnimalArt";
import AnimatedContent from "./components/reactbits/AnimatedContent";
import ClickSpark from "./components/reactbits/ClickSpark";
import { usePronunciation } from "./hooks/usePronunciation";
import { useProgress } from "./hooks/useProgress";

type Page = "explore" | "lab" | "passport";
type Mode = "listen" | "sounds" | "quiz";

export default function App() {
  const [page, setPage] = useState<Page>("explore");
  const [mode, setMode] = useState<Mode>("listen");
  const [activeIndex, setActiveIndex] = useState(0);
  const [partIndex, setPartIndex] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [quizRound, setQuizRound] = useState(0);
  const [wrongChoices, setWrongChoices] = useState<AnimalId[]>([]);
  const [correct, setCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [toast, setToast] = useState("");
  const lessonRef = useRef<HTMLElement>(null);
  const { play, stop, playing, audioError } = usePronunciation();
  const { learned, markLearned, reset, storageError } = useProgress();
  const animal = animals[activeIndex];
  const quizAnimal = animals[quizRound];
  const quizChoices = makeQuizChoices(quizAnimal.id, quizRound);

  useEffect(() => {
    stop();
    setPartIndex(null);
  }, [activeIndex, mode, page, stop]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const chooseAnimal = (index: number) => {
    setActiveIndex(index);
    setPage("explore");
    setMode("listen");
    lessonRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "nearest",
    });
  };
  const openPage = (next: Page) => {
    setPage(next);
    if (next === "lab") setMode("sounds");
    if (next === "explore") setMode("listen");
  };
  const startQuiz = () => {
    setQuizRound(0);
    setWrongChoices([]);
    setCorrect(false);
    setQuizFinished(false);
    setMode("quiz");
    setPage("explore");
  };
  const answer = (id: AnimalId) => {
    if (correct) return;
    if (id === quizAnimal.id) {
      setCorrect(true);
      markLearned(id);
      void play(id);
    } else setWrongChoices((previous) => [...previous, id]);
  };
  const nextQuestion = () => {
    stop();
    if (quizRound === animals.length - 1) setQuizFinished(true);
    else {
      setQuizRound((previous) => previous + 1);
      setCorrect(false);
      setWrongChoices([]);
    }
  };
  const finishAnimal = () => {
    markLearned(animal.id);
    setToast(`收集到一枚${animal.chinese}足迹！`);
    if (activeIndex < animals.length - 1) {
      setActiveIndex((previous) => previous + 1);
      setMode("listen");
    } else {
      setPage("passport");
      setToast("新足迹已收集，来看看你的探险护照！");
    }
  };

  return (
    <ClickSpark
      sparkColor={["#e5b74f", "#8cab73", "#db9b7d"]}
      sparkSize={7}
      sparkRadius={24}
      sparkCount={7}
      shape="star"
      duration={480}
    >
      <div className="app-shell">
        <a href="#main" className="skip-link">
          跳到学习内容
        </a>
        <header className="site-header">
          <button
            className="brand"
            onClick={() => openPage("explore")}
            aria-label="Little Safari 首页"
          >
            <span className="brand-icon">
              <Sprout size={27} strokeWidth={2.2} />
            </span>
            <span>
              little safari<span className="brand-dot">.</span>
              <small>小小声音探险家</small>
            </span>
          </button>
          <nav className="main-nav" aria-label="主导航">
            <button
              onClick={() => openPage("explore")}
              className={page === "explore" ? "active" : ""}
              aria-current={page === "explore" ? "page" : undefined}
            >
              <Compass size={18} />
              <span>动物探险</span>
            </button>
            <button
              onClick={() => openPage("lab")}
              className={page === "lab" ? "active" : ""}
              aria-current={page === "lab" ? "page" : undefined}
            >
              <AudioLines size={18} />
              <span>声音实验室</span>
            </button>
            <button
              onClick={() => openPage("passport")}
              className={page === "passport" ? "active" : ""}
              aria-current={page === "passport" ? "page" : undefined}
            >
              <BookOpen size={18} />
              <span>我的护照</span>
              {learned.length > 0 && (
                <span className="nav-count">{learned.length}</span>
              )}
            </button>
          </nav>
          <button
            className="help-button"
            aria-label="给家长的话"
            onClick={() => setHelpOpen(true)}
          >
            <HelpCircle size={18} />
            <span>给家长的话</span>
          </button>
        </header>

        <main id="main">
          <AnimatedContent distance={18} duration={0.6} trigger="mount">
            <section className="intro">
              <div>
                <div className="eyebrow">
                  <span /> A LITTLE SOUND, A BIG DISCOVERY
                </div>
                <h1>
                  {page === "passport" ? (
                    <>
                      每一个小脚印，<span>都是新发现。</span>
                    </>
                  ) : page === "lab" ? (
                    <>
                      把单词拆开，<span>让声音连起来。</span>
                    </>
                  ) : (
                    <>
                      听见声音，<span>认识新朋友。</span>
                      <svg
                        className="heading-spark"
                        viewBox="0 0 32 34"
                        aria-hidden="true"
                      >
                        <path
                          d="m14 2 1 9M29 9l-8 6M30 25l-9-3"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </>
                  )}
                </h1>
                <p>
                  {page === "passport"
                    ? "不用着急，按自己的节奏，把好奇心装进小小护照。"
                    : page === "lab"
                      ? "拍拍手，找音节；仔细听，发现藏在字母里的小秘密。"
                      : "不急着背字母。一起听一听、拼一拼，走进声音里的动物园。"}
                </p>
              </div>
              <div className="journey-progress">
                <div className="progress-mascot">
                  <PawPrint size={25} />
                </div>
                <div>
                  <div className="progress-label">
                    你的小小探险{" "}
                    <strong>
                      {learned.length}
                      <span> / 7</span>
                    </strong>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label="已学习动物"
                    aria-valuenow={learned.length}
                    aria-valuemin={0}
                    aria-valuemax={7}
                  >
                    <span style={{ width: `${(learned.length / 7) * 100}%` }} />
                  </div>
                  <small>
                    {learned.length === 7
                      ? "所有动物朋友都认识你啦！"
                      : "每认识一个朋友，就收集一枚足迹"}
                  </small>
                </div>
              </div>
            </section>
          </AnimatedContent>

          {page === "passport" ? (
            <AnimatedContent distance={22} trigger="mount">
              <section className="passport-panel">
                <div className="passport-heading">
                  <span className="section-kicker">
                    <Map size={17} /> MY LITTLE PASSPORT
                  </span>
                  <h2>我的动物朋友</h2>
                  <p>
                    已经认识了 {learned.length}{" "}
                    位朋友，再见面时，也记得大声打招呼哦。
                  </p>
                </div>
                <div className="stamp-grid">
                  {animals.map((item, index) => (
                    <button
                      key={item.id}
                      className={`stamp ${learned.includes(item.id) ? "collected" : ""}`}
                      onClick={() => chooseAnimal(index)}
                      aria-label={`${item.chinese}，${learned.includes(item.id) ? "已收集，点击复习" : "待探索，点击学习"}`}
                    >
                      <span className="stamp-circle">
                        <AnimalArt animal={item.id} />
                        {learned.includes(item.id) && (
                          <span className="stamp-check">
                            <Check size={15} />
                          </span>
                        )}
                      </span>
                      <strong>{item.name}</strong>
                      <span>{item.chinese}</span>
                      <small>
                        {learned.includes(item.id)
                          ? "好朋友，再读一遍"
                          : "等你来认识"}
                      </small>
                    </button>
                  ))}
                </div>
                <div className="passport-actions">
                  <button className="primary-button" onClick={startQuiz}>
                    <Headphones size={19} />
                    听音找朋友
                    <ArrowRight size={19} />
                  </button>
                  <button
                    className="text-button"
                    onClick={() => setResetOpen(true)}
                  >
                    <RotateCcw size={15} />
                    重新开始探险
                  </button>
                </div>
              </section>
            </AnimatedContent>
          ) : (
            <>
              <AnimatedContent
                distance={24}
                duration={0.7}
                trigger="mount"
                delay={0.1}
              >
                <section
                  className="lesson-panel"
                  ref={lessonRef}
                  aria-label="动物学习卡"
                >
                  <div className="lesson-toolbar">
                    <div
                      className="step-tabs"
                      role="tablist"
                      aria-label="学习方式"
                    >
                      <button
                        role="tab"
                        aria-selected={mode === "listen"}
                        onClick={() => setMode("listen")}
                        className={mode === "listen" ? "selected" : ""}
                      >
                        <span>01</span>
                        <Ear size={17} />
                        听一听
                      </button>
                      <button
                        role="tab"
                        aria-selected={mode === "sounds"}
                        onClick={() => setMode("sounds")}
                        className={mode === "sounds" ? "selected" : ""}
                      >
                        <span>02</span>
                        <AudioLines size={17} />
                        拆开读
                      </button>
                      <button
                        role="tab"
                        aria-selected={mode === "quiz"}
                        onClick={startQuiz}
                        className={mode === "quiz" ? "selected" : ""}
                      >
                        <span>03</span>
                        <Sparkles size={17} />
                        玩一玩
                      </button>
                    </div>
                    <span className="toolbar-label">
                      <Leaf size={15} />
                      {mode === "quiz" ? "听音找朋友" : "第 1 站 · 奇妙动物园"}
                    </span>
                  </div>

                  {mode === "quiz" ? (
                    <div
                      className="quiz-panel"
                      role="tabpanel"
                      aria-label="听音找朋友"
                    >
                      {quizFinished ? (
                        <div className="quiz-complete">
                          <span className="complete-icon">
                            <Star size={42} fill="currentColor" />
                          </span>
                          <span className="section-kicker">
                            SAFARI COMPLETE!
                          </span>
                          <h2>你找到所有动物朋友啦！</h2>
                          <p>7 个声音，7 位朋友。你的小耳朵真灵！</p>
                          <div className="complete-friends">
                            {animals.map((item) => (
                              <AnimalArt key={item.id} animal={item.id} />
                            ))}
                          </div>
                          <div className="complete-actions">
                            <button
                              className="primary-button"
                              onClick={() => setPage("passport")}
                            >
                              看看我的护照
                              <BookOpen size={18} />
                            </button>
                            <button
                              className="secondary-button"
                              onClick={startQuiz}
                            >
                              <RotateCcw size={17} />
                              再玩一次
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="quiz-heading">
                            <span className="section-kicker">
                              LISTEN & FIND
                            </span>
                            <span className="question-count">
                              {quizRound + 1} / 7
                            </span>
                            <h2>谁在和你打招呼？</h2>
                            <p>点一下小喇叭，找到声音里的动物朋友。</p>
                          </div>
                          <button
                            className={`quiz-play ${playing ? "is-playing" : ""}`}
                            onClick={() => void play(quizAnimal.id)}
                            aria-label="播放题目中的动物发音"
                          >
                            <Volume2 size={32} />
                            <span>{playing ? "仔细听…" : "听听它是谁"}</span>
                          </button>
                          <div className="quiz-choices">
                            {quizChoices.map((item) => (
                              <button
                                key={item.id}
                                className={`quiz-choice ${correct && item.id === quizAnimal.id ? "correct" : ""} ${wrongChoices.includes(item.id) ? "incorrect" : ""}`}
                                style={
                                  {
                                    "--animal-bg": item.background,
                                  } as CSSProperties
                                }
                                onClick={() => answer(item.id)}
                                disabled={
                                  correct || wrongChoices.includes(item.id)
                                }
                                aria-label={`选择${item.chinese}`}
                              >
                                <AnimalArt animal={item.id} />
                                <span>{item.chinese}</span>
                                {correct && item.id === quizAnimal.id && (
                                  <span className="answer-check">
                                    <Check size={19} />
                                  </span>
                                )}
                                {wrongChoices.includes(item.id) && (
                                  <small>再听听看</small>
                                )}
                              </button>
                            ))}
                          </div>
                          <div className="quiz-feedback" aria-live="polite">
                            {correct ? (
                              <>
                                <span>
                                  <Check size={20} />
                                  找对啦！{quizAnimal.name}，
                                  {quizAnimal.chinese}！
                                </span>
                                <button
                                  className="primary-button"
                                  onClick={nextQuestion}
                                >
                                  {quizRound === 6 ? "完成探险" : "下一位朋友"}
                                  <ArrowRight size={18} />
                                </button>
                              </>
                            ) : (
                              <span>
                                {wrongChoices.length
                                  ? "没关系，小耳朵再听一次，试试另一个朋友。"
                                  : "不用着急，想听几遍都可以。"}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      className="lesson-content"
                      role="tabpanel"
                      aria-label={
                        mode === "listen" ? "听一听动物发音" : "探索发音规律"
                      }
                    >
                      <div
                        className={`animal-scene scene-${animal.id}`}
                        style={
                          { "--animal-bg": animal.background } as CSSProperties
                        }
                      >
                        <div className="scene-topline">
                          <span className="animal-number">
                            ANIMAL FRIEND{" "}
                            {String(activeIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="scene-small-star">
                            <Star size={16} />
                          </span>
                        </div>
                        <div className="scene-sun" />
                        <div className="scene-hill hill-back" />
                        <div className="scene-hill hill-front" />
                        <SceneLeaves />
                        <div
                          className="speech-bubble"
                          key={`${animal.id}-bubble`}
                        >
                          {animal.greeting}
                          <span />
                        </div>
                        <div className="hero-animal" key={animal.id}>
                          <AnimalArt animal={animal.id} />
                        </div>
                        <button
                          className={`scene-sound ${playing ? "is-playing" : ""}`}
                          onClick={() => void play(animal.id)}
                          aria-label={`听${animal.name}的发音`}
                        >
                          <Volume2 size={23} />
                        </button>
                        <span className="scene-caption">
                          <span /> {animal.fact}
                        </span>
                      </div>
                      <div className="word-side" key={`${animal.id}-${mode}`}>
                        <div className="word-topline">
                          <span className="word-category">
                            MEET YOUR NEW FRIEND
                          </span>
                          <span className="word-index">
                            {String(activeIndex + 1).padStart(2, "0")}
                            <span> / 07</span>
                          </span>
                        </div>
                        <div
                          className={`word-title ${animal.name.length > 8 ? "long-word" : ""}`}
                        >
                          <h2 lang="en">{animal.name}</h2>
                          <span>{animal.chinese}</span>
                          {learned.includes(animal.id) && (
                            <span className="learned-pill">
                              <Check size={13} />
                              已认识
                            </span>
                          )}
                        </div>
                        <div className="phonetic">
                          <span>{animal.ipa}</span>
                          <span className="pronunciation-tag">美式发音</span>
                        </div>

                        {mode === "listen" ? (
                          <>
                            <div className="sound-prompt">
                              <span className="tiny-icon">
                                <Headphones size={18} />
                              </span>
                              <p>
                                先用小耳朵听，再用小嘴巴说。
                                <br />
                                <span>
                                  听听看，这个单词里藏着几个声音节拍？
                                </span>
                              </p>
                            </div>
                            <div className="listen-actions">
                              <button
                                className={`primary-button play-button ${playing ? "is-playing" : ""}`}
                                onClick={() => void play(animal.id)}
                              >
                                <Volume2 size={21} />
                                {playing ? "正在发音…" : "听一听，跟我读"}
                                <span className="audio-bars">
                                  <i />
                                  <i />
                                  <i />
                                  <i />
                                </span>
                              </button>
                              <button
                                className="slow-button"
                                onClick={() => void play(animal.id, true)}
                              >
                                <Turtle size={22} />
                                <span>慢一点</span>
                              </button>
                            </div>
                            <div className="rhythm-preview">
                              <span className="rhythm-label">声音小脚印</span>
                              <div>
                                {animal.parts.map((part, index) => (
                                  <span key={index}>
                                    <b
                                      className={`rhythm-part part-${index % 3}`}
                                    >
                                      {part.text}
                                    </b>
                                    {index < animal.parts.length - 1 && (
                                      <i>·</i>
                                    )}
                                  </span>
                                ))}
                              </div>
                              <span className="rhythm-hint">
                                {animal.id === "snake"
                                  ? "找找不发音的 e"
                                  : `${animal.parts.length} 个音节，拍拍手读一读`}
                              </span>
                            </div>
                            <button
                              className="next-step"
                              onClick={() => setMode("sounds")}
                            >
                              发现声音里的小秘密
                              <ArrowRight size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="parts-instruction">
                              <AudioLines size={17} />
                              点点声音块，发现字母里的秘密
                            </p>
                            <div
                              className={`sound-parts ${animal.parts.length > 3 ? "many-parts" : ""}`}
                            >
                              {animal.parts.map((part, index) => (
                                <button
                                  className={`sound-part part-${index % 3} ${partIndex === index ? "active-part" : ""} ${part.ipa === "静音" ? "silent-part" : ""}`}
                                  key={index}
                                  onClick={() => setPartIndex(index)}
                                  aria-pressed={partIndex === index}
                                >
                                  <strong>{part.text}</strong>
                                  <small>{part.ipa}</small>
                                </button>
                              ))}
                            </div>
                            <div className="sound-tip" aria-live="polite">
                              <Lightbulb size={19} />
                              <p>
                                <strong>
                                  {partIndex === null
                                    ? animal.ruleLabel
                                    : `${animal.parts[partIndex].text} 的声音秘密`}
                                </strong>
                                <span>
                                  {partIndex === null
                                    ? animal.rule
                                    : animal.parts[partIndex].tip}
                                </span>
                              </p>
                            </div>
                            <div className="sound-bottom">
                              <button
                                className="secondary-button"
                                onClick={() => void play(animal.id, true)}
                              >
                                <Volume2 size={18} />
                                慢速听整词
                              </button>
                              <button
                                className="primary-button"
                                onClick={finishAnimal}
                              >
                                <Check size={18} />
                                我会读啦
                                <ArrowRight size={18} />
                              </button>
                            </div>
                            <p className="sound-note">
                              {animal.id === "snake"
                                ? "这些是拼读声音块；snake 本身只有 1 个音节。"
                                : "按音节分块帮助记忆；音节里的字母要连起来听。"}
                            </p>
                          </>
                        )}
                        <div className="word-pagination">
                          <button
                            onClick={() =>
                              setActiveIndex((previous) => previous - 1)
                            }
                            disabled={activeIndex === 0}
                            aria-label="上一只动物"
                          >
                            <ChevronLeft size={19} />
                          </button>
                          <div className="pagination-dots">
                            {animals.map((item, index) => (
                              <button
                                key={item.id}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`查看${item.chinese}`}
                                aria-current={
                                  activeIndex === index ? "true" : undefined
                                }
                                className={
                                  activeIndex === index ? "current" : ""
                                }
                              />
                            ))}
                          </div>
                          <button
                            onClick={() =>
                              setActiveIndex((previous) => previous + 1)
                            }
                            disabled={activeIndex === animals.length - 1}
                            aria-label="下一只动物"
                          >
                            <ChevronRight size={19} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </AnimatedContent>

              <AnimatedContent
                distance={20}
                duration={0.6}
                delay={0.2}
                trigger="mount"
              >
                <section className="animal-collection" aria-label="选择动物">
                  <div className="collection-header">
                    <div>
                      <span className="section-kicker">
                        <Footprints size={17} /> YOUR SAFARI FRIENDS
                      </span>
                      <h2>
                        下一位，想认识谁？<span>7 位朋友，等你来发现</span>
                      </h2>
                    </div>
                    <span className="collection-hint">
                      点一个小伙伴，开始探索
                      <ArrowDown size={15} />
                    </span>
                  </div>
                  <div className="animal-grid">
                    {animals.map((item, index) => (
                      <button
                        key={item.id}
                        className={`animal-card ${activeIndex === index && mode !== "quiz" ? "active-card" : ""}`}
                        style={
                          {
                            "--animal-bg": item.background,
                            "--animal-color": item.color,
                          } as CSSProperties
                        }
                        onClick={() => chooseAnimal(index)}
                        aria-label={`学习${item.name}，${item.chinese}`}
                        aria-pressed={activeIndex === index && mode !== "quiz"}
                      >
                        <div className="animal-thumb">
                          <AnimalArt animal={item.id} />
                          {learned.includes(item.id) ? (
                            <span className="card-status collected-status">
                              <Check size={12} />
                            </span>
                          ) : (
                            <span className="card-number">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          )}
                        </div>
                        <strong lang="en">{item.name}</strong>
                        <span className="animal-chinese">
                          {item.chinese}
                          <span className="card-arrow">
                            <ArrowRight size={13} />
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              </AnimatedContent>
            </>
          )}

          <aside className="gentle-note">
            <span className="note-icon">
              <Heart size={19} />
            </span>
            <p>
              <strong>每个孩子，都有自己的学习节奏。</strong>{" "}
              不用一次记住所有单词，今天多听一次，就是一点小进步。
            </p>
            <span className="note-doodle">
              <Sprout size={28} />
            </span>
          </aside>
          {storageError && (
            <p className="storage-notice" role="status">
              浏览器暂时无法保存进度，这次探险仍然可以继续。
            </p>
          )}
          {audioError && (
            <div className="audio-error" role="alert">
              <Volume2 size={18} />
              {audioError}
              <button
                onClick={() =>
                  void play(mode === "quiz" ? quizAnimal.id : animal.id)
                }
              >
                再试一次
              </button>
            </div>
          )}
        </main>

        <footer className="site-footer">
          <span>
            <Sprout size={15} /> little steps, wild discoveries.
          </span>
          <span>
            用好奇心学习，用声音记住 <span className="footer-dot">·</span> Made
            for little explorers
          </span>
        </footer>
        {toast && (
          <div className="toast" role="status">
            <PawPrint size={20} />
            {toast}
          </div>
        )}

        {(helpOpen || resetOpen) && (
          <InfoDialog
            title={resetOpen ? "想重新开始这次探险吗？" : "让声音先走一步"}
            onClose={() => {
              setHelpOpen(false);
              setResetOpen(false);
            }}
          >
            {resetOpen ? (
              <>
                <p>
                  将清空这台设备上已收集的动物足迹，7 位动物朋友随时等你回来。
                </p>
                <div className="dialog-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setResetOpen(false)}
                  >
                    保留足迹
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => {
                      reset();
                      setResetOpen(false);
                      setActiveIndex(0);
                      openPage("explore");
                    }}
                  >
                    重新开始
                    <RotateCcw size={17} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  Little Safari
                  鼓励孩子先听、模仿、发现规律，再慢慢建立声音与字母的联系。每天认识一两位动物朋友就很好。
                </p>
                <div className="parent-steps">
                  <p>
                    <Ear size={22} />
                    <span>
                      <strong>先听整词</strong>
                      点小喇叭听发音，再用慢速播放跟读。
                    </span>
                  </p>
                  <p>
                    <AudioLines size={22} />
                    <span>
                      <strong>听节拍，找规律</strong>
                      音节分块帮助记忆，声音提示解释具体发音。snake
                      使用声音块，只有一个音节。
                    </span>
                  </p>
                  <p>
                    <Play size={22} />
                    <span>
                      <strong>用游戏代替考核</strong>
                      听音找动物，答错也可以继续尝试。
                    </span>
                  </p>
                </div>
                <div className="parent-note">
                  <Lightbulb size={20} />
                  <p>
                    这 7 个词的难度不同，并非都适合初阶自然拼读。giraffe、monkey
                    等词包含需要特别记忆的发音。这里结合音节、常见拼读规律和整词听读，不使用中文谐音。
                  </p>
                </div>
                <p className="privacy-note">
                  学习进度只保存在当前浏览器。点一下就能听整词发音，无需开启麦克风，也不会录制孩子的声音。
                </p>
                <button
                  className="primary-button dialog-start"
                  onClick={() => setHelpOpen(false)}
                >
                  一起开始探险
                  <ArrowRight size={18} />
                </button>
              </>
            )}
          </InfoDialog>
        )}
      </div>
    </ClickSpark>
  );
}

function InfoDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      className="info-dialog"
      ref={ref}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <button className="dialog-close" aria-label="关闭" onClick={onClose}>
        <X size={21} />
      </button>
      <span className="dialog-leaf">
        <Sprout size={28} />
      </span>
      <h2 id="dialog-title">{title}</h2>
      {children}
    </dialog>
  );
}
