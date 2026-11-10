import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Pointer } from "lucide-react";
import "./recordingPointer.css";

type Mark = { x: number; y: number; phase: "pressed" | "released" | "fading" };

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
    const clearTimers = () => {
      cancelAnimationFrame(frame); frame = 0;
      clearTimeout(fade); clearTimeout(hide);
    };
    const clear = () => { clearTimers(); held = null; setMark(null); };
    const chooseHost = () => {
      // A body overlay is underneath modal dialogs, and the book hides #root.
      const dialogs = [...document.querySelectorAll<HTMLDialogElement>("dialog[open]")]
        .filter(dialog => getComputedStyle(dialog).display !== "none");
      const next = dialogs[dialogs.length - 1] ?? document.body;
      setHost(previous => previous === next ? previous : next);
    };
    const inside = (event: PointerEvent) => event.clientX >= 0 && event.clientX < innerWidth && event.clientY >= 0 && event.clientY < innerHeight;
    const down = (event: PointerEvent) => {
      if (event.pointerType === "pen") penSeen = Date.now();
      if (!event.isPrimary || (event.button !== 0 && !(event.pointerType === "pen" && (event.button === 5 || (event.buttons & 32))))) return;
      if (event.pointerType === "touch" && Date.now() - penSeen < 1500) return;
      if (held && held.id !== event.pointerId && !(event.pointerType === "pen" && held.type === "touch")) return;
      clearTimers();
      held = { id: event.pointerId, type: event.pointerType };
      chooseHost();
      setMark(inside(event) ? { x: event.clientX, y: event.clientY, phase: "pressed" } : null);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "pen") penSeen = Date.now();
      if (!held || held.id !== event.pointerId) return;
      cancelAnimationFrame(frame);
      const point = inside(event) ? { x: event.clientX, y: event.clientY, phase: "pressed" as const } : null;
      frame = requestAnimationFrame(() => { frame = 0; if (held?.id === event.pointerId) setMark(point); });
    };
    const up = (event: PointerEvent) => {
      if (event.pointerType === "pen") penSeen = Date.now();
      if (!held || held.id !== event.pointerId) return;
      clearTimers(); held = null;
      setMark(inside(event) ? { x: event.clientX, y: event.clientY, phase: "released" } : null);
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
    return () => {
      clearTimers(); observer.disconnect();
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", clear);
    };
  }, [enabled]);
  if (!enabled || !mark || !host) return null;
  return createPortal(<div className="kb-recording-pointer" aria-hidden="true" data-phase={mark.phase} style={{ left: mark.x, top: mark.y,
    "--pointer-flip-x": mark.x > innerWidth - 34 ? -1 : 1,
    "--pointer-flip-y": mark.y > innerHeight - 40 ? -1 : 1,
  } as CSSProperties}>
    <span className="kb-recording-contact" />
    <Pointer className="kb-recording-finger" size={36} strokeWidth={1.7} />
  </div>, host);
}
