import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CourseUnit } from "../data/course";
import { entryKey } from "../data/course";
import WordArt from "./WordArt";
import "./wordExplorer.css";

export default function WordExplorerPicker({ unit, index, learned, onSelect }: {
  unit: CourseUnit;
  index: number;
  learned: string[];
  onSelect: (index: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = useRef<HTMLButtonElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const word = unit.words[index];
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };
  const choose = (next: number) => {
    close();
    onSelect(next);
  };
  return <nav className="kb-explorer-picker" aria-label="Word explorer navigation">
    <button className="kb-explorer-step" aria-label="Previous word" disabled={index === 0} onClick={() => onSelect(index - 1)}><ChevronLeft size={22} aria-hidden="true" /></button>
    <button ref={trigger} className="kb-explorer-current" aria-label={`Choose a word, current word ${word.en}`} aria-haspopup="dialog" aria-expanded={open} aria-controls="kb-explorer-word-list"
      onClick={() => {
        dialog.current?.showModal();
        setOpen(true);
        selected.current?.focus({ preventScroll: true });
        const choice = selected.current, list = grid.current;
        if (choice && list) list.scrollTop += choice.getBoundingClientRect().top - list.getBoundingClientRect().top - (list.clientHeight - choice.clientHeight) / 2;
      }}>
      <WordArt id={word.id} unitId={unit.id} />
      <span className="kb-explorer-current-copy"><small>Choose a word</small><strong lang="en">{word.en}</strong></span>
      <span className="kb-explorer-position">{index + 1} / {unit.words.length}</span><ChevronDown size={19} aria-hidden="true" />
    </button>
    <button className="kb-explorer-step" aria-label="Next word" disabled={index === unit.words.length - 1} onClick={() => onSelect(index + 1)}><ChevronRight size={22} aria-hidden="true" /></button>
    <dialog ref={dialog} id="kb-explorer-word-list" className="kb-explorer-dialog" aria-labelledby="kb-explorer-title" aria-describedby="kb-explorer-help"
      onClose={() => setOpen(false)}
      onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      }}>
      <header className="kb-explorer-dialog-heading"><div><span>UNIT {String(unit.id).padStart(2, "0")} · {unit.words.length} WORDS</span><h2 id="kb-explorer-title">Words in this unit</h2></div>
        <button aria-label="Close word picker" onClick={close}><X size={22} aria-hidden="true" /></button></header>
      <p id="kb-explorer-help">Pick a picture. Explore its word.</p>
      <div ref={grid} className="kb-explorer-word-grid">
        {unit.words.map((item, itemIndex) => <button key={item.id} ref={itemIndex === index ? selected : undefined}
          aria-label={`Learn ${item.en}`} aria-pressed={index === itemIndex} onClick={() => choose(itemIndex)}>
          <WordArt id={item.id} unitId={unit.id} /><strong lang="en">{item.en}</strong>
          {learned.includes(entryKey({ unitId: unit.id, word: item })) && <span className="kb-explorer-learned" aria-label="Explored"><Check size={15} aria-hidden="true" /></span>}
        </button>)}
      </div>
    </dialog>
  </nav>;
}
