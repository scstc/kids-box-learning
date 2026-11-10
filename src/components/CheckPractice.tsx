import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Hand, Layers3, RotateCcw, Search, Star, Volume2 } from "lucide-react";
import {
  placementQuestions, sentenceQuestions, pictureFixQuestions,
  type PlacementQuestion, type SentenceQuestion, type PictureFixQuestion,
} from "../data/checkActivities";
import type { CourseAudio } from "../hooks/useCourseAudio";
import { usePracticeProgress } from "../hooks/usePracticeProgress";
import ListenPlace from "./ListenPlace";
import BuildSentence from "./BuildSentence";
import FixPicture from "./FixPicture";
import CorrectCelebration from "./CorrectCelebration";
import RewardButton from "./RewardButton";
import "./checkPractice.css";

type CheckKind = "place" | "build" | "fix";
type CheckQuestion = PlacementQuestion | SentenceQuestion | PictureFixQuestion;
const modes = [
  { id: "place", title: "Listen & place", Icon: Hand, description: "Listen, then move the picture to its place." },
  { id: "build", title: "Build a sentence", Icon: Layers3, description: "Put the word cards in order to make your answer." },
  { id: "fix", title: "Look & fix", Icon: Search, description: "Check the picture. Spot a mistake and put it right." },
] as const;

export default function CheckPractice({ unitId, audio, animated }: { unitId: number; audio: CourseAudio; animated: boolean }) {
  const [kind, setKind] = useState<CheckKind>("place");
  const mode = modes.find(mode => mode.id === kind)!;
  const questions: CheckQuestion[] = (kind === "place" ? placementQuestions : kind === "build" ? sentenceQuestions : pictureFixQuestions)
    .filter(question => question.unitId === unitId);
  return <section className="kb-check-practice" aria-label="Check and play">
    <div className="kb-check-modes" role="group" aria-label="Choose a challenge">
      {modes.map(item => <button key={item.id} aria-pressed={kind === item.id} onClick={() => { audio.stop(); setKind(item.id); }}>
        <item.Icon size={22} aria-hidden="true" /><span>{item.title}</span>
      </button>)}
    </div>
    <CheckRound key={`${unitId}:${kind}`} questions={questions} title={mode.title} description={mode.description} audio={audio} animated={animated} />
  </section>;
}

const freshRound = () => ({ index: 0, attempts: 0, firstTry: 0, correct: false, finished: false });

function CheckRound({ questions, title, description, audio, animated }: {
  questions: CheckQuestion[]; title: string; description: string; audio: CourseAudio; animated: boolean;
}) {
  const [round, setRound] = useState(freshRound);
  const { completed, complete, storageError } = usePracticeProgress();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => audio.stop(), [audio.stop]);
  const attempt = (correct: boolean) => {
    if (correct && !round.correct) complete(questions[round.index].id);
    setRound(previous => previous.correct ? previous : ({
      ...previous, correct, attempts: previous.attempts + 1,
      firstTry: previous.firstTry + (correct && previous.attempts === 0 ? 1 : 0),
    }));
  };
  const next = () => {
    audio.stop();
    setRound(previous => previous.index + 1 === questions.length
      ? { ...previous, finished: true }
      : { ...previous, index: previous.index + 1, attempts: 0, correct: false });
    requestAnimationFrame(() => heading.current?.focus());
  };
  if (!questions.length) return <p>Choose a book unit to start your challenge.</p>;
  if (round.finished) return <div className="kb-check-round kb-check-finish" aria-label="Challenge results">
    {animated && <CorrectCelebration message="Great exploring!" />}
    <Star size={48} className="kb-check-star" aria-hidden="true" />
    <h2>{title}: well done!</h2>
    <p>You completed {questions.length} challenges, with {round.firstTry} right on the first try.</p>
    {storageError && <p className="kb-storage-error" role="alert">Practice progress could not be saved on this device.</p>}
    <button className="kb-btn" onClick={() => { audio.stop(); setRound(freshRound()); }}><RotateCcw size={18} />Play again</button>
  </div>;
  const question = questions[round.index];
  const prompt = "prompt" in question ? question.prompt : null;
  return <div className="kb-check-round" aria-label={title}>
    {round.correct && animated && <CorrectCelebration key={question.id} />}
    <div className="kb-check-topline"><span className="kb-eyebrow">CHECK &amp; PLAY</span><span>Challenge {round.index + 1} of {questions.length}</span></div>
    {completed.includes(question.id) && !round.correct && <p className="kb-eyebrow">Practised before</p>}
    {storageError && <p className="kb-storage-error" role="alert">Practice progress could not be saved on this device.</p>}
    <h2 ref={heading} tabIndex={-1}>{title}</h2>
    <p className="kb-check-description">{description}</p>
    <progress max={questions.length} value={round.index + (round.correct ? 1 : 0)} aria-label="Challenges completed" />
    {prompt && <div className="kb-check-prompt">
      <h3>{prompt}</h3>
      <button aria-label={`Listen to the challenge: ${prompt}`} aria-pressed={audio.playingText === prompt} onClick={() => void audio.play(prompt)}><Volume2 size={24} aria-hidden="true" /></button>
    </div>}
    {"items" in question ? <ListenPlace key={question.id} question={question} audio={audio} solved={round.correct} onAttempt={attempt} />
      : "answer" in question ? <BuildSentence key={question.id} question={question} audio={audio} solved={round.correct} onAttempt={attempt} />
        : <FixPicture key={question.id} question={question} audio={audio} solved={round.correct} onAttempt={attempt} />}
    <div className={`kb-check-feedback${round.correct ? " is-right" : ""}`} role="status" aria-live="polite" aria-atomic="true">
      {round.correct ? <><Check size={21} aria-hidden="true" /><p><strong>That’s right!</strong> {question.explanation}</p></>
        : <p>{round.attempts ? "Not quite. Listen again and give it another try." : "Take your time. You can listen as often as you like."}</p>}
    </div>
    {round.correct && <div className="kb-check-next"><RewardButton animated={animated} className="kb-btn" onClick={next}>{round.index + 1 === questions.length ? "See how you did" : "Next challenge"}<ArrowRight size={18} aria-hidden="true" /></RewardButton></div>}
  </div>;
}
