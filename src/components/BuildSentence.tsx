import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { createPortal } from "react-dom";
import { Check, Grip, RotateCcw, Undo2, Volume2, X } from "lucide-react";
import { shuffled } from "../data/course";
import type { SentenceQuestion } from "../data/checkActivities";
import type { CourseAudio } from "../hooks/useCourseAudio";
import "./sentenceChecks.css";

type Props = {
  question: SentenceQuestion;
  audio: CourseAudio;
  solved: boolean;
  onAttempt: (correct: boolean) => void;
};
type Tile = { id: number; text: string };
type Drag = { pointerId: number; tile: Tile; startX: number; startY: number; moved: boolean };

export default function BuildSentence({ question, audio, solved, onAttempt }: Props) {
  const [tiles] = useState(() => shuffled([
    ...question.answer, ...(question.distractors ?? []),
  ].map((text, id) => ({ id, text }))));
  const [selected, setSelected] = useState<number[]>([]);
  const [needsChange, setNeedsChange] = useState(false);
  const [ghost, setGhost] = useState<{ text: string; x: number; y: number } | null>(null);
  const [overAnswer, setOverAnswer] = useState(false);
  const answerArea = useRef<HTMLDivElement>(null);
  const dragging = useRef<Drag | null>(null);
  const ignoreClick = useRef(false);
  const chosen = selected.map(id => tiles.find(tile => tile.id === id)!);

  const add = (id: number) => {
    if (solved) return;
    setSelected(current => current.includes(id) ? current : [...current, id]);
    setNeedsChange(false);
  };
  const remove = (id: number) => {
    if (solved) return;
    setSelected(current => current.filter(value => value !== id));
    setNeedsChange(false);
  };
  const insideAnswer = (x: number, y: number) => {
    const rect = answerArea.current?.getBoundingClientRect();
    return !!rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  const startDrag = (event: PointerEvent<HTMLButtonElement>, tile: Tile) => {
    if (solved || dragging.current || !event.isPrimary || event.button !== 0) return;
    ignoreClick.current = false;
    dragging.current = { pointerId: event.pointerId, tile, startX: event.clientX, startY: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const active = dragging.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - active.startX, event.clientY - active.startY) > 8) active.moved = true;
    if (!active.moved) return;
    setGhost({ text: active.tile.text, x: event.clientX, y: event.clientY });
    setOverAnswer(insideAnswer(event.clientX, event.clientY));
  };
  const finishDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const active = dragging.current;
    if (!active || active.pointerId !== event.pointerId) return;
    dragging.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (active.moved) {
      ignoreClick.current = true;
      if (insideAnswer(event.clientX, event.clientY)) add(active.tile.id);
      event.preventDefault();
    }
    setGhost(null);
    setOverAnswer(false);
  };
  const cancelDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current || dragging.current.pointerId !== event.pointerId) return;
    dragging.current = null;
    ignoreClick.current = true;
    setGhost(null);
    setOverAnswer(false);
  };
  const check = () => {
    if (solved || !chosen.length) return;
    const correct = chosen.length === question.answer.length && chosen.every((tile, index) => tile.text === question.answer[index]);
    setNeedsChange(!correct);
    onAttempt(correct);
    if (correct) void audio.play(question.sentence);
  };

  return <section className="kb-sentence-build" aria-label="Build the sentence">
    <p className="kb-sc-instruction"><Grip size={18} aria-hidden="true" />Tap the cards in order, or drag them into your sentence.</p>
    <div ref={answerArea} className={`kb-sc-answer-area${overAnswer ? " is-over" : ""}${solved ? " is-solved" : ""}${needsChange ? " needs-change" : ""}`} aria-label="Your sentence">
      <span className="kb-sc-area-title">Your sentence</span>
      <div className="kb-sc-selected-tiles">
        {chosen.length ? chosen.map((tile, index) => <div className="kb-sc-tile is-selected" key={tile.id}>
          <button className="kb-sc-tile-word" disabled={solved} aria-label={`Remove card ${index + 1}: ${tile.text}`} onClick={() => remove(tile.id)}>
            <span>{tile.text}</span>{!solved && <X size={16} aria-hidden="true" />}
          </button>
          <button className="kb-sc-speaker" aria-label={`Listen to your card ${index + 1}: ${tile.text}`} aria-pressed={audio.playingText === tile.text} onClick={() => void audio.play(tile.text)}><Volume2 size={20} aria-hidden="true" /></button>
        </div>) : <p className="kb-sc-empty">Your sentence starts here.</p>}
      </div>
    </div>
    <div className="kb-sc-tile-bank" role="group" aria-label="Sentence cards">
      {tiles.map((tile, index) => <div className={`kb-sc-tile${selected.includes(tile.id) ? " is-used" : ""}`} key={tile.id}>
        <button className="kb-sc-tile-word kb-sc-draggable" disabled={solved || selected.includes(tile.id)} aria-label={`Add card ${index + 1}: ${tile.text}`}
          onPointerDown={event => startDrag(event, tile)} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}
          onClick={event => {
            const pointerClick = event.detail !== 0 || ("pointerType" in event.nativeEvent && !!event.nativeEvent.pointerType);
            if (ignoreClick.current && pointerClick) { ignoreClick.current = false; return; }
            ignoreClick.current = false;
            add(tile.id);
          }}><span>{tile.text}</span><Grip size={16} aria-hidden="true" /></button>
        <button className="kb-sc-speaker" aria-label={`Listen to card ${index + 1}: ${tile.text}`} aria-pressed={audio.playingText === tile.text} onClick={() => void audio.play(tile.text)}><Volume2 size={20} aria-hidden="true" /></button>
      </div>)}
    </div>
    <div className="kb-sc-tools">
      <button className="kb-btn kb-btn-secondary" disabled={solved || !selected.length} onClick={() => { setSelected(current => current.slice(0, -1)); setNeedsChange(false); }}><Undo2 size={18} aria-hidden="true" />Undo</button>
      <button className="kb-btn kb-btn-secondary" disabled={solved || !selected.length} onClick={() => { setSelected([]); setNeedsChange(false); }}><RotateCcw size={18} aria-hidden="true" />Clear sentence</button>
      {!solved && <button className="kb-btn" disabled={!selected.length} onClick={check}><Check size={19} aria-hidden="true" />Check sentence</button>}
      {solved && <button className="kb-btn" onClick={() => void audio.play(question.sentence)}><Volume2 size={19} aria-hidden="true" />Hear your sentence</button>}
    </div>
    {ghost && createPortal(<div className="kb-sc-drag-ghost" aria-hidden="true" style={{ left: ghost.x, top: ghost.y }}>{ghost.text}</div>, document.body)}
  </section>;
}
