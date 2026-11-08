import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowLeft,
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
  Layers3,
  Lightbulb,
  RotateCcw,
  Search,
  Sparkles,
  Sprout,
  Star,
  Turtle,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import App from "./App";
import WordArt from "./components/WordArt";
import CorrectCelebration from "./components/CorrectCelebration";
import LearningWord from "./components/LearningWord";
import SpotlightCard from "./components/reactbits/SpotlightCard";
import RewardButton from "./components/RewardButton";
import { useLearningMotion } from "./hooks/useLearningMotion";
import { originalCover, originalUnitArt } from "./data/originalArt";
import { mediaUrl } from "./data/media";
import BookActivities from "./components/BookActivities";
import BookLibrary from "./components/BookLibrary";
import BookMedia from "./components/BookMedia";
import FullscreenBook from "./components/FullscreenBook";
import AppUpdate from "./components/AppUpdate";
import { pauseOtherMedia } from "./data/media";
import SpellingInput from "./components/SpellingInput";
import {
  additionalBookSections,
  verifiedBookActivities,
  unitStartPages,
} from "./data/bookActivities";
import AnimatedContent from "./components/reactbits/AnimatedContent";
import ClickSpark from "./components/reactbits/ClickSpark";
import {
  allWordEntries,
  contentNote,
  courseEdition,
  courseSource,
  courseUnits,
  entryKey,
  makeCourseChoices,
  shuffled,
  spellingLetters,
  type CourseUnit,
  type WordEntry,
} from "./data/course";
import { useCourseAudio } from "./hooks/useCourseAudio";
import { useCourseProgress } from "./hooks/useCourseProgress";
import "./course.css";
import { matchesSpelling } from "./data/spelling";

type View = "map" | "lesson" | "review" | "passport" | "legacy" | "library";
type Activity = "book" | "words" | "sentences" | "listen" | "spell" | "media";
type Game = {
  questions: WordEntry[];
  round: number;
  options: WordEntry[];
  tiles: { id: number; letter: string }[];
  selected: number[];
  wrong: string[];
  correct: boolean;
  finished: boolean;
  firstTry: number;
  attempts: number;
};
const stages = [
  {
    id: 1,
    title: "第一程 · 认识身边",
    subtitle: "你好、课堂、玩具与家人",
    from: 1,
    to: 4,
  },
  {
    id: 2,
    title: "第二程 · 发现世界",
    subtitle: "宠物、身体、动物与衣服",
    from: 5,
    to: 8,
  },
  {
    id: 3,
    title: "第三程 · 快乐生活",
    subtitle: "运动、出行、房间与食物",
    from: 9,
    to: 12,
  },
];

function newRound(questions: WordEntry[], round = 0, firstTry = 0): Game {
  const question = questions[round];
  const pool = courseUnits
    .find((unit) => unit.id === question.unitId)!
    .words.map((word) => ({ unitId: question.unitId, word }));
  return {
    questions,
    round,
    firstTry,
    options: makeCourseChoices(question, pool),
    tiles: shuffled(
      spellingLetters(question.word.en).map((letter, id) => ({ letter, id })),
    ),
    selected: [],
    wrong: [],
    correct: false,
    finished: false,
    attempts: 0,
  };
}

export default function CourseApp() {
  const [view, setView] = useState<View>("map");
  const [readerPage, setReaderPage] = useState<number | null>(null);
  const [wordAnimationReplay, setWordAnimationReplay] = useState(0);
  const motion = useLearningMotion();
  const [unitId, setUnitId] = useState(1);
  const [bookGroup, setBookGroup] = useState("CLIL");
  const [wordIndex, setWordIndex] = useState(0);
  const [activity, setActivity] = useState<Activity>("book");
  const [showTranslation, setShowTranslation] = useState(false);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<"help" | "reset" | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [notice, setNotice] = useState("");
  const [typedSpelling, setTypedSpelling] = useState("");
  const [spellingHints, setSpellingHints] = useState(() => {
    try {
      return localStorage.getItem("kids-box-spelling-hints-v1") !== "off";
    } catch {
      return true;
    }
  });
  const top = useRef<HTMLElement>(null);
  const { progress, learn, incorrect, correct, visit, reset, storageError } =
    useCourseProgress();
  const audio = useCourseAudio();
  useEffect(() => {
    const onPlay = (event: Event) => {
      if (!(event.target instanceof HTMLMediaElement)) return;
      audio.stop();
      pauseOtherMedia(event.target);
    };
    document.addEventListener("play", onPlay, true);
    return () => document.removeEventListener("play", onPlay, true);
  }, [audio.stop]);
  const openReader = (page?: number) => {
    audio.stop();
    pauseOtherMedia();
    let next = page ?? 4;
    if (page === undefined) {
      try { const saved = Number(localStorage.getItem("kids-box-reader-page-v1")); if (Number.isInteger(saved) && saved >= 4 && saved <= 95) next = saved; } catch { /* Start at the first page. */ }
    }
    setReaderPage(next);
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.().catch(() => {});
  };
  const unit = courseUnits.find((unit) => unit.id === unitId)!;
  const word = unit.words[wordIndex];
  const currentEntry = { unitId, word };
  const learnedIn = (unit: CourseUnit) =>
    unit.words.filter((word) =>
      progress.learned.includes(entryKey({ unitId: unit.id, word })),
    ).length;
  const complete = courseUnits.filter(
    (unit) => learnedIn(unit) === unit.words.length,
  ).length;
  const mistakes = allWordEntries.filter((entry) =>
    progress.mistakes.includes(entryKey(entry)),
  );

  useEffect(() => {
    audio.stop();
    setShowTranslation(false);
  }, [view, unitId, wordIndex, activity, audio.stop]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const scrollTop = () => {
    top.current?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  };
  const navigate = (next: View) => {
    setView(next);
    setGame(null);
    scrollTop();
  };
  const openUnit = (id: number) => {
    setUnitId(id);
    setWordIndex(0);
    setActivity("book");
    setGame(null);
    setView("lesson");
    visit(id);
    scrollTop();
  };
  const startGame = (kind: "listen" | "spell", entries?: WordEntry[]) => {
    const pool =
      entries ?? unit.words.map((word) => ({ unitId: unit.id, word }));
    if (!pool.length) return;
    setActivity(kind);
    setGame(newRound(shuffled(pool)));
    setTypedSpelling("");
    audio.stop();
    scrollTop();
  };
  const answerGame = (entry: WordEntry) => {
    if (!game || game.correct) return;
    const question = game.questions[game.round];
    const isCorrect = entryKey(entry) === entryKey(question);
    if (isCorrect) {
      correct(question);
      void audio.play(question.word.en);
    } else incorrect(question);
    setGame({
      ...game,
      correct: isCorrect,
      wrong: isCorrect ? game.wrong : [...game.wrong, entryKey(entry)],
      attempts: game.attempts + 1,
      firstTry: game.firstTry + (isCorrect && game.attempts === 0 ? 1 : 0),
    });
  };
  const checkSpelling = () => {
    if (!game || game.correct) return;
    const question = game.questions[game.round];
    const selected = spellingHints
      ? game.selected
          .map((id) => game.tiles.find((tile) => tile.id === id)!.letter)
          .join("")
      : typedSpelling;
    const isCorrect = matchesSpelling(selected, question.word.en);
    if (isCorrect) {
      correct(question);
      void audio.play(question.word.en);
    } else incorrect(question);
    setGame({
      ...game,
      correct: isCorrect,
      wrong: isCorrect ? game.wrong : ["spelling"],
      attempts: game.attempts + 1,
      firstTry: game.firstTry + (isCorrect && game.attempts === 0 ? 1 : 0),
    });
  };
  const nextQuestion = () => {
    if (!game || !game.correct) return;
    audio.stop();
    setTypedSpelling("");
    setGame(
      game.round + 1 >= game.questions.length
        ? { ...game, finished: true }
        : newRound(game.questions, game.round + 1, game.firstTry),
    );
  };
  const markAndNext = () => {
    learn(currentEntry);
    if (wordIndex + 1 < unit.words.length) setWordIndex(wordIndex + 1);
    else {
      setNotice("这一单元的单词都认识啦，听音游戏再挑战一下！");
      startGame("listen");
    }
  };
  const themeStyle = (unit: CourseUnit) =>
    ({
      "--unit-color": unit.color,
      "--unit-bg": unit.background,
    }) as CSSProperties;

  if (view === "legacy")
    return (
      <>
        <div className="kb-legacy-bar">
          <button onClick={() => navigate("map")}>
            <ArrowLeft size={18} />
            返回整册课程
          </button>
          <span>动物拼读小站 · 原有进度保留</span>
        </div>
        <App />
      </>
    );

  const renderGame = () => {
    if (!game) return null;
    if (game.finished)
      return (
        <section className="kb-game-finish">
          {motion.canAnimate && <CorrectCelebration message="完成挑战！" />}
          <span className="kb-finish-star">
            <Star size={45} fill="currentColor" />
          </span>
          <span className="kb-eyebrow">LITTLE STEPS, BIG PROGRESS</span>
          <h2>这一段探险，完成啦！</h2>
          <p>
            完成 {game.questions.length} 道
            {activity === "spell" ? "拼写" : "听音"}练习，其中 {game.firstTry}{" "}
            道一次就答对。
          </p>
          <p className="kb-finish-note">多听一次、多试一次，都是进步。</p>
          <div className="kb-finish-friends">
            {game.questions.slice(0, 6).map((entry) => (
              <WordArt
                key={entryKey(entry)}
                id={entry.word.id}
                unitId={entry.unitId}
              />
            ))}
          </div>
          <div className="kb-button-row">
            <button
              className="kb-btn"
              onClick={() =>
                startGame(
                  activity === "spell" ? "spell" : "listen",
                  game.questions,
                )
              }
            >
              <RotateCcw size={18} />
              再玩一遍
            </button>
            <button
              className="kb-btn kb-btn-secondary"
              onClick={() => navigate("map")}
            >
              回到课程地图
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      );
    const question = game.questions[game.round];
    return (
      <section
        className="kb-game"
        data-correct={game.correct || undefined}
        aria-label={activity === "listen" ? "听音找朋友" : "字母拼拼乐"}
      >
        {game.correct && motion.canAnimate && <CorrectCelebration key={`${activity}:${game.round}:${entryKey(question)}`} />}
        <div className="kb-game-top">
          <span className="kb-eyebrow">
            {activity === "listen" ? "LISTEN & FIND" : "LETTERS & SOUNDS"}
          </span>
          <span>
            {game.round + 1} / {game.questions.length}
          </span>
        </div>
        <h2>
          {activity === "listen"
            ? "小耳朵，听见了谁？"
            : spellingHints
              ? "小字母，排排队。"
              : "听一听，自己拼出来。"}
        </h2>
        <p>
          {activity === "listen"
            ? "先听声音，再点选对应的图片和意思。"
            : spellingHints
              ? "先听一听，再把字母放进正确的位置。"
              : "没有字母提示，试着写出你听到的单词。"}
        </p>
        <button
          className={`kb-big-audio ${audio.playingText ? "is-playing" : ""}`}
          onClick={() => void audio.play(question.word.en)}
          aria-label="播放题目发音"
        >
          <Volume2 size={27} />
          {audio.playingText ? "仔细听…" : "再听一次"}
          <span className="kb-audio-waves">
            <i />
            <i />
            <i />
          </span>
        </button>
        {activity === "listen" ? (
          <div className="kb-choices">
            {game.options.map((option) => (
              <button
                key={entryKey(option)}
                onClick={() => answerGame(option)}
                disabled={game.correct || game.wrong.includes(entryKey(option))}
                className={`kb-choice ${game.correct && entryKey(option) === entryKey(question) ? "answer-right" : ""} ${game.wrong.includes(entryKey(option)) ? "answer-wrong" : ""}`}
                style={themeStyle(
                  courseUnits.find((unit) => unit.id === option.unitId)!,
                )}
                aria-label={`选择${option.word.zh}`}
              >
                <WordArt id={option.word.id} unitId={option.unitId} />
                <span>{option.word.zh}</span>
                {game.correct && entryKey(option) === entryKey(question) && (
                  <strong>
                    {option.word.en}
                    <Check size={18} />
                  </strong>
                )}
                {game.wrong.includes(entryKey(option)) && (
                  <small>再听听看</small>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="kb-spelling">
            <label className="kb-spelling-toggle">
              <span>
                字母提示
                <small>{spellingHints ? "选字母拼写" : "自己输入单词"}</small>
              </span>
              <input
                type="checkbox"
                role="switch"
                aria-label="字母提示"
                checked={spellingHints}
                disabled={game.correct}
                onChange={(event) => {
                  const enabled = event.currentTarget.checked;
                  setSpellingHints(enabled);
                  setTypedSpelling("");
                  setGame({ ...game, selected: [], wrong: [] });
                  try {
                    localStorage.setItem(
                      "kids-box-spelling-hints-v1",
                      enabled ? "on" : "off",
                    );
                  } catch {
                    setNotice("切换成功，但这个设置暂时无法保存。");
                  }
                }}
              />
            </label>
            <div className="kb-spell-clue">
              <WordArt id={question.word.id} unitId={question.unitId} />
              <strong>{question.word.zh}</strong>
            </div>
            {spellingHints ? (
              <>
                <div className="kb-spell-slots" aria-label="已选字母">
                  {spellingLetters(question.word.en).map((_, index) => (
                    <button
                      key={index}
                      disabled={
                        game.correct || game.selected[index] === undefined
                      }
                      aria-label={
                        game.selected[index] === undefined
                          ? `第 ${index + 1} 格`
                          : `移除第 ${index + 1} 个字母`
                      }
                      onClick={() =>
                        setGame({
                          ...game,
                          selected: game.selected.filter((_, i) => i !== index),
                          wrong: [],
                        })
                      }
                    >
                      {game.selected[index] === undefined
                        ? ""
                        : game.tiles.find(
                            (tile) => tile.id === game.selected[index],
                          )!.letter}
                    </button>
                  ))}
                </div>
                <div className="kb-letter-bank" aria-label="可选字母">
                  {game.tiles.map((tile) => (
                    <button
                      key={tile.id}
                      disabled={game.correct || game.selected.includes(tile.id)}
                      onClick={() =>
                        setGame({
                          ...game,
                          selected: [...game.selected, tile.id],
                          wrong: [],
                        })
                      }
                      aria-label={`字母 ${tile.letter}`}
                    >
                      {tile.letter}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <SpellingInput
                value={typedSpelling}
                disabled={game.correct}
                onSubmit={checkSpelling}
                onChange={(value) => {
                  setTypedSpelling(value);
                  if (game.wrong.length) setGame({ ...game, wrong: [] });
                }}
              />
            )}
            <div className="kb-button-row">
              <button
                className="kb-btn kb-btn-secondary"
                disabled={
                  (spellingHints
                    ? !game.selected.length
                    : !typedSpelling.length) || game.correct
                }
                onClick={() => {
                  setGame({ ...game, selected: [], wrong: [] });
                  setTypedSpelling("");
                }}
              >
                <RotateCcw size={17} />
                {spellingHints ? "重新排列" : "清空重写"}
              </button>
              <button
                className="kb-btn"
                disabled={
                  (spellingHints
                    ? game.selected.length !== game.tiles.length
                    : !typedSpelling.trim()) || game.correct
                }
                onClick={checkSpelling}
              >
                <Check size={18} />
                {spellingHints ? "拼好啦" : "检查答案"}
              </button>
            </div>
            <p className="kb-spell-hint">
              {!spellingHints
                ? "可以直接输入，不区分大小写。空格和连字符可省略。"
                : question.word.en.includes(" ") ||
                    question.word.en.includes("-")
                  ? "这里只拼字母，空格和连字符不用放进格子。"
                  : "点一下已放好的字母，就能把它拿回来。"}
            </p>
          </div>
        )}
        <div
          className={`kb-game-feedback ${game.correct ? "positive" : ""}`}
          aria-live="polite"
        >
          {game.correct ? (
            <>
              <span>
                <Check size={20} />
                答对啦！{question.word.en} · {question.word.zh}
              </span>
              <RewardButton animated={motion.canAnimate} className="kb-btn kb-reward-next" onClick={nextQuestion}>
                {game.round === game.questions.length - 1
                  ? "完成挑战"
                  : "下一题"}
                <ArrowRight size={18} />
              </RewardButton>
            </>
          ) : (
            <span>
              {game.wrong.length
                ? "没关系，再听一次，换个办法试试看。"
                : "不计时，不着急。想听几遍都可以。"}
            </span>
          )}
        </div>
      </section>
    );
  };

  return (
    <ClickSpark
      sparkColor={["#d2ad58", "#90a577", "#c49bba"]}
      sparkSize={7}
      sparkRadius={22}
      sparkCount={6}
      shape="star"
      duration={420}
      disabled={!motion.canAnimate}
      style={{ overflowX: "clip" }}
    >
      <div className="kb-shell" data-motion={motion.canAnimate ? "on" : "off"}>
        <a className="skip-link" href="#course-main">
          跳到学习内容
        </a>
        <header className="kb-header">
          <button
            className="kb-brand"
            onClick={() => navigate("map")}
            aria-label="Kid's Box 课程首页"
          >
            <span>
              <Sprout size={28} />
            </span>
            <div>
              little learners<span>.</span>
              <small>Kid’s Box · 第 1 册配套练习</small>
            </div>
          </button>
          <nav aria-label="课程导航">
            <button onClick={() => openReader()}><BookOpen size={18} /><span>课本点读</span></button>
            <button
              aria-current={
                view === "map" || view === "lesson" ? "page" : undefined
              }
              onClick={() => navigate("map")}
            >
              <Compass size={18} />
              <span>课程地图</span>
            </button>
            <button
              aria-current={view === "review" ? "page" : undefined}
              onClick={() => navigate("review")}
            >
              <Layers3 size={18} />
              <span>错词背包</span>
              {mistakes.length > 0 && <b>{mistakes.length}</b>}
            </button>
            <button
              aria-current={view === "passport" ? "page" : undefined}
              onClick={() => navigate("passport")}
            >
              <Footprints size={18} />
              <span>我的足迹</span>
            </button>
          </nav>
          <button
            className="kb-help"
            aria-label="家长指南"
            onClick={() => setDialog("help")}
          >
            <HelpCircle size={21} />
            <span>给家长的话</span>
          </button>
        </header>
        <main ref={top} id="course-main">
          {view === "map" && (
            <>
              <AnimatedContent trigger="mount" distance={18} duration={0.5}>
                <section className="kb-welcome">
                  <div>
                    <span className="kb-eyebrow">
                      <span /> A WHOLE BOOK OF LITTLE DISCOVERIES
                    </span>
                    <h1>
                      跟着课本，<span>一起听、说、唱。</span>
                    </h1>
                    <p>课本活动与课后练习，一步一步，按你手里的教材来。</p>
                    <div className="kb-welcome-tags">
                      <span>
                        <BookOpen size={14} />
                        第二版 · 第 1 册
                      </span>
                      <span>
                        <Headphones size={14} />
                        12 个主题单元
                      </span>
                      <span>
                        <Heart size={14} />
                        按自己的节奏学
                      </span>
                    </div>
                    <button
                      className="kb-btn"
                      onClick={() => openUnit(progress.lastUnit)}
                    >
                      {progress.learned.length
                        ? "继续我的探险"
                        : "从 Hello 开始"}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                  <div className="kb-book-scene" aria-hidden="true">
                    <div className="kb-orbit orbit-one" />
                    <div className="kb-orbit orbit-two" />
                    <span className="kb-scene-leaf">
                      <Sprout size={55} />
                    </span>
                    <div className="kb-book kb-original-cover">
                      <img src={mediaUrl(originalCover.file)} width={originalCover.width} height={originalCover.height} alt="" decoding="async" />
                    </div>
                    <span className="kb-floating-note note-hello">
                      Hello, explorer!
                    </span>
                    <span className="kb-floating-note note-star">
                      <Star size={17} fill="currentColor" />
                      little steps, big smiles
                    </span>
                  </div>
                </section>
              </AnimatedContent>
              <section className="kb-overview" aria-label="整册学习进度">
                <div>
                  <span className="kb-stat-icon">
                    <Footprints size={23} />
                  </span>
                  <div>
                    <strong>
                      {progress.learned.length}
                      <small> / {allWordEntries.length}</small>
                    </strong>
                    <span>认识的词语</span>
                  </div>
                </div>
                <div>
                  <span className="kb-stat-icon">
                    <BookOpen size={23} />
                  </span>
                  <div>
                    <strong>
                      {complete}
                      <small> / 12</small>
                    </strong>
                    <span>词语练习完成单元</span>
                  </div>
                </div>
                <div className="kb-overview-progress">
                  <div>
                    <span>一整册的小脚印</span>
                    <strong>
                      {Math.round(
                        (progress.learned.length / allWordEntries.length) * 100,
                      )}
                      %
                    </strong>
                  </div>
                  <Progress
                    value={progress.learned.length}
                    max={allWordEntries.length}
                  />
                  <small>每认识一个新词，都算一点新进步。</small>
                </div>
                <span className="kb-overview-doodle">
                  <Sprout size={38} />
                </span>
              </section>
              <div className="kb-map-heading">
                <div>
                  <span className="kb-eyebrow">YOUR LEARNING MAP</span>
                  <h2>今天，去哪里发现？</h2>
                </div>
                <label className="kb-search">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="找单元或单词"
                    aria-label="搜索单元或单词"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} aria-label="清空搜索">
                      <X size={16} />
                    </button>
                  )}
                </label>
              </div>
              {stages.map((stage) => {
                const units = courseUnits.filter(
                  (unit) =>
                    unit.id >= stage.from &&
                    unit.id <= stage.to &&
                    (!query ||
                      `${unit.title} ${unit.zh} ${unit.words.map((word) => `${word.en} ${word.zh}`).join(" ")}`
                        .toLowerCase()
                        .includes(query.trim().toLowerCase())),
                );
                return (
                  units.length > 0 && (
                    <section className="kb-stage" key={stage.id}>
                      <div className="kb-stage-heading">
                        <span>{String(stage.id).padStart(2, "0")}</span>
                        <h3>{stage.title}</h3>
                        <p>{stage.subtitle}</p>
                        <i />
                      </div>
                      <div className="kb-unit-grid">
                        {units.map((unit) => {
                          const count = learnedIn(unit);
                          return (
                            <button
                              key={unit.id}
                              className={`kb-unit-card ${count === unit.words.length ? "unit-complete" : ""}`}
                              style={themeStyle(unit)}
                              onClick={() => openUnit(unit.id)}
                              aria-label={`进入单元 ${unit.id} ${unit.title} ${unit.zh}`}
                            >
                              <div className="kb-unit-top">
                                <span>
                                  UNIT {String(unit.id).padStart(2, "0")}
                                </span>
                                <span>
                                  {count === unit.words.length ? (
                                    <Check size={17} />
                                  ) : (
                                    <ArrowRight size={17} />
                                  )}
                                </span>
                              </div>
                              <img className="kb-unit-picture" src={mediaUrl(originalUnitArt[unit.id].file)} width={originalUnitArt[unit.id].width} height={originalUnitArt[unit.id].height} alt="" loading="lazy" decoding="async" />
                              <h3>{unit.title}</h3>
                              <strong>{unit.zh}</strong>
                              <p>{unit.description}</p>
                              <div className="kb-unit-bottom">
                                <span>
                                  {verifiedBookActivities[unit.id]
                                    ? "12 项课本活动已核对"
                                    : "课本活动待核对"}
                                </span>
                                <span>
                                  词语 {count}/{unit.words.length}
                                </span>
                              </div>
                              <Progress value={count} max={unit.words.length} />
                            </button>
                          );
                        })}
                      </div>
                      <button
                        className="kb-review-banner"
                        onClick={() => {
                          setView("review");
                          setActivity("listen");
                          setGame(
                            newRound(
                              shuffled(
                                allWordEntries.filter(
                                  (entry) =>
                                    entry.unitId >= stage.from &&
                                    entry.unitId <= stage.to,
                                ),
                              ).slice(0, 12),
                            ),
                          );
                          scrollTop();
                        }}
                      >
                        <span>
                          <Sparkles size={22} />
                        </span>
                        <div>
                          <strong>
                            第 {stage.from}–{stage.to} 单元 · 小小复习站
                          </strong>
                          <p>把几个单元的朋友放在一起，再用耳朵认识一次。</p>
                        </div>
                        <span className="kb-review-banner-action">
                          去挑战
                          <ArrowRight size={17} />
                        </span>
                      </button>
                    </section>
                  )
                );
              })}
              {query &&
                !courseUnits.some((unit) =>
                  `${unit.title} ${unit.zh} ${unit.words.map((word) => `${word.en} ${word.zh}`).join(" ")}`
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()),
                ) && (
                  <div className="kb-empty">
                    <Search size={35} />
                    <h3>暂时没有找到这个词</h3>
                    <p>试试中文意思、英文单词或单元名称。</p>
                  </div>
                )}
              <section className="kb-additional-sections">
                <h2>课本不止词语，还有这些学习板块。</h2>
                <div className="kb-additional-section-grid">
                  {additionalBookSections.map((section) => (
                    <button
                      key={section.en}
                      onClick={() => {
                        setBookGroup(section.en);
                        navigate("library");
                      }}
                    >
                      <strong>{section.title}</strong>
                      <span>{section.en}</span>
                      <p>{section.description}</p>
                      <small>打开原书活动 →</small>
                    </button>
                  ))}
                </div>
              </section>
              <aside className="kb-source-note">
                <BookOpen size={20} />
                <div>
                  <strong>按课本活动学习，配套练习帮助巩固。</strong>
                  <p>
                    已按你提供的电子书核对全部 12 个单元的 144
                    项活动，并整理跨学科、价值观、复习和语法参考页。原版音频、视频和闪卡已内置，可直接打开课本点读。
                  </p>
                  <a href={courseSource} target="_blank" rel="noreferrer">
                    查看第二版单元目录
                    <ArrowRight size={13} />
                  </a>
                  <a
                    href="https://kb.unischool.cn/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    外研社官方样张与资源
                    <ArrowRight size={13} />
                  </a>
                </div>
              </aside>
            </>
          )}

          {view === "library" && (
            <BookLibrary
              key={bookGroup}
              group={bookGroup}
              audio={audio}
              onBack={() => navigate("map")}
            />
          )}

          {view === "lesson" && (
            <>
              <div className="kb-lesson-breadcrumb">
                <button onClick={() => navigate("map")}>
                  <ArrowLeft size={17} />
                  课程地图
                </button>
                <span>/</span>
                <span>UNIT {String(unit.id).padStart(2, "0")}</span>
                <div>
                  <button
                    disabled={unitId === 1}
                    onClick={() => openUnit(unitId - 1)}
                    aria-label="上一个单元"
                  >
                    <ChevronLeft size={19} />
                  </button>
                  <button
                    disabled={unitId === 12}
                    onClick={() => openUnit(unitId + 1)}
                    aria-label="下一个单元"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>
              <section className="kb-lesson-heading" style={themeStyle(unit)}>
                <span className="kb-lesson-icon">
                  <img src={mediaUrl(originalUnitArt[unit.id].file)} width={originalUnitArt[unit.id].width} height={originalUnitArt[unit.id].height} alt="" />
                </span>
                <div>
                  <span className="kb-eyebrow">
                    UNIT {String(unit.id).padStart(2, "0")} · BOOK ONE
                  </span>
                  <h1>
                    {unit.title}
                    <span>{unit.zh}</span>
                  </h1>
                  <p>{unit.description}</p>
                </div>
                <div className="kb-lesson-progress">
                  <strong>
                    {learnedIn(unit)}
                    <span> / {unit.words.length}</span>
                  </strong>
                  <small>小小脚印</small>
                  <Progress value={learnedIn(unit)} max={unit.words.length} />
                </div>
              </section>
              <div
                className="kb-activity-tabs"
                role="group"
                aria-label="选择学习活动"
              >
                {(
                  [
                    { id: "book", title: "课本活动", Icon: BookOpen },
                    { id: "media", title: "视频与闪卡", Icon: Layers3 },
                    { id: "words", title: "词语探险", Icon: Ear },
                    { id: "sentences", title: "情景说一说", Icon: AudioLines },
                    { id: "listen", title: "听音找朋友", Icon: Headphones },
                    { id: "spell", title: "字母拼拼乐", Icon: Sparkles },
                  ] as const
                ).map((tab, index) => (
                  <button
                    key={tab.id}
                    aria-pressed={activity === tab.id}
                    onClick={() => {
                      if (tab.id === "listen" || tab.id === "spell")
                        startGame(tab.id);
                      else {
                        setActivity(tab.id);
                        setGame(null);
                      }
                    }}
                  >
                    <span>0{index + 1}</span>
                    <tab.Icon size={18} />
                    {tab.title}
                  </button>
                ))}
              </div>
              <button className="kb-btn kb-btn-secondary" onClick={() => openReader(unitStartPages[unit.id - 1])}><BookOpen size={18} />全屏课本点读</button>
              {activity === "book" ? (
                <BookActivities
                  key={unit.id}
                  unitId={unit.id}
                  audio={audio}
                  onPractice={() => setActivity("words")}
                />
              ) : activity === "media" ? (
                <BookMedia key={unit.id} unitId={unit.id} audio={audio} />
              ) : activity === "listen" || activity === "spell" ? (
                renderGame()
              ) : activity === "sentences" ? (
                <section className="kb-sentences">
                  <div className="kb-section-intro">
                    <span className="kb-eyebrow">SAY IT IN YOUR OWN WAY</span>
                    <h2>把单词，放进生活里。</h2>
                    <p>听一句，跟着说一句。把人物和物品换成你自己的。</p>
                    <button
                      className="kb-btn kb-btn-secondary"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      {showTranslation ? "藏起中文提示" : "看看中文提示"}
                    </button>
                  </div>
                  {unit.sentences.map((sentence, index) => (
                    <article
                      className="kb-sentence-card"
                      key={sentence.en}
                      style={themeStyle(unit)}
                    >
                      <span className="kb-sentence-number">0{index + 1}</span>
                      <div>
                        <h3 lang="en">{sentence.en}</h3>
                        {showTranslation && (
                          <p className="kb-sentence-zh">{sentence.zh}</p>
                        )}
                        <p className="kb-sentence-tip">
                          <Lightbulb size={16} />
                          {sentence.tip}
                        </p>
                        <div className="kb-button-row">
                          <button
                            className="kb-btn"
                            onClick={() => void audio.play(sentence.en)}
                          >
                            <Volume2 size={18} />
                            {audio.playingText === sentence.en
                              ? "仔细听…"
                              : "听一句，跟我说"}
                          </button>
                          <button
                            className="kb-btn kb-btn-secondary"
                            onClick={() => void audio.play(sentence.en, true)}
                          >
                            <Turtle size={18} />
                            慢一点
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>
              ) : (
                <>
                  <section
                    className="kb-word-lesson"
                    style={themeStyle(unit)}
                    key={`${unit.id}-${word.id}`}
                  >
                    <SpotlightCard className="kb-word-scene" theme="light" spotlightColor={unit.color} intensity={motion.canAnimate ? 0.24 : 0} borderGlow={motion.canAnimate ? 0.7 : 0} proximity={0} spotlightSize={180} style={{ background: unit.background }}>
                      <span className="kb-eyebrow">A NEW LITTLE DISCOVERY</span>
                      <span className="kb-word-scene-spark">
                        <Sparkles size={26} />
                      </span>
                      <WordArt id={word.id} unitId={unit.id} />
                      <span className="kb-word-scene-caption">
                        看一看，听一听，再说一说。
                      </span>
                      <button
                        onClick={() => void audio.play(word.en)}
                        aria-label={`播放 ${word.en} 发音`}
                      >
                        <Volume2 size={25} />
                      </button>
                    </SpotlightCard>
                    <div className="kb-word-detail">
                      <div className="kb-word-topline">
                        <span>
                          WORD {String(wordIndex + 1).padStart(2, "0")}
                        </span>
                        <span>
                          {wordIndex + 1} / {unit.words.length}
                        </span>
                      </div>
                      <LearningWord text={word.en} animated={motion.canAnimate} color={unit.color} replay={wordAnimationReplay} onRead={() => void audio.play(word.en)} />
                      <div className="kb-motion-tools">
                        <button disabled={!motion.canAnimate} onClick={() => { setWordAnimationReplay((value) => value + 1); void audio.play(word.en); }}><Sparkles size={16} />再看一次</button>
                        <button aria-pressed={motion.enabled} onClick={motion.toggle}>动态效果{motion.enabled ? "开" : "关"}</button>
                      </div>
                      <p
                        className="kb-word-ipa"
                        aria-label={`英式音标 /${word.ipa}/`}
                      >
                        /{word.ipa}/
                      </p>
                      <div className="kb-word-translation">
                        <span>{word.zh}</span>
                        {progress.learned.includes(entryKey(currentEntry)) && (
                          <small>
                            <Check size={13} />
                            已认识
                          </small>
                        )}
                        <span className="kb-voice-tag">英式发音</span>
                      </div>
                      <div className="kb-button-row">
                        <button
                          className="kb-btn"
                          onClick={() => void audio.play(word.en)}
                        >
                          <Volume2 size={21} />
                          {audio.playingText === word.en
                            ? "正在发音…"
                            : "听一听，跟我读"}
                          <span className="kb-audio-waves">
                            <i />
                            <i />
                            <i />
                          </span>
                        </button>
                        <button
                          className="kb-btn kb-btn-secondary"
                          onClick={() => void audio.play(word.en, true)}
                        >
                          <Turtle size={20} />
                          慢一点
                        </button>
                      </div>
                      <div className="kb-chunk-heading">
                        <AudioLines size={16} />
                        {word.chunkType === "音节"
                          ? "拍拍手，听声音节拍"
                          : word.chunkType === "整词"
                            ? "特别的词，一起听记"
                            : "声音小搭档"}
                        <span>{word.chunkType}</span>
                      </div>
                      <div className="kb-word-chunks">
                        {word.chunks.map((chunk, index) =>
                          chunk === " " || chunk === "-" ? (
                            <span key={index} className="kb-chunk-divider">
                              {chunk === " " ? "·" : chunk}
                            </span>
                          ) : (
                            <button
                              key={index}
                              className={
                                word.sounds[index] ? "" : "kb-silent-chunk"
                              }
                              aria-label={
                                word.sounds[index]
                                  ? `播放 ${word.en} 中 ${chunk} 的读音 /${word.sounds[index]}/`
                                  : `${chunk} 在 ${word.en} 中不发音`
                              }
                              aria-pressed={
                                audio.playingText === `${word.id}:${index}`
                              }
                              onClick={() => {
                                if (word.sounds[index])
                                  void audio.playSound(
                                    word.sounds[index],
                                    `${word.id}:${index}`,
                                  );
                                else {
                                  audio.stop();
                                  setNotice(
                                    `${chunk} 在 ${word.en} 中不发音。`,
                                  );
                                }
                              }}
                            >
                              <strong>{chunk}</strong>
                              <small>
                                {word.sounds[index]
                                  ? `/${word.sounds[index]}/`
                                  : "不发音"}
                              </small>
                              {word.sounds[index] ? (
                                <Volume2 size={13} aria-hidden="true" />
                              ) : (
                                <VolumeX size={13} aria-hidden="true" />
                              )}
                            </button>
                          ),
                        )}
                      </div>
                      <button
                        className="kb-btn kb-blend-button"
                        onClick={() =>
                          audio.blending ? audio.stop() : audio.blend(word)
                        }
                        aria-label={
                          audio.blending ? "停止连读" : "分块后连读完整单词"
                        }
                      >
                        <Volume2 size={19} />
                        {audio.blending ? "正在连读 · 点击停止" : "连起来读"}
                        <ArrowRight size={17} />
                      </button>
                      <div className="kb-word-tip">
                        <Lightbulb size={20} />
                        <p>{word.tip}</p>
                      </div>
                      <p className="kb-chunk-note">
                        点击分块听读音，再连起来听完整单词。分块数不一定等于音节数；分块声音为合成示范。
                      </p>
                      <RewardButton animated={motion.canAnimate}
                        className="kb-btn kb-learn-next"
                        onClick={markAndNext}
                      >
                        <Check size={19} />
                        {progress.learned.includes(entryKey(currentEntry))
                          ? "复习好啦，继续"
                          : "我认识它啦"}
                        <ArrowRight size={18} />
                      </RewardButton>
                      <div className="kb-word-pager">
                        <button
                          disabled={wordIndex === 0}
                          onClick={() => setWordIndex(wordIndex - 1)}
                          aria-label="上一个词语"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <Progress
                          value={wordIndex + 1}
                          max={unit.words.length}
                        />
                        <button
                          disabled={wordIndex === unit.words.length - 1}
                          onClick={() => setWordIndex(wordIndex + 1)}
                          aria-label="下一个词语"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </section>
                  <section className="kb-unit-words">
                    <div className="kb-small-section-heading">
                      <h2>这一单元的小伙伴</h2>
                      <span>点选一个词语，慢慢认识它</span>
                    </div>
                    <div className="kb-mini-word-grid">
                      {unit.words.map((item, index) => (
                        <button
                          key={item.id}
                          aria-pressed={wordIndex === index}
                          onClick={() => setWordIndex(index)}
                          style={themeStyle(unit)}
                          aria-label={`学习 ${item.en} ${item.zh}`}
                        >
                          <WordArt id={item.id} unitId={unit.id} />
                          <strong lang="en">{item.en}</strong>
                          <span>{item.zh}</span>
                          {progress.learned.includes(
                            entryKey({ unitId: unit.id, word: item }),
                          ) && (
                            <i>
                              <Check size={12} />
                            </i>
                          )}
                        </button>
                      ))}
                    </div>
                  </section>
                  {unit.id === 7 && (
                    <button
                      className="kb-legacy-link"
                      onClick={() => navigate("legacy")}
                    >
                      <Footprints size={20} />
                      <span>
                        <strong>想去原来的动物拼读小站？</strong>
                        <small>7 位动物朋友和之前的足迹都还在。</small>
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {view === "review" && (
            <>
              <PageHeading
                eyebrow="A LITTLE PRACTICE, A LITTLE PROGRESS"
                title="再见面，就更熟悉一点。"
                description="答错过的词语住在这里。再认真听一次，答对后它就会离开错词背包。"
              />
              {game ? (
                renderGame()
              ) : mistakes.length ? (
                <>
                  <div className="kb-review-actions">
                    <span>
                      <Layers3 size={20} />
                      {mistakes.length} 个词语等你再认识
                    </span>
                    <div className="kb-button-row">
                      <button
                        className="kb-btn"
                        onClick={() => startGame("listen", mistakes)}
                      >
                        <Headphones size={18} />
                        听音复习
                      </button>
                      <button
                        className="kb-btn kb-btn-secondary"
                        onClick={() => startGame("spell", mistakes)}
                      >
                        <Sparkles size={18} />
                        拼写复习
                      </button>
                    </div>
                  </div>
                  <div className="kb-mistake-list">
                    {mistakes.map((entry) => (
                      <button
                        key={entryKey(entry)}
                        onClick={() => {
                          openUnit(entry.unitId);
                          setWordIndex(
                            courseUnits
                              .find((unit) => unit.id === entry.unitId)!
                              .words.findIndex(
                                (word) => word.id === entry.word.id,
                              ),
                          );
                        }}
                        style={themeStyle(
                          courseUnits.find((unit) => unit.id === entry.unitId)!,
                        )}
                      >
                        <WordArt id={entry.word.id} unitId={entry.unitId} />
                        <div>
                          <strong>{entry.word.en}</strong>
                          <span>{entry.word.zh}</span>
                          <small>Unit {entry.unitId}</small>
                        </div>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="kb-empty">
                  <span>
                    <Sprout size={45} />
                  </span>
                  <h2>背包轻轻的，真好。</h2>
                  <p>
                    遇到需要再练习的词语，会自动收在这里。
                    <br />
                    也可以主动挑战整册的听音游戏。
                  </p>
                  <button
                    className="kb-btn"
                    onClick={() =>
                      startGame("listen", shuffled(allWordEntries).slice(0, 12))
                    }
                  >
                    随机听音挑战
                    <Sparkles size={18} />
                  </button>
                </div>
              )}
              {game && (
                <button
                  className="kb-text-button kb-return-review"
                  onClick={() => setGame(null)}
                >
                  <ArrowLeft size={17} />
                  返回错词背包
                </button>
              )}
            </>
          )}

          {view === "passport" && (
            <>
              <PageHeading
                eyebrow="MY BOOK OF LITTLE DISCOVERIES"
                title="每一枚足迹，都算数。"
                description={`已经认识 ${progress.learned.length} 个词语，走过 ${complete} 个完整单元。`}
              />
              <section className="kb-passport-grid">
                {courseUnits.map((unit) => {
                  const count = learnedIn(unit);
                  return (
                    <button
                      key={unit.id}
                      className={
                        count === unit.words.length ? "stamp-done" : ""
                      }
                      onClick={() => openUnit(unit.id)}
                      style={themeStyle(unit)}
                    >
                      <span className="kb-stamp">
                        <img src={mediaUrl(originalUnitArt[unit.id].file)} width={originalUnitArt[unit.id].width} height={originalUnitArt[unit.id].height} alt="" loading="lazy" />
                        {count === unit.words.length && (
                          <i>
                            <Check size={15} />
                          </i>
                        )}
                      </span>
                      <small>UNIT {String(unit.id).padStart(2, "0")}</small>
                      <strong>{unit.title}</strong>
                      <span>{unit.zh}</span>
                      <Progress value={count} max={unit.words.length} />
                      <p>
                        {count}/{unit.words.length} 个词语
                      </p>
                    </button>
                  );
                })}
              </section>
              <div className="kb-passport-footer">
                <p>
                  <Heart size={17} />
                  不用和别人比，今天比昨天多认识一点就很好。
                </p>
                <button
                  className="kb-text-button"
                  onClick={() => setDialog("reset")}
                >
                  <RotateCcw size={16} />
                  重置词语练习进度
                </button>
              </div>
            </>
          )}
          <aside className="kb-gentle-note">
            <Heart size={19} />
            <p>
              <strong>小小的进步，也值得被看见。</strong>{" "}
              每天听一点，不用一次学完整本。
            </p>
            <Sprout size={26} />
          </aside>
          {storageError && (
            <p className="kb-storage-error" role="status">
              当前浏览器无法保存进度，仍然可以继续学习。
            </p>
          )}
        </main>
        <footer className="kb-footer">
          <span>
            <Sprout size={15} />
            little steps, wild discoveries.
          </span>
          <span>{courseEdition} · 原创配套练习 · 非出版社官方应用</span>
        </footer>
        {notice && (
          <div className="toast" role="status">
            <Check size={20} />
            {notice}
          </div>
        )}
        {audio.error && (
          <div className="kb-audio-error" role="alert">
            <Volume2 size={18} />
            {audio.error}
            <button onClick={audio.retry}>重试</button>
          </div>
        )}
        {dialog && (
          <CourseDialog
            title={
              dialog === "help"
                ? "陪孩子，听见学习的声音。"
                : "重置本册词语练习进度？"
            }
            close={() => setDialog(null)}
          >
            {dialog === "reset" ? (
              <>
                <p>
                  将清空本册的词语足迹和错词背包。课本活动记录、已添加的教材资源和原动物小站的旧进度会保留。
                </p>
                <div className="kb-button-row">
                  <button
                    className="kb-btn kb-btn-secondary"
                    onClick={() => setDialog(null)}
                  >
                    保留足迹
                  </button>
                  <button
                    className="kb-btn"
                    onClick={() => {
                      reset();
                      setDialog(null);
                      navigate("map");
                      setNotice("新的一次探险开始啦。");
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
                  这是一份跟着第 1 册主题走的配套练习。可以自由选择单元，每次
                  5–10 分钟就很好。
                </p>
                <p>
                  「课本点读」全屏显示原书页面，点蓝色 CD 图标听原版录音。单元内可查看视频、歌曲伴奏和原版闪卡。跨学科、价值观、复习和语法参考在课程地图底部。
                </p>
                <div className="kb-parent-steps">
                  <p>
                    <Ear size={23} />
                    <span>
                      <strong>先听声音，再看字母</strong>
                      完整听读、慢速模仿，再看拼读搭档。特殊读音会单独提醒。
                    </span>
                  </p>
                  <p>
                    <Sparkles size={23} />
                    <span>
                      <strong>用游戏巩固，不用催着背</strong>
                      听音和拼写游戏不计时。错了可以再试，词语会放进复习背包。
                    </span>
                  </p>
                  <p>
                    <BookOpen size={23} />
                    <span>
                      <strong>和家里的教材一起学</strong>
                      {contentNote}
                    </span>
                  </p>
                </div>
                <div className="kb-parent-resources">
                  <a
                    href="https://kb.unischool.cn/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    外研社官方样张与配套资源
                    <ArrowRight size={15} />
                  </a>
                  <a href={courseSource} target="_blank" rel="noreferrer">
                    核对第二版第 1 册单元目录
                    <ArrowRight size={15} />
                  </a>
                </div>
                <p className="kb-parent-small">
                  词语音频为词典英式发音，情景句为英式合成语音；都随应用打包。网页版需要联网加载资源，安卓安装包可离线使用。学习进度只保存在当前设备，不使用麦克风。
                </p>
                <AppUpdate />
                <button className="kb-btn" onClick={() => setDialog(null)}>
                  一起开始探险
                  <ArrowRight size={18} />
                </button>
              </>
            )}
          </CourseDialog>
        )}
        {readerPage !== null && <FullscreenBook initialPage={readerPage} audio={audio} onClose={() => setReaderPage(null)} />}
      </div>
    </ClickSpark>
  );
}

function Progress({ value, max }: { value: number; max: number }) {
  return (
    <div
      className="kb-progress"
      role="progressbar"
      aria-label="学习进度"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <span style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="kb-page-heading">
      <span className="kb-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
function CourseDialog({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="kb-dialog"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="kb-dialog-title"
    >
      <button className="kb-dialog-close" onClick={close} aria-label="关闭">
        <X size={22} />
      </button>
      <span className="kb-dialog-icon">
        <Sprout size={30} />
      </span>
      <h2 id="kb-dialog-title">{title}</h2>
      {children}
    </dialog>
  );
}
