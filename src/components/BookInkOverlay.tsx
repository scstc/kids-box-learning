import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { eraseInkStrokes, inkPageRatio, normalizedInkPoint, type InkPoint, type InkStroke } from "../data/bookInk";
import type { BookInk } from "../hooks/useBookInk";

export type InkTool = "pen" | "eraser";
export type BookAnnotation = { ink: BookInk; writing: boolean; tool: InkTool };
type Gesture = { id: number; pointerType: string; tool: InkTool; stroke: InkStroke; base: InkStroke[]; next: InkStroke[]; last: InkPoint };

function Stroke({ stroke }: { stroke: InkStroke }) {
  if (stroke.points.length === 1) return <circle cx={stroke.points[0].x * 1000} cy={stroke.points[0].y * inkPageRatio * 1000} r={stroke.width * 500} fill={stroke.color} />;
  return <polyline points={stroke.points.map(point => `${point.x * 1000},${point.y * inkPageRatio * 1000}`).join(" ")} fill="none" stroke={stroke.color} strokeWidth={stroke.width * 1000} strokeLinecap="round" strokeLinejoin="round" />;
}

export default function BookInkOverlay({ ink, writing, tool }: BookAnnotation) {
  const surface = useRef<SVGSVGElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const penSeen = useRef(0);
  const [preview, setPreview] = useState<InkStroke[] | null>(null);
  const enabled = writing && ink.status !== "loading" && ink.status !== "load-error";
  const cancel = () => {
    const active = gesture.current;
    gesture.current = null;
    if (active && surface.current?.hasPointerCapture(active.id)) surface.current.releasePointerCapture(active.id);
    setPreview(null);
  };
  useEffect(() => { cancel(); }, [enabled, tool, ink.strokes]);

  const append = (event: ReactPointerEvent<SVGSVGElement>) => {
    const active = gesture.current;
    if (!active || active.id !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const samples = event.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const sample of samples.length ? samples : [event.nativeEvent]) {
      const point = normalizedInkPoint(sample.clientX, sample.clientY, bounds);
      if (active.tool === "eraser") active.next = eraseInkStrokes(active.next, active.last, point, 14 / bounds.width);
      else if (Math.hypot(point.x - active.last.x, (point.y - active.last.y) * inkPageRatio) > 0.0003) active.stroke.points.push(point);
      active.last = point;
    }
    setPreview(active.tool === "eraser" ? active.next : [...active.base, { ...active.stroke, points: [...active.stroke.points] }]);
  };

  return <svg ref={surface} className="kb-book-ink" viewBox={`0 0 1000 ${inkPageRatio * 1000}`} preserveAspectRatio="none"
    aria-label={`Handwriting on page ${ink.page}`} role="img" data-writing={enabled || undefined} data-tool={tool}
    onContextMenu={event => { if (writing) event.preventDefault(); }}
    onClick={event => { if (writing) { event.preventDefault(); event.stopPropagation(); } }}
    onPointerEnter={event => { if (event.pointerType === "pen") penSeen.current = Date.now(); }}
    onPointerDown={event => {
      if (!enabled) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.pointerType === "pen") penSeen.current = Date.now();
      if (!event.isPrimary || (event.pointerType === "touch" && Date.now() - penSeen.current < 1500)) return;
      if (gesture.current) {
        if (event.pointerType !== "pen" || gesture.current.pointerType === "pen") return;
        cancel();
      }
      if (event.button !== 0 && !(event.pointerType === "pen" && (event.button === 5 || (event.buttons & 32)))) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const point = normalizedInkPoint(event.clientX, event.clientY, bounds);
      const activeTool = event.pointerType === "pen" && (event.button === 5 || (event.buttons & 32)) ? "eraser" : tool;
      const next = activeTool === "eraser" ? eraseInkStrokes(ink.strokes, point, point, 14 / bounds.width) : ink.strokes;
      gesture.current = { id: event.pointerId, pointerType: event.pointerType, tool: activeTool, base: ink.strokes, next, last: point,
        stroke: { id: globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, color: "#6941c6", width: 0.0032, points: [point] } };
      event.currentTarget.setPointerCapture(event.pointerId);
      setPreview(activeTool === "eraser" ? next : [...ink.strokes, gesture.current.stroke]);
    }}
    onPointerMove={event => {
      if (event.pointerType === "pen") penSeen.current = Date.now();
      if (gesture.current?.id === event.pointerId) { event.preventDefault(); event.stopPropagation(); append(event); }
    }}
    onPointerUp={event => {
      if (event.pointerType === "pen") penSeen.current = Date.now();
      const active = gesture.current;
      if (!active || active.id !== event.pointerId) return;
      event.preventDefault();
      event.stopPropagation();
      append(event);
      gesture.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      ink.commit(active.tool === "eraser" ? active.next : [...active.base, active.stroke]);
      setPreview(null);
    }}
    onPointerCancel={event => { if (event.pointerType === "pen") penSeen.current = Date.now(); if (gesture.current?.id === event.pointerId) cancel(); }}
    onLostPointerCapture={event => { if (gesture.current?.id === event.pointerId) cancel(); }}>
    {(preview ?? ink.strokes).map(stroke => <Stroke key={stroke.id} stroke={stroke} />)}
  </svg>;
}
