import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./recordingPointer.css";

type Point = { x: number; y: number };
type Mark = Point & { points: Point[]; phase: "pressed" | "released" | "fading" };
const maximumPoints = 240;
const minimumDistance = 3;

export default function RecordingPointer({ enabled }: { enabled: boolean }) {
  const [mark, setMark] = useState<Mark | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!enabled) { setMark(null); setHost(null); return; }
    let held: { id: number; type: string } | null = null;
    let penSeen = 0;
    let frame = 0;
    let fade = 0;
    let hide = 0;
    let points: Point[] = [];
    let position: Point | null = null;
    const clearTimers = () => {
      cancelAnimationFrame(frame); frame = 0;
      clearTimeout(fade); clearTimeout(hide);
    };
    const clear = () => { clearTimers(); held = null; points = []; position = null; setMark(null); };
    const chooseHost = () => {
      // A body overlay is underneath modal dialogs, and the book hides #root.
      const dialogs = [...document.querySelectorAll<HTMLDialogElement>("dialog[open]")]
        .filter(dialog => getComputedStyle(dialog).display !== "none");
      const next = dialogs[dialogs.length - 1] ?? document.body;
      setHost(previous => previous === next ? previous : next);
    };
    const inside = (event: PointerEvent) => event.clientX >= 0 && event.clientX < innerWidth && event.clientY >= 0 && event.clientY < innerHeight;
    const append = (event: PointerEvent) => {
      if (!inside(event)) { points = []; position = null; return; }
      const add = (sample: PointerEvent) => {
        if (!inside(sample)) { points = []; return; }
        const next = { x: sample.clientX, y: sample.clientY };
        const last = points.at(-1);
        if (!last || Math.hypot(next.x - last.x, next.y - last.y) >= minimumDistance) {
          points.push(next);
          if (points.length > maximumPoints) points.splice(0, points.length - maximumPoints);
        }
      };
      for (const sample of event.getCoalescedEvents?.() ?? []) add(sample);
      add(event);
      position = { x: event.clientX, y: event.clientY };
    };
    const show = (phase: Mark["phase"]) => {
      if (!position) { setMark(null); return; }
      const last = points.at(-1);
      const trail = last?.x === position.x && last.y === position.y ? points : [...points, position];
      setMark({ ...position, points: trail.slice(-maximumPoints), phase });
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "pen") penSeen = Date.now();
      if (!event.isPrimary || (event.button !== 0 && !(event.pointerType === "pen" && (event.button === 5 || (event.buttons & 32))))) return;
      if (event.pointerType === "touch" && Date.now() - penSeen < 1500) return;
      if (held && held.id !== event.pointerId && !(event.pointerType === "pen" && held.type === "touch")) return;
      clearTimers();
      held = { id: event.pointerId, type: event.pointerType };
      points = []; position = null;
      chooseHost();
      append(event); show("pressed");
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "pen") penSeen = Date.now();
      if (!held || held.id !== event.pointerId) return;
      append(event);
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; if (held?.id === event.pointerId) show("pressed"); });
    };
    const up = (event: PointerEvent) => {
      if (event.pointerType === "pen") penSeen = Date.now();
      if (!held || held.id !== event.pointerId) return;
      clearTimers(); held = null;
      append(event); show("released");
      fade = window.setTimeout(() => setMark(previous => previous ? { ...previous, phase: "fading" } : null), 550);
      hide = window.setTimeout(() => setMark(null), 750);
    };
    const cancel = (event: PointerEvent) => { if (held?.id === event.pointerId) clear(); };
    const visibility = () => { if (document.hidden) clear(); };
    const observer = new MutationObserver(chooseHost);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
    chooseHost();
    // Observe only; the book keeps its own click handlers and pointer capture.
    document.addEventListener("pointerdown", down, { capture: true, passive: true });
    document.addEventListener("pointermove", move, { capture: true, passive: true });
    document.addEventListener("pointerup", up, { capture: true, passive: true });
    document.addEventListener("pointercancel", cancel, { capture: true, passive: true });
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", clear);
    window.addEventListener("resize", clear);
    return () => {
      clearTimers(); observer.disconnect();
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", clear);
      window.removeEventListener("resize", clear);
    };
  }, [enabled]);
  if (!enabled || !mark || !host) return null;
  const trail = mark.points.map(point => `${point.x},${point.y}`).join(" ");
  return createPortal(<svg className="kb-recording-pointer" aria-hidden="true" data-phase={mark.phase}>
    {mark.points.length > 1 && <>
      <polyline className="kb-recording-trail-halo" points={trail} />
      <polyline className="kb-recording-trail" points={trail} />
    </>}
    <circle className="kb-recording-contact-halo" cx={mark.x} cy={mark.y} r={12} />
    <circle className="kb-recording-contact" cx={mark.x} cy={mark.y} r={12} />
  </svg>, host);
}
