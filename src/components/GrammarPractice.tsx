import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Headphones, RotateCcw, Star, Volume2, X } from "lucide-react";
import { grammarQuestionsForUnit, type GrammarQuestion } from "../data/grammarQuestions";
import type { CourseAudio } from "../hooks/useCourseAudio";
import CorrectCelebration from "./CorrectCelebration";
import RewardButton from "./RewardButton";
import "./grammarPractice.css";

type Props = { unitId: number; audio: CourseAudio; animated: boolean };
const letters = ["A", "B", "C"];
const freshRound = () => ({ index: 0, wrong: [] as number[], correct: false, firstTry: 0, finished: false });

export default function GrammarPractice({ unitId, audio, animated }: Props) {
  return <GrammarRound key={unitId} questions={grammarQuestionsForUnit(unitId)} audio={audio} animated={animated} />;
}

function GrammarRound({ questions, audio, animated }: {
  questions: GrammarQuestion[];
  audio: CourseAudio;
  animated: boolean;
}) {
  const [round, setRound] = useState(freshRound);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => audio.stop(), [audio.stop]);

  const restart = () => {
    audio.stop();
    setRound(freshRound());
  };
  if (!questions.length) return <section className="kb-grammar-practice"><h2>Ask &amp; answer</h2><p>Choose a book unit to practise its questions.</p></section>;
  if (round.finished) return <section className="kb-grammar-practice kb-grammar-finish" aria-label="Ask and answer results">
    {animated && <CorrectCelebration message="Great talking!" />}
    <span className="kb-grammar-finish-star"><Star size={38} fill="currentColor" aria-hidden="true" /></span>
    <span className="kb-eyebrow">LITTLE QUESTIONS, BIG DISCOVERIES</span>
    <h2>You finished this conversation adventure!</h2>
    <p>You answered {questions.length} questions, with {round.firstTry} right on the first try.</p>
    <p>Listen again and try saying the answers yourself.</p>
    <button className="kb-btn" onClick={restart}><RotateCcw size={18} aria-hidden="true" />Practise again</button>
  </section>;

  const question = questions[round.index];
  const choose = (index: number) => {
    if (round.correct || round.wrong.includes(index)) return;
    void audio.play(question.options[index]);
    setRound(current => index === question.answerIndex
      ? { ...current, correct: true, firstTry: current.firstTry + (current.wrong.length === 0 ? 1 : 0) }
      : { ...current, wrong: [...current.wrong, index] });
  };
  const next = () => {
    audio.stop();
    setRound(current => current.index + 1 === questions.length
      ? { ...current, finished: true }
      : { ...current, index: current.index + 1, wrong: [], correct: false });
    requestAnimationFrame(() => questionHeading.current?.focus());
  };

  return <section className="kb-grammar-practice" aria-label="Ask and answer practice">
    {round.correct && animated && <CorrectCelebration key={question.id} />}
    <div className="kb-grammar-topline">
      <span className="kb-eyebrow">ASK &amp; ANSWER</span>
      <span>Question {round.index + 1} of {questions.length}</span>
    </div>
    <h2>What would you say?</h2>
    <p className="kb-grammar-intro">Listen to the question. Hear the answers, then choose A, B or C.</p>
    <progress className="kb-grammar-progress" max={questions.length} value={round.index + (round.correct ? 1 : 0)} aria-label="Questions completed" />
    <div className="kb-grammar-question">
      <div><span><Headphones size={17} aria-hidden="true" />Listen to the question</span><h3 ref={questionHeading} tabIndex={-1}>{question.prompt}</h3></div>
      <button className="kb-grammar-speaker" aria-label={`Listen to the question: ${question.prompt}`} aria-pressed={audio.playingText === question.prompt}
        onClick={() => void audio.play(question.prompt)}><Volume2 size={25} aria-hidden="true" /></button>
    </div>
    <div className="kb-grammar-options" role="group" aria-label="Choose one answer">
      {question.options.map((option, index) => {
        const isRight = round.correct && index === question.answerIndex;
        const isWrong = round.wrong.includes(index);
        return <div key={`${question.id}:${index}`} className={`kb-grammar-option${isRight ? " is-right" : ""}${isWrong ? " is-wrong" : ""}`}>
          <button className="kb-grammar-answer" aria-label={`Choose answer ${letters[index]}: ${option}`} aria-pressed={isRight || isWrong}
            disabled={round.correct || isWrong} onClick={() => choose(index)}>
            <span className="kb-grammar-letter" aria-hidden="true">{letters[index]}</span>
            <span className="kb-grammar-answer-copy">{option}{isRight && <small>That’s right!</small>}{isWrong && <small>Try another answer</small>}</span>
            {isRight && <Check size={23} aria-hidden="true" />}{isWrong && <X size={22} aria-hidden="true" />}
          </button>
          <button className="kb-grammar-speaker" aria-label={`Listen to answer ${letters[index]}: ${option}`} aria-pressed={audio.playingText === option}
            onClick={() => void audio.play(option)}><Volume2 size={23} aria-hidden="true" /></button>
        </div>;
      })}
    </div>
    <div className={`kb-grammar-feedback${round.correct ? " is-right" : ""}`} role="status" aria-live="polite" aria-atomic="true">
      {round.correct ? <><Check size={21} aria-hidden="true" /><p><strong>That’s right!</strong> {question.explanation}</p></>
        : <><Headphones size={21} aria-hidden="true" /><p>{round.wrong.length ? "Not quite. Listen again and try another answer." : "Tap a speaker to listen. Tap A, B or C to answer."}</p></>}
    </div>
    {round.correct && <div className="kb-grammar-next"><RewardButton animated={animated} className="kb-btn" onClick={next}>
      {round.index + 1 === questions.length ? "See how you did" : "Next question"}<ArrowRight size={18} aria-hidden="true" />
    </RewardButton></div>}
  </section>;
}
