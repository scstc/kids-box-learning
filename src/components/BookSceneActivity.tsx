import { useEffect, useState, type CSSProperties } from "react";
import { bookScenes, sceneReply } from "../data/bookScenes";
import { useLearningMotion } from "../hooks/useLearningMotion";
import CorrectCelebration from "./CorrectCelebration";
import "./bookSceneActivity.css";

const regionStyle = ([x,y,width,height]: number[]): CSSProperties => ({ left: `${x/1259*100}%`, top: `${y/1600*100}%`, width: `${width/1259*100}%`, height: `${height/1600*100}%` });
export default function BookSceneActivity({ page, speak }: { page: number; speak: (text: string) => void }) {
  const scene = bookScenes[page];
  const [question, setQuestion] = useState(scene?.questions[0]?.id ?? "");
  const [touched, setTouched] = useState(false);
  const [feedback, setFeedback] = useState<{ id: string; text: string; correct: boolean; turn: number } | null>(null);
  const motion = useLearningMotion();
  useEffect(() => { if (!feedback) return; const timer = setTimeout(() => setFeedback(null), 2300); return () => clearTimeout(timer); }, [feedback]);
  if (!scene) return null;
  return <div className="kb-scene-layer" data-motion={motion.canAnimate}>
    {scene.questions.map(item => <button key={item.id} className="kb-scene-question" style={regionStyle(item.rect)}
      aria-label={`Ask: ${item.text}`} aria-pressed={touched && question === item.id} onClick={() => { setQuestion(item.id); setTouched(true); setFeedback(null); speak(item.text); }} />)}
    {scene.answers.map(item => <button key={item.id} className="kb-scene-answer" style={regionStyle(item.rect)}
      aria-label={`Tap ${item.label} to answer the question`} data-feedback={feedback?.id === item.id ? feedback.correct ? "correct" : "retry" : undefined}
      onClick={() => { const reply=sceneReply(page,question,item.id); if (!reply) return; setFeedback({id:item.id,...reply,turn:Date.now()}); speak(reply.text); }}>
      {feedback?.id === item.id && <span key={feedback.turn} className="kb-scene-answer-bubble" lang="en">{feedback.text}<small lang="en">{feedback.correct ? "Say it together" : "Look again and try another picture."}</small></span>}
    </button>)}
    {feedback?.correct && motion.canAnimate && <CorrectCelebration key={feedback.turn} message={scene.questions.find(q=>q.id===question)?.correct ? "Found it!" : "Say it together"} />}
  </div>;
}
