import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { createPortal } from "react-dom";
import { Check, Move, Plus, Volume2 } from "lucide-react";
import type { PlacementQuestion } from "../data/checkActivities";
import type { CourseAudio } from "../hooks/useCourseAudio";
import WordArt from "./WordArt";
import "./listenPlace.css";

type Props = {
  question: PlacementQuestion;
  audio: CourseAudio;
  solved: boolean;
  onAttempt: (correct: boolean) => void;
};
type Relation = PlacementQuestion["relation"];
type MovingPicture = { id: string; x: number; y: number; over: Relation | null };
const locations: { relation: Relation; label: string }[] = [
  { relation: "on", label: "on" },
  { relation: "under", label: "under" },
  { relation: "next-to", label: "next to" },
];

export default function ListenPlace(props: Props) {
  return <PlacementRound key={props.question.id} {...props} />;
}

function PlacementRound({ question, audio, solved, onAttempt }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [moving, setMoving] = useState<MovingPicture | null>(null);
  const [placed, setPlaced] = useState<{ id: string; relation: Relation } | null>(null);
  const targets = useRef<Record<Relation, HTMLButtonElement | null>>({ on: null, under: null, "next-to": null });
  const pointer = useRef<{ id: number; pictureId: string; startX: number; startY: number; dragging: boolean } | null>(null);
  const ignoreClick = useRef(false);
  const picture = question.items.find(item => item.id === (moving?.id ?? selected));

  const locationAt = (x: number, y: number) => locations.find(({ relation }) => {
    const bounds = targets.current[relation]?.getBoundingClientRect();
    return bounds && x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
  })?.relation ?? null;

  const place = (id: string, relation: Relation) => {
    if (solved) return;
    const correct = id === question.answerId && relation === question.relation;
    setSelected(null);
    setPlaced(correct ? { id, relation } : null);
    onAttempt(correct);
  };
  const start = (event: PointerEvent<HTMLButtonElement>, id: string) => {
    if (solved || pointer.current || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    ignoreClick.current = false;
    pointer.current = { id: event.pointerId, pictureId: id, startX: event.clientX, startY: event.clientY, dragging: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId || solved) return;
    if (!current.dragging && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 8) return;
    current.dragging = true;
    setSelected(null);
    setMoving({ id: current.pictureId, x: event.clientX, y: event.clientY, over: locationAt(event.clientX, event.clientY) });
  };
  const finish = (event: PointerEvent<HTMLButtonElement>) => {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setMoving(null);
    if (!current.dragging) return;
    ignoreClick.current = true;
    const destination = locationAt(event.clientX, event.clientY);
    if (destination) place(current.pictureId, destination);
  };
  const cancel = (event?: PointerEvent<HTMLButtonElement>) => {
    if (!pointer.current || (event && event.pointerId !== pointer.current.id)) return;
    pointer.current = null;
    ignoreClick.current = true;
    setMoving(null);
    setSelected(null);
  };

  return <div className="kb-listen-place" onKeyDown={event => {
    if (event.key === "Escape") { cancel(); setSelected(null); }
  }}>
    <p className="kb-place-instructions"><Move size={19} aria-hidden="true" />Drag a picture to a dotted space. You can also tap a picture, then tap a space.</p>
    <div className="kb-place-bank" role="group" aria-label="Pictures to move">
      {question.items.map(item => <div key={item.id} className={`kb-place-card${selected === item.id ? " is-selected" : ""}${moving?.id === item.id ? " is-moving" : ""}`}>
        <button className="kb-place-picture" disabled={solved} aria-label={`Choose ${item.en} to move`} aria-pressed={selected === item.id}
          onPointerDown={event => start(event, item.id)} onPointerMove={move} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={cancel}
          onDragStart={event => event.preventDefault()}
          onClick={event => {
            if (ignoreClick.current && (event.detail !== 0 || ("pointerType" in event.nativeEvent && !!event.nativeEvent.pointerType))) { ignoreClick.current = false; return; }
            ignoreClick.current = false;
            setSelected(current => current === item.id ? null : item.id);
          }}>
          <WordArt id={item.id} unitId={question.unitId} className="kb-place-art" />
          <span>{item.en}</span>
        </button>
        <button className="kb-place-speaker" aria-label={`Listen to ${item.en}`} aria-pressed={audio.playingText === item.en}
          onClick={() => void audio.play(item.en)}><Volume2 size={21} aria-hidden="true" /></button>
      </div>)}
    </div>
    <div className={`kb-place-stage kb-place-stage-${question.anchorId}${moving || selected ? " has-picture" : ""}`} aria-label={`Move a picture around the ${question.anchorId}`}>
      <div className="kb-place-scene">
      <div className="kb-place-anchor" role="img" aria-label={`The ${question.anchorId}`}>
        <WordArt id={question.anchorId} unitId={2} className="kb-place-anchor-art" />
      </div>
      {locations.map(({ relation, label }) => {
        const isPlaced = placed?.relation === relation;
        return <button key={relation} ref={node => { targets.current[relation] = node; }} data-place-target={relation}
          className={`kb-place-target kb-place-target-${relation}${moving?.over === relation ? " is-over" : ""}${isPlaced ? " is-placed" : ""}`}
          aria-label={`Place ${picture ? `the ${picture.en}` : "a picture"} ${label} the ${question.anchorId}`}
          disabled={solved || (!selected && !moving)}
          onClick={() => { if (selected) place(selected, relation); }}>
          {isPlaced && placed ? <WordArt id={placed.id} unitId={question.unitId} className="kb-place-dropped-art" /> : <Plus size={24} aria-hidden="true" />}
          <span>{label}</span>{isPlaced && <Check className="kb-place-check" size={20} aria-hidden="true" />}
        </button>;
      })}
      </div>
    </div>
    <p className="kb-place-selection" role="status" aria-live="polite">{solved ? "The picture is in the right place!" : moving ? `Moving ${picture?.en ?? "the picture"}.` : selected ? `${picture?.en} selected. Tap a space to place it.` : "Choose a picture to begin."}</p>
    {moving && createPortal(<div className="kb-place-drag-preview" style={{ left: moving.x, top: moving.y }} aria-hidden="true">
      <WordArt id={moving.id} unitId={question.unitId} className="kb-place-proxy-art" />
    </div>, document.body)}
  </div>;
}
