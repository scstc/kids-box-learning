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
import BookShelf from "./components/BookShelf";
import LearningCount from "./components/LearningCount";
import Starter from "./components/Starter";
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

type View = "map" | "lesson" | "review" | "passport" | "legacy" | "library" | "starter";
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
    title: "Part 1 · Around us",
    subtitle: "Hello, school, toys and family",
    from: 1,
    to: 4,
  },
  {
    id: 2,
    title: "Part 2 · Discover the world",
    subtitle: "Pets, bodies, animals and clothes",
    from: 5,
    to: 8,
  },
  {
    id: 3,
    title: "Part 3 · Everyday adventures",
    subtitle: "Sports, transport, rooms and food",
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
      setNotice("You've explored every word in this unit. Try a listening game!");
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
            Back to Book 1
          </button>
          <span>Animal sound safari · Your progress is saved</span>
        </div>
        <App />
      </>
    );

  const renderGame = () => {
    if (!game) return null;
    if (game.finished)
      return (
        <section className="kb-game-finish">
          {motion.canAnimate && <CorrectCelebration message="Challenge complete!" />}
          <span className="kb-finish-star">
            <Star size={45} fill="currentColor" />
          </span>
          <span className="kb-eyebrow">LITTLE STEPS, BIG PROGRESS</span>
          <h2>You finished this adventure!</h2>
          <p>
            Completed {game.questions.length}
            {activity === "spell" ? "spelling" : "listening"} questions, with {game.firstTry}{" "}
            right on the first try.
          </p>
          <p className="kb-finish-note">Every listen and every try helps you grow.</p>
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
              Play again
            </button>
            <button
              className="kb-btn kb-btn-secondary"
              onClick={() => navigate("map")}
            >
              Back to course map
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
        aria-label={activity === "listen" ? "Listen and find" : "Spelling play"}
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
            ? "What can you hear?"
            : spellingHints
              ? "Put the letters in order."
              : "Listen and spell it yourself."}
        </h2>
        <p>
          {activity === "listen"
            ? "Listen, then choose the matching picture."
            : spellingHints
              ? "Listen, then put each letter in its place."
              : "No letter hints. Write the word you hear."}
        </p>
        <button
          className={`kb-big-audio ${audio.playingText ? "is-playing" : ""}`}
          onClick={() => void audio.play(question.word.en)}
          aria-label="Play the question word"
        >
          <Volume2 size={27} />
          {audio.playingText ? "Listen closely…" : "Listen again"}
          <span className="kb-audio-waves">
            <i />
            <i />
            <i />
          </span>
        </button>
        {activity === "listen" ? (
          <div className="kb-choices">
            {game.options.map((option, index) => (
              <button
                key={entryKey(option)}
                onClick={() => answerGame(option)}
                disabled={game.correct || game.wrong.includes(entryKey(option))}
                className={`kb-choice ${game.correct && entryKey(option) === entryKey(question) ? "answer-right" : ""} ${game.wrong.includes(entryKey(option)) ? "answer-wrong" : ""}`}
                style={themeStyle(
                  courseUnits.find((unit) => unit.id === option.unitId)!,
                )}
                aria-label={`Choose picture ${index + 1}`}
              >
                <WordArt id={option.word.id} unitId={option.unitId} />
                {game.correct && entryKey(option) === entryKey(question) && (
                  <strong>
                    {option.word.en}
                    <Check size={18} />
                  </strong>
                )}
                {game.wrong.includes(entryKey(option)) && (
                  <small>Listen again</small>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="kb-spelling">
            <label className="kb-spelling-toggle">
              <span>
                Letter hints
                <small>{spellingHints ? "Choose letter tiles" : "Type the word yourself"}</small>
              </span>
              <input
                type="checkbox"
                role="switch"
                aria-label="Letter hints"
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
                    setNotice("Setting changed, but it could not be saved.");
                  }
                }}
              />
            </label>
            <div className="kb-spell-clue">
              <WordArt id={question.word.id} unitId={question.unitId} />
            </div>
            {spellingHints ? (
              <>
                <div className="kb-spell-slots" aria-label="Selected letters">
                  {spellingLetters(question.word.en).map((_, index) => (
                    <button
                      key={index}
                      disabled={
                        game.correct || game.selected[index] === undefined
                      }
                      aria-label={
                        game.selected[index] === undefined
                          ? `Empty slot ${index + 1}`
                          : `Remove letter ${index + 1}`
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
                <div className="kb-letter-bank" aria-label="Available letters">
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
                      aria-label={`Letter ${tile.letter}`}
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
                {spellingHints ? "Start over" : "Clear and try again"}
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
                {spellingHints ? "Check spelling" : "Check answer"}
              </button>
            </div>
            <p className="kb-spell-hint">
              {!spellingHints
                ? "Use upper or lower case. Spaces and hyphens are optional."
                : question.word.en.includes(" ") ||
                    question.word.en.includes("-")
                  ? "Only letters go in the slots. Leave out spaces and hyphens."
                  : "Tap a placed letter to take it back."}
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
                That's right! {question.word.en}
              </span>
              <RewardButton animated={motion.canAnimate} className="kb-btn kb-reward-next" onClick={nextQuestion}>
                {game.round === game.questions.length - 1
                  ? "Finish challenge"
                  : "Next question"}
                <ArrowRight size={18} />
              </RewardButton>
            </>
          ) : (
            <span>
              {game.wrong.length
                ? "Listen again and give it another try."
                : "No timer. Take your time and listen again."}
            </span>
          )}
        </div>
      </section>
    );
  };

  return (
    <ClickSpark
      sparkColor={["#f2a54a", "#69bce8", "#8d89e8"]}
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
          Skip to learning
        </a>
        <header className="kb-header">
          <button
            className="kb-brand"
            onClick={() => navigate("map")}
            aria-label="Kids Box home"
          >
            <span>
              <Sprout size={28} />
            </span>
            <div>
              Kids Box<span>.</span>
              <small>Kids Box · Book 1 activities</small>
            </div>
          </button>
          <nav aria-label="Course navigation">
            <button onClick={() => openReader()}><BookOpen size={18} /><span>Talking book</span></button>
            <button
              aria-current={
                view === "map" || view === "lesson" ? "page" : undefined
              }
              onClick={() => navigate("map")}
            >
              <Compass size={18} />
              <span>Course map</span>
            </button>
            <button
              aria-current={view === "review" ? "page" : undefined}
              onClick={() => navigate("review")}
            >
              <Layers3 size={18} />
              <span>Practice bag</span>
              {mistakes.length > 0 && <b>{mistakes.length}</b>}
            </button>
            <button
              aria-current={view === "passport" ? "page" : undefined}
              onClick={() => navigate("passport")}
            >
              <Footprints size={18} />
              <span>My progress</span>
            </button>
            <button aria-current={view === "starter" ? "page" : undefined} onClick={() => navigate("starter")}>
              <AudioLines size={18} /><span>Starter</span>
            </button>
          </nav>
          <button
            className="kb-help"
            aria-label="Parent guide"
            onClick={() => setDialog("help")}
          >
            <HelpCircle size={21} />
            <span>For parents</span>
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
                      Open your book.{" "}<span>Listen, speak and sing.</span>
                    </h1>
                    <p>Explore your book and practise, one little step at a time.</p>
                    <div className="kb-welcome-tags">
                      <span>
                        <BookOpen size={14} />
                        Second edition · Book 1
                      </span>
                      <span>
                        <Headphones size={14} />
                        12 themed units
                      </span>
                      <span>
                        <Heart size={14} />
                        Learn at your own pace
                      </span>
                    </div>
                    <button
                      className="kb-btn"
                      onClick={() => openUnit(progress.lastUnit)}
                    >
                      {progress.learned.length
                        ? "Continue exploring"
                        : "Start with Hello"}
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
              <section className="kb-overview" aria-label="Book progress">
                <div>
                  <span className="kb-stat-icon">
                    <Footprints size={23} />
                  </span>
                  <div>
                    <strong>
                      <LearningCount value={progress.learned.length} animated={motion.canAnimate} />
                      <small> / {allWordEntries.length}</small>
                    </strong>
                    <span>Words explored</span>
                  </div>
                </div>
                <div>
                  <span className="kb-stat-icon">
                    <BookOpen size={23} />
                  </span>
                  <div>
                    <strong>
                      <LearningCount value={complete} animated={motion.canAnimate} />
                      <small> / 12</small>
                    </strong>
                    <span>Units explored</span>
                  </div>
                </div>
                <div className="kb-overview-progress">
                  <div>
                    <span>A book full of discoveries</span>
                    <strong>
                      <LearningCount value={Math.round((progress.learned.length / allWordEntries.length) * 100)} animated={motion.canAnimate} />
                      %
                    </strong>
                  </div>
                  <Progress
                    value={progress.learned.length}
                    max={allWordEntries.length}
                  />
                  <small>Every new word is a little step forward.</small>
                </div>
                <span className="kb-overview-doodle">
                  <Sprout size={38} />
                </span>
              </section>
              <button className="kb-starter-entry" onClick={() => navigate("starter")}><AudioLines size={26} /><span><strong>Starter</strong><small>Alphabet &amp; Sounds · A–Z and English sounds</small></span><ArrowRight size={21} /></button>
              <BookShelf animated={motion.canAnimate} onOpen={() => openUnit(progress.lastUnit)} />
              <div className="kb-map-heading">
                <div>
                  <span className="kb-eyebrow">YOUR LEARNING MAP</span>
                  <h2>Where will you explore today?</h2>
                </div>
                <label className="kb-search">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Find a unit or word"
                    aria-label="Search units or words"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} aria-label="Clear search">
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
                      `${unit.title} ${unit.words.map((word) => word.en).join(" ")}`
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
                              aria-label={`Open unit ${unit.id}: ${unit.title}`}
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
                              <p>{unit.description}</p>
                              <div className="kb-unit-bottom">
                                <span>
                                  {verifiedBookActivities[unit.id]
                                    ? "12 book activities"
                                    : "Book activities coming soon"}
                                </span>
                                <span>
                                  words {count}/{unit.words.length}
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
                            Units {stage.from}–{stage.to} · Practice stop
                          </strong>
                          <p>Listen again to words from these units.</p>
                        </div>
                        <span className="kb-review-banner-action">
                          Let's play
                          <ArrowRight size={17} />
                        </span>
                      </button>
                    </section>
                  )
                );
              })}
              {query &&
                !courseUnits.some((unit) =>
                  `${unit.title} ${unit.words.map((word) => word.en).join(" ")}`
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()),
                ) && (
                  <div className="kb-empty">
                    <Search size={35} />
                    <h3>No matching words yet</h3>
                    <p>Try an English word or a unit title.</p>
                  </div>
                )}
              <section className="kb-additional-sections">
                <h2>There's more to explore in your book.</h2>
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
                      <small>Open book activities →</small>
                    </button>
                  ))}
                </div>
              </section>
              <aside className="kb-source-note">
                <BookOpen size={20} />
                <div>
                  <strong>Follow the book, then practise what you've discovered.</strong>
                  <p>
                    Explore 144 activities across 12 units, plus CLIL, values, reviews and grammar pages. Book recordings, videos and flashcards are included.
                  </p>
                  <a href={courseSource} target="_blank" rel="noreferrer">
                    Second edition unit list
                    <ArrowRight size={13} />
                  </a>
                  <a
                    href="https://kb.unischool.cn/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Publisher samples and resources
                    <ArrowRight size={13} />
                  </a>
                </div>
              </aside>
            </>
          )}

          {view === "starter" && <Starter audio={audio} />}
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
                  Course map
                </button>
                <span>/</span>
                <span>UNIT {String(unit.id).padStart(2, "0")}</span>
                <div>
                  <button
                    disabled={unitId === 1}
                    onClick={() => openUnit(unitId - 1)}
                    aria-label="Previous unit"
                  >
                    <ChevronLeft size={19} />
                  </button>
                  <button
                    disabled={unitId === 12}
                    onClick={() => openUnit(unitId + 1)}
                    aria-label="Next unit"
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
                  </h1>
                  <p>{unit.description}</p>
                </div>
                <div className="kb-lesson-progress">
                  <strong>
                    {learnedIn(unit)}
                    <span> / {unit.words.length}</span>
                  </strong>
                  <small>Footprints</small>
                  <Progress value={learnedIn(unit)} max={unit.words.length} />
                </div>
              </section>
              <div
                className="kb-activity-tabs"
                role="group"
                aria-label="Choose an activity"
              >
                {(
                  [
                    { id: "book", title: "Book activities", Icon: BookOpen },
                    { id: "media", title: "Videos and flashcards", Icon: Layers3 },
                    { id: "words", title: "Word explorer", Icon: Ear },
                    { id: "sentences", title: "Let's talk", Icon: AudioLines },
                    { id: "listen", title: "Listen and find", Icon: Headphones },
                    { id: "spell", title: "Spelling play", Icon: Sparkles },
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
              <button className="kb-btn kb-btn-secondary" onClick={() => openReader(unitStartPages[unit.id - 1])}><BookOpen size={18} />Open talking book</button>
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
                    <h2>Bring words to life.</h2>
                    <p>Listen and repeat. Try your own names and objects.</p>
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
                              ? "Listen closely…"
                              : "Listen and repeat"}
                          </button>
                          <button
                            className="kb-btn kb-btn-secondary"
                            onClick={() => void audio.play(sentence.en, true)}
                          >
                            <Turtle size={18} />
                            Slower
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
                        Look, listen and say it.
                      </span>
                      <button
                        onClick={() => void audio.play(word.en)}
                        aria-label={`Play ${word.en} pronunciation`}
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
                        <button disabled={!motion.canAnimate} onClick={() => { setWordAnimationReplay((value) => value + 1); void audio.play(word.en); }}><Sparkles size={16} />Replay animation</button>
                        <button aria-pressed={motion.enabled} onClick={motion.toggle}>Motion effects: {motion.enabled ? "On" : "Off"}</button>
                      </div>
                      <p
                        className="kb-word-ipa"
                        aria-label={`British pronunciation /${word.ipa}/`}
                      >
                        /{word.ipa}/
                      </p>
                      <div className="kb-word-translation">
                        {progress.learned.includes(entryKey(currentEntry)) && (
                          <small>
                            <Check size={13} />
                            Explored
                          </small>
                        )}
                        <span className="kb-voice-tag">British pronunciation</span>
                      </div>
                      <div className="kb-button-row">
                        <button
                          className="kb-btn"
                          onClick={() => void audio.play(word.en)}
                        >
                          <Volume2 size={21} />
                          {audio.playingText === word.en
                            ? "Playing…"
                            : "Listen and repeat"}
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
                          Slower
                        </button>
                      </div>
                      <div className="kb-chunk-heading">
                        <AudioLines size={16} />
                        {word.chunkType === "音节"
                          ? "Clap the syllables"
                          : word.chunkType === "整词"
                            ? "Listen to this special word"
                            : "Sound partners"}
                        <span>{word.chunkType === "音节" ? "Syllables" : word.chunkType === "整词" ? "Whole word" : "Sound parts"}</span>
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
                                  ? `Play ${chunk} in ${word.en}: /${word.sounds[index]}/`
                                  : `${chunk} in ${word.en} is silent`
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
                                    `${chunk} in ${word.en} is silent.`,
                                  );
                                }
                              }}
                            >
                              <strong>{chunk}</strong>
                              <small>
                                {word.sounds[index]
                                  ? `/${word.sounds[index]}/`
                                  : "silent"}
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
                          audio.blending ? "Stop blending" : "Hear the parts, then the whole word"
                        }
                      >
                        <Volume2 size={19} />
                        {audio.blending ? "Blending · Tap to stop" : "Blend it together"}
                        <ArrowRight size={17} />
                      </button>
                      <div className="kb-word-tip">
                        <Lightbulb size={20} />
                        <p>{word.tip}</p>
                      </div>
                      <p className="kb-chunk-note">
                        Tap a part, then blend the word. Sound parts are not always syllables. Short sounds use a phonics voice; whole words use natural British speech.
                      </p>
                      <RewardButton animated={motion.canAnimate}
                        className="kb-btn kb-learn-next"
                        onClick={markAndNext}
                      >
                        <Check size={19} />
                        {progress.learned.includes(entryKey(currentEntry))
                          ? "Practised! Keep going"
                          : "I know this word!"}
                        <ArrowRight size={18} />
                      </RewardButton>
                      <div className="kb-word-pager">
                        <button
                          disabled={wordIndex === 0}
                          onClick={() => setWordIndex(wordIndex - 1)}
                          aria-label="Previous word"
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
                          aria-label="Next word"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </section>
                  <section className="kb-unit-words">
                    <div className="kb-small-section-heading">
                      <h2>Words in this unit</h2>
                      <span>Choose a word to explore.</span>
                    </div>
                    <div className="kb-mini-word-grid">
                      {unit.words.map((item, index) => (
                        <button
                          key={item.id}
                          aria-pressed={wordIndex === index}
                          onClick={() => setWordIndex(index)}
                          style={themeStyle(unit)}
                          aria-label={`Learn ${item.en}`}
                        >
                          <WordArt id={item.id} unitId={unit.id} />
                          <strong lang="en">{item.en}</strong>
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
                        <strong>Visit the animal sound safari</strong>
                        <small>Your seven animal friends and footprints are waiting.</small>
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
                title="A little more familiar each time."
                description="Words to practise live here. Listen again. A correct answer takes a word out of your practice bag."
              />
              {game ? (
                renderGame()
              ) : mistakes.length ? (
                <>
                  <div className="kb-review-actions">
                    <span>
                      <Layers3 size={20} />
                      {mistakes.length} words to practise
                    </span>
                    <div className="kb-button-row">
                      <button
                        className="kb-btn"
                        onClick={() => startGame("listen", mistakes)}
                      >
                        <Headphones size={18} />
                        Listening practice
                      </button>
                      <button
                        className="kb-btn kb-btn-secondary"
                        onClick={() => startGame("spell", mistakes)}
                      >
                        <Sparkles size={18} />
                        Spelling practice
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
                  <h2>Your bag is all clear!</h2>
                  <p>
                    Words that need practice will appear here.
                    <br />
                    Try a listening challenge from the whole book.
                  </p>
                  <button
                    className="kb-btn"
                    onClick={() =>
                      startGame("listen", shuffled(allWordEntries).slice(0, 12))
                    }
                  >
                    Random listening challenge
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
                  Back to practice bag
                </button>
              )}
            </>
          )}

          {view === "passport" && (
            <>
              <PageHeading
                eyebrow="MY BOOK OF LITTLE DISCOVERIES"
                title="Every footprint counts."
                description={`You've explored ${progress.learned.length} words and completed ${complete} units.`}
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
                      <Progress value={count} max={unit.words.length} />
                      <p>
                        {count}/{unit.words.length} words
                      </p>
                    </button>
                  );
                })}
              </section>
              <div className="kb-passport-footer">
                <p>
                  <Heart size={17} />
                  Follow your own pace. A little progress each day is enough.
                </p>
                <button
                  className="kb-text-button"
                  onClick={() => setDialog("reset")}
                >
                  <RotateCcw size={16} />
                  Reset word practice
                </button>
              </div>
            </>
          )}
          <aside className="kb-gentle-note">
            <Heart size={19} />
            <p>
              <strong>Little steps deserve a smile.</strong>{" "}
              Listen a little each day. There's no rush.
            </p>
            <Sprout size={26} />
          </aside>
          {storageError && (
            <p className="kb-storage-error" role="status">
              Progress could not be saved in this browser. You can keep learning.
            </p>
          )}
        </main>
        <footer className="kb-footer">
          <span>
            <Sprout size={15} />
            little steps, wild discoveries.
          </span>
          <span>{courseEdition} · Independent practice app · Not an official publisher app</span>
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
            <button onClick={audio.retry}>Retry</button>
          </div>
        )}
        {dialog && (
          <CourseDialog
            title={
              dialog === "help"
                ? "Help your child learn through sound."
                : "Reset Book 1 word practice?"
            }
            close={() => setDialog(null)}
          >
            {dialog === "reset" ? (
              <>
                <p>
                  This clears Book 1 word progress and the practice bag. Book activity records, added resources and animal safari progress will be kept.
                </p>
                <div className="kb-button-row">
                  <button
                    className="kb-btn kb-btn-secondary"
                    onClick={() => setDialog(null)}
                  >
                    Keep my progress
                  </button>
                  <button
                    className="kb-btn"
                    onClick={() => {
                      reset();
                      setDialog(null);
                      navigate("map");
                      setNotice("A new adventure begins!");
                    }}
                  >
                    Start again
                    <RotateCcw size={17} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  These activities follow Book 1 themes. Choose any unit and enjoy 5–10 minutes at a time.
                </p>
                <p>
                  The talking book shows the original pages. Tap blue CD icons for recordings. Each unit includes videos, karaoke and flashcards. Find CLIL, values, reviews and grammar below the course map.
                </p>
                <div className="kb-parent-steps">
                  <p>
                    <Ear size={23} />
                    <span>
                      <strong>Sounds first, then letters</strong>
                      Listen to the word, repeat slowly and explore its sound partners. Look out for special sound patterns.
                    </span>
                  </p>
                  <p>
                    <Sparkles size={23} />
                    <span>
                      <strong>Practise through play</strong>
                      Listening and spelling games have no timer. Try again whenever you need. Tricky words go into the practice bag.
                    </span>
                  </p>
                  <p>
                    <BookOpen size={23} />
                    <span>
                      <strong>Use with your book</strong>
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
                    Publisher samples and resources
                    <ArrowRight size={15} />
                  </a>
                  <a href={courseSource} target="_blank" rel="noreferrer">
                    Second edition Book 1 contents
                    <ArrowRight size={15} />
                  </a>
                </div>
                <p className="kb-parent-small">
                  Words, letter names and practice sentences use natural British speech. Short sounds use a separate phonics voice. Original book recordings keep their own speakers. All recordings are included in the app. The website needs internet for resources; the Android app works offline. Progress stays on this device. No microphone is used.
                </p>
                <AppUpdate />
                <button className="kb-btn" onClick={() => setDialog(null)}>
                  Let's explore
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
      aria-label="Learning progress"
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
      <button className="kb-dialog-close" onClick={close} aria-label="Close">
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
