import { useState } from "react";
import { Check, Search, Volume2, X } from "lucide-react";
import { courseUnits } from "../data/course";
import type { PictureFixQuestion } from "../data/checkActivities";
import type { CourseAudio } from "../hooks/useCourseAudio";
import WordArt from "./WordArt";
import "./sentenceChecks.css";

type Props = {
  question: PictureFixQuestion;
  audio: CourseAudio;
  solved: boolean;
  onAttempt: (correct: boolean) => void;
};
const letters = ["A", "B", "C"];

export default function FixPicture({ question, audio, solved, onAttempt }: Props) {
  const [needsCorrection, setNeedsCorrection] = useState(false);
  const [wrongJudgments, setWrongJudgments] = useState<boolean[]>([]);
  const [wrongOptions, setWrongOptions] = useState<number[]>([]);
  const imageWord = courseUnits.find(unit => unit.id === question.unitId)?.words.find(word => word.id === question.imageId)?.en ?? question.imageId.replaceAll("-", " ");
  const judge = (matches: boolean) => {
    if (solved || needsCorrection || wrongJudgments.includes(matches)) return;
    if (matches !== question.isTrue) {
      setWrongJudgments(current => [...current, matches]);
      onAttempt(false);
    } else if (question.isTrue) onAttempt(true);
    else setNeedsCorrection(true);
  };
  const choose = (index: number) => {
    if (solved || wrongOptions.includes(index)) return;
    const correct = index === question.answerIndex;
    if (!correct) setWrongOptions(current => [...current, index]);
    onAttempt(correct);
    if (correct) void audio.play(question.correctedStatement);
  };

  return <section className="kb-picture-fix" aria-label="Check the picture and sentence">
    <div className="kb-sc-picture-question">
      <div className="kb-sc-picture" role="img" aria-label={`Book picture: ${imageWord}`}><WordArt id={question.imageId} unitId={question.unitId} /></div>
      <div className={`kb-sc-statement${needsCorrection ? " is-mismatch" : ""}`}>
        <span className="kb-sc-area-title">Listen and look</span>
        <p>{question.statement}</p>
        <button className="kb-sc-statement-speaker" aria-label={`Listen to the sentence: ${question.statement}`} aria-pressed={audio.playingText === question.statement} onClick={() => void audio.play(question.statement)}><Volume2 size={21} aria-hidden="true" />Hear the sentence</button>
      </div>
    </div>
    <div className="kb-sc-judgments" role="group" aria-label="Does the sentence match the picture?">
      <button className={`kb-sc-judgment${solved && question.isTrue ? " is-right" : ""}${wrongJudgments.includes(true) ? " is-wrong" : ""}`} disabled={solved || needsCorrection || wrongJudgments.includes(true)} onClick={() => judge(true)}>
        <Check size={24} aria-hidden="true" /><span>Matches</span>
      </button>
      <button className={`kb-sc-judgment${needsCorrection ? " is-noticed" : ""}${wrongJudgments.includes(false) ? " is-wrong" : ""}`} disabled={solved || needsCorrection || wrongJudgments.includes(false)} onClick={() => judge(false)}>
        <Search size={24} aria-hidden="true" /><span>Something is wrong</span>
      </button>
    </div>
    {needsCorrection && <div className="kb-sc-corrections">
      <h3>Find a sentence that matches.</h3>
      <p>You spotted it! Choose the right sentence for the picture.</p>
      <div className="kb-sc-correction-options" role="group" aria-label="Choose the corrected sentence">
        {question.options.map((option, index) => {
          const right = solved && index === question.answerIndex;
          const wrong = wrongOptions.includes(index);
          return <div className={`kb-sc-correction-row${right ? " is-right" : ""}${wrong ? " is-wrong" : ""}`} key={index}>
            <button className="kb-sc-correction-answer" aria-label={`Choose correction ${letters[index]}: ${option}`} disabled={solved || wrong} onClick={() => choose(index)}>
              <span className="kb-sc-option-letter" aria-hidden="true">{letters[index]}</span><span>{option}</span>
              {right && <Check size={22} aria-hidden="true" />}{wrong && <X size={22} aria-hidden="true" />}
            </button>
            <button className="kb-sc-speaker" aria-label={`Listen to correction ${letters[index]}: ${option}`} aria-pressed={audio.playingText === option} onClick={() => void audio.play(option)}><Volume2 size={22} aria-hidden="true" /></button>
          </div>;
        })}
      </div>
    </div>}
    {solved && !question.isTrue && <div className="kb-sc-corrected-sentence" role="status">
      <Check size={23} aria-hidden="true" /><p>{question.correctedStatement}</p>
      <button className="kb-sc-speaker" aria-label={`Listen to the corrected sentence: ${question.correctedStatement}`} onClick={() => void audio.play(question.correctedStatement)}><Volume2 size={22} aria-hidden="true" /></button>
    </div>}
  </section>;
}
