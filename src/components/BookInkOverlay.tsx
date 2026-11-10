import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Eraser } from "lucide-react";
import { eraseInkStrokes, inkPageRatio, normalizedInkPoint, type InkPoint, type InkStroke } from "../data/bookInk";
import type { InkPreferences } from "../data/bookInkPreferences";
import type { BookInk } from "../hooks/useBookInk";

export type InkTool = "pen" | "eraser";
export type BookAnnotation = { ink: BookInk; writing: boolean; tool: InkTool; preferences: InkPreferences };
type Gesture = { id: number; pointerType: string; tool: InkTool; stroke: InkStroke; base: InkStroke[]; next: InkStroke[]; last: InkPoint };
type EraserPointer = { id: number; point: InkPoint; scale: number };

function Stroke({ stroke }: { stroke: InkStroke }) {
  if (stroke.points.length === 1) return <circle data-ink-stroke="" cx={stroke.points[0].x * 1000} cy={stroke.points[0].y * inkPageRatio * 1000} r={stroke.width * 500} fill={stroke.color} />;
  return <polyline data-ink-stroke="" points={stroke.points.map(point => `${point.x * 1000},${point.y * inkPageRatio * 1000}`).join(" ")} fill="none" stroke={stroke.color} strokeWidth={stroke.width * 1000} strokeLinecap="round" strokeLinejoin="round" />;
}

function EraserCursor({ point, scale }: EraserPointer) {
  const x = point.x * 1000;
  const y = point.y * inkPageRatio * 1000;
  const badgeX = Math.max(0, Math.min(1000 - 30 * scale, x + 18 * scale));
  const badgeY = Math.max(0, Math.min(inkPageRatio * 1000 - 30 * scale, y - 36 * scale));
  return <g data-eraser-cursor="" aria-hidden="true" pointerEvents="none">
    <circle cx={x} cy={y} r={14 * scale} fill="var(--primary-soft)" fillOpacity={0.35} stroke="var(--surface)" strokeWidth={4 * scale} />
    <circle cx={x} cy={y} r={14 * scale} fill="none" stroke="var(--primary)" strokeWidth={1.5 * scale} />
    <rect x={badgeX} y={badgeY} width={30 * scale} height={30 * scale} rx={7 * scale} fill="var(--surface)" stroke="var(--primary-soft-border)" strokeWidth={scale} />
    <Eraser x={badgeX + 5 * scale} y={badgeY + 5 * scale} width={20 * scale} height={20 * scale} color="var(--primary-dark)" />
  </g>;
}

export default function BookInkOverlay({ ink, writing, tool, preferences }: BookAnnotation) {
  const surface = useRef<SVGSVGElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const penSeen = useRef(0);
  const [preview, setPreview] = useState<InkStroke[] | null>(null);
  const [eraserPointer, setEraserPointer] = useState<EraserPointer | null>(null);
  const enabled = writing && ink.status !== "loading" && ink.status !== "load-error";
  const cancel = () => {
    const active = gesture.current;
    gesture.current = null;
    if (active && surface.current?.hasPointerCapture(active.id)) surface.current.releasePointerCapture(active.id);
    setPreview(null);
    setEraserPointer(null);
  };
  useEffect(() => { cancel(); }, [enabled, tool, ink.strokes, preferences.color, preferences.width]);

  const moveEraser = (event: ReactPointerEvent<SVGSVGElement>, erasing: boolean) => {
    if (gesture.current && gesture.current.id !== event.pointerId) return;
    if (!enabled || !erasing || !event.isPrimary || (event.pointerType === "touch" && !gesture.current)) {
      setEraserPointer(null);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      setEraserPointer(null);
      return;
    }
    setEraserPointer({ id: event.pointerId, point: normalizedInkPoint(event.clientX, event.clientY, bounds), scale: 1000 / bounds.width });
  };

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
    aria-label={`Handwriting on page ${ink.page}`} role="img" data-writing={enabled || undefined} data-tool={tool} data-eraser-active={!!eraserPointer || undefined}
    onContextMenu={event => { if (writing) event.preventDefault(); }}
    onClick={event => { if (writing) { event.preventDefault(); event.stopPropagation(); } }}
    onPointerEnter={event => { if (event.pointerType === "pen") penSeen.current = Date.now(); moveEraser(event, tool === "eraser"); }}
    onPointerLeave={event => { if (!gesture.current || gesture.current.id === event.pointerId) setEraserPointer(null); }}
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
        stroke: { id: globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, color: preferences.color, width: preferences.width, points: [point] } };
      event.currentTarget.setPointerCapture(event.pointerId);
      moveEraser(event, activeTool === "eraser");
      setPreview(activeTool === "eraser" ? next : [...ink.strokes, gesture.current.stroke]);
    }}
    onPointerMove={event => {
      if (event.pointerType === "pen") penSeen.current = Date.now();
      moveEraser(event, (gesture.current?.tool ?? tool) === "eraser" || (event.pointerType === "pen" && !!(event.buttons & 32)));
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
      if (event.pointerType === "touch" || tool !== "eraser") setEraserPointer(null);
    }}
    onPointerCancel={event => { if (event.pointerType === "pen") penSeen.current = Date.now(); if (gesture.current?.id === event.pointerId) cancel(); else setEraserPointer(previous => previous?.id === event.pointerId ? null : previous); }}
    onLostPointerCapture={event => { if (gesture.current?.id === event.pointerId) cancel(); }}>
    {(preview ?? ink.strokes).map(stroke => <Stroke key={stroke.id} stroke={stroke} />)}
    {enabled && eraserPointer && <EraserCursor {...eraserPointer} />}
  </svg>;
}
