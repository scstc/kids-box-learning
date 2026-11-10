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
import { recordedWordGuide } from "./data/cambridgePronunciation";
import { useScreenRecording } from "./hooks/useScreenRecording";

type Page = "explore" | "lab" | "passport";
type Mode = "listen" | "sounds" | "quiz";

export default function App() {
  const { status: recording } = useScreenRecording();
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
    setToast(`You earned a ${animal.name} footprint!`);
    if (activeIndex < animals.length - 1) {
      setActiveIndex((previous) => previous + 1);
      setMode("listen");
    } else {
      setPage("passport");
      setToast("New footprint! Take a look at your passport.");
    }
  };

  return (
    <ClickSpark
      sparkColor={["#f2a54a", "#69bce8", "#8d89e8"]}
      sparkSize={7}
      sparkRadius={24}
      sparkCount={7}
      shape="star"
      duration={480}
      disabled={["starting", "recording", "stopping"].includes(recording.state)}
    >
      <div className="app-shell">
        <a href="#main" className="skip-link">
          Skip to learning
        </a>
        <header className="site-header">
          <button
            className="brand"
            onClick={() => openPage("explore")}
            aria-label="Little Safari home"
          >
            <span className="brand-icon">
              <Sprout size={27} strokeWidth={2.2} />
            </span>
            <span>
              little safari<span className="brand-dot">.</span>
              <small>Little sound explorers</small>
            </span>
          </button>
          <nav className="main-nav" aria-label="Main navigation">
            <button
              onClick={() => openPage("explore")}
              className={page === "explore" ? "active" : ""}
              aria-current={page === "explore" ? "page" : undefined}
            >
              <Compass size={18} />
              <span>Animal adventure</span>
            </button>
            <button
              onClick={() => openPage("lab")}
              className={page === "lab" ? "active" : ""}
              aria-current={page === "lab" ? "page" : undefined}
            >
              <AudioLines size={18} />
              <span>Sound lab</span>
            </button>
            <button
              onClick={() => openPage("passport")}
              className={page === "passport" ? "active" : ""}
              aria-current={page === "passport" ? "page" : undefined}
            >
              <BookOpen size={18} />
              <span>My passport</span>
              {learned.length > 0 && (
                <span className="nav-count">{learned.length}</span>
              )}
            </button>
          </nav>
          <button
            className="help-button"
            aria-label="For parents"
            onClick={() => setHelpOpen(true)}
          >
            <HelpCircle size={18} />
            <span>For parents</span>
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
                      Every little step,<span>a new discovery.</span>
                    </>
                  ) : page === "lab" ? (
                    <>
                      Explore the parts,<span>blend the sounds.</span>
                    </>
                  ) : (
                    <>
                      Listen closely,<span>meet a new friend.</span>
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
                    ? "Take your time. Fill your passport with discoveries."
                    : page === "lab"
                      ? "Clap the syllables and discover the sounds inside each word."
                      : "Listen, blend and explore the animal world."}
                </p>
              </div>
              <div className="journey-progress">
                <div className="progress-mascot">
                  <PawPrint size={25} />
                </div>
                <div>
                  <div className="progress-label">
                    Your adventure{" "}
                    <strong>
                      {learned.length}
                      <span> / 7</span>
                    </strong>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label="Animals explored"
                    aria-valuenow={learned.length}
                    aria-valuemin={0}
                    aria-valuemax={7}
                  >
                    <span style={{ width: `${(learned.length / 7) * 100}%` }} />
                  </div>
                  <small>
                    {learned.length === 7
                      ? "You have met every animal!"
                      : "Meet a friend and collect a footprint."}
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
                  <h2>My animal friends</h2>
                  <p>
                    You have met {learned.length}{" "}
                    friends. Say hello when you see them again!
                  </p>
                </div>
                <div className="stamp-grid">
                  {animals.map((item, index) => (
                    <button
                      key={item.id}
                      className={`stamp ${learned.includes(item.id) ? "collected" : ""}`}
                      onClick={() => chooseAnimal(index)}
                      aria-label={`${item.name}: ${learned.includes(item.id) ? "Collected. Tap to practise." : "Ready to explore. Tap to learn."}`}
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

                      <small>
                        {learned.includes(item.id)
                          ? "Say hello again"
                          : "Ready to meet you"}
                      </small>
                    </button>
                  ))}
                </div>
                <div className="passport-actions">
                  <button className="primary-button" onClick={startQuiz}>
                    <Headphones size={19} />
                    Listen and find
                    <ArrowRight size={19} />
                  </button>
                  <button
                    className="text-button"
                    onClick={() => setResetOpen(true)}
                  >
                    <RotateCcw size={15} />
                    Start a new adventure
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
                  aria-label="Animal learning card"
                >
                  <div className="lesson-toolbar">
                    <div
                      className="step-tabs"
                      role="tablist"
                      aria-label="Learning activities"
                    >
                      <button
                        role="tab"
                        aria-selected={mode === "listen"}
                        onClick={() => setMode("listen")}
                        className={mode === "listen" ? "selected" : ""}
                      >
                        <span>01</span>
                        <Ear size={17} />
                        Listen
                      </button>
                      <button
                        role="tab"
                        aria-selected={mode === "sounds"}
                        onClick={() => setMode("sounds")}
                        className={mode === "sounds" ? "selected" : ""}
                      >
                        <span>02</span>
                        <AudioLines size={17} />
                        Explore sounds
                      </button>
                      <button
                        role="tab"
                        aria-selected={mode === "quiz"}
                        onClick={startQuiz}
                        className={mode === "quiz" ? "selected" : ""}
                      >
                        <span>03</span>
                        <Sparkles size={17} />
                        Play
                      </button>
                    </div>
                    <span className="toolbar-label">
                      <Leaf size={15} />
                      {mode === "quiz" ? "Listen and find" : "Stop 1 · Animal world"}
                    </span>
                  </div>

                  {mode === "quiz" ? (
                    <div
                      className="quiz-panel"
                      role="tabpanel"
                      aria-label="Listen and find"
                    >
                      {quizFinished ? (
                        <div className="quiz-complete">
                          <span className="complete-icon">
                            <Star size={42} fill="currentColor" />
                          </span>
                          <span className="section-kicker">
                            SAFARI COMPLETE!
                          </span>
                          <h2>You found every animal!</h2>
                          <p>Seven sounds, seven friends. Great listening!</p>
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
                              See my passport
                              <BookOpen size={18} />
                            </button>
                            <button
                              className="secondary-button"
                              onClick={startQuiz}
                            >
                              <RotateCcw size={17} />
                              Play again
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
                            <h2>Who is saying hello?</h2>
                            <p>Tap the speaker, listen and choose the animal.</p>
                          </div>
                          <button
                            className={`quiz-play ${playing ? "is-playing" : ""}`}
                            onClick={() => void play(quizAnimal.id)}
                            aria-label="Play the animal sound"
                          >
                            <Volume2 size={32} />
                            <span>{playing ? "Listen closely…" : "Listen to the word"}</span>
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
                                aria-label={`Choose ${item.name}`}
                              >
                                <AnimalArt animal={item.id} />

                                {correct && item.id === quizAnimal.id && (
                                  <span className="answer-check">
                                    <Check size={19} />
                                  </span>
                                )}
                                {wrongChoices.includes(item.id) && (
                                  <small>Listen again</small>
                                )}
                              </button>
                            ))}
                          </div>
                          <div className="quiz-feedback" aria-live="polite">
                            {correct ? (
                              <>
                                <span>
                                  <Check size={20} />
                                  You found it! {quizAnimal.name}
                                </span>
                                <button
                                  className="primary-button"
                                  onClick={nextQuestion}
                                >
                                  {quizRound === 6 ? "Finish adventure" : "Next friend"}
                                  <ArrowRight size={18} />
                                </button>
                              </>
                            ) : (
                              <span>
                                {wrongChoices.length
                                  ? "Listen again and try another friend."
                                  : "Take your time. Listen as often as you like."}
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
                        mode === "listen" ? "Listen to the animal word" : "Explore the sounds"
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
                          aria-label={`Listen to ${animal.name} pronunciation`}
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

                          {learned.includes(animal.id) && (
                            <span className="learned-pill">
                              <Check size={13} />
                              Explored
                            </span>
                          )}
                        </div>
                        <div className="phonetic">
                          <span>/{recordedWordGuide(animal.id)?.ipa ?? animal.ipa.replaceAll("/", "")}/</span>
                          <span className="pronunciation-tag">American pronunciation</span>
                        </div>

                        {mode === "listen" ? (
                          <>
                            <div className="sound-prompt">
                              <span className="tiny-icon">
                                <Headphones size={18} />
                              </span>
                              <p>
                                Listen first, then say it aloud.
                                <br />
                                <span>
                                  How many syllables can you hear?
                                </span>
                              </p>
                            </div>
                            <div className="listen-actions">
                              <button
                                className={`primary-button play-button ${playing ? "is-playing" : ""}`}
                                onClick={() => void play(animal.id)}
                              >
                                <Volume2 size={21} />
                                {playing ? "Playing…" : "Listen and repeat"}
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
                                <span>Slower</span>
                              </button>
                            </div>
                            <div className="rhythm-preview">
                              <span className="rhythm-label">Sound steps</span>
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
                                  ? "Find the silent e"
                                  : `${animal.parts.length} syllables. Clap and say them.`}
                              </span>
                            </div>
                            <button
                              className="next-step"
                              onClick={() => setMode("sounds")}
                            >
                              Discover the sounds
                              <ArrowRight size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="parts-instruction">
                              <AudioLines size={17} />
                              Tap a part to hear its sound.
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
                                  <small>{part.ipa === "静音" ? "silent" : part.ipa}</small>
                                </button>
                              ))}
                            </div>
                            <div className="sound-tip" aria-live="polite">
                              <Lightbulb size={19} />
                              <p>
                                <strong>
                                  {partIndex === null
                                    ? animal.ruleLabel
                                    : `${animal.parts[partIndex].text} sound patterns`}
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
                                Hear the word slowly
                              </button>
                              <button
                                className="primary-button"
                                onClick={finishAnimal}
                              >
                                <Check size={18} />
                                I can say it!
                                <ArrowRight size={18} />
                              </button>
                            </div>
                            <p className="sound-note">
                              {animal.id === "snake"
                                ? "These are sound parts. The word snake has one syllable."
                                : "Listen to each syllable, then blend the whole word."}
                            </p>
                          </>
                        )}
                        <div className="word-pagination">
                          <button
                            onClick={() =>
                              setActiveIndex((previous) => previous - 1)
                            }
                            disabled={activeIndex === 0}
                            aria-label="Previous animal"
                          >
                            <ChevronLeft size={19} />
                          </button>
                          <div className="pagination-dots">
                            {animals.map((item, index) => (
                              <button
                                key={item.id}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`View ${item.name}`}
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
                            aria-label="Next animal"
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
                <section className="animal-collection" aria-label="Choose an animal">
                  <div className="collection-header">
                    <div>
                      <span className="section-kicker">
                        <Footprints size={17} /> YOUR SAFARI FRIENDS
                      </span>
                      <h2>
                        Who will you meet next?<span>Seven friends to discover</span>
                      </h2>
                    </div>
                    <span className="collection-hint">
                      Tap a friend to start exploring.
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
                        aria-label={`Learn ${item.name}`}
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
              <strong>Everyone learns at their own pace.</strong>{" "}
              A little listening every day is a step forward.
            </p>
            <span className="note-doodle">
              <Sprout size={28} />
            </span>
          </aside>
          {storageError && (
            <p className="storage-notice" role="status">
              Progress could not be saved. You can keep learning.
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
                Try again
              </button>
            </div>
          )}
        </main>

        <footer className="site-footer">
          <span>
            <Sprout size={15} /> little steps, wild discoveries.
          </span>
          <span>
            Explore with curiosity. Remember through sound. <span className="footer-dot">·</span> Made
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
            title={resetOpen ? "Start this adventure again?" : "Start with sound"}
            onClose={() => {
              setHelpOpen(false);
              setResetOpen(false);
            }}
          >
            {resetOpen ? (
              <>
                <p>
                  This clears animal footprints on this device. Your seven friends will still be here.
                </p>
                <div className="dialog-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setResetOpen(false)}
                  >
                    Keep my progress
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
                    Start again
                    <RotateCcw size={17} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  Little Safari helps children listen, repeat and discover sound patterns. Explore one or two animals each day.
                </p>
                <div className="parent-steps">
                  <p>
                    <Ear size={22} />
                    <span>
                      <strong>Listen to the whole word</strong>
                      Tap the speaker, then try the slower pronunciation.
                    </span>
                  </p>
                  <p>
                    <AudioLines size={22} />
                    <span>
                      <strong>Clap and explore</strong>
                      Syllables help you remember. Sound tips explain the patterns. Snake uses sound parts and has just one syllable.
                    </span>
                  </p>
                  <p>
                    <Play size={22} />
                    <span>
                      <strong>Learn through play</strong>
                      Listen and find the animal. You can always try again.
                    </span>
                  </p>
                </div>
                <div className="parent-note">
                  <Lightbulb size={20} />
                  <p>
                    Some words, such as giraffe and monkey, have special sounds. We combine syllables, phonics and whole-word listening.
                  </p>
                </div>
                <p className="privacy-note">
                  Progress stays on this device. Tap to listen. The app does not use the microphone or record your voice.
                </p>
                <button
                  className="primary-button dialog-start"
                  onClick={() => setHelpOpen(false)}
                >
                  Let's explore
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
      <button className="dialog-close" aria-label="Close" onClick={onClose}>
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
