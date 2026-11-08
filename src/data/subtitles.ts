export type SubtitleWord = { start: number; end: number; text: string };
export type SubtitleCue = { start: number; end: number; text: string; words?: SubtitleWord[] };
export type SubtitleDocument = { source: "automatic"; model: string; pipeline?: string; language: "en"; duration: number; cues: SubtitleCue[] };

export function activeSubtitle(cues: readonly SubtitleCue[], time: number): SubtitleCue | undefined {
  let low = 0, high = cues.length - 1;
  while (low <= high) {
    const middle = (low + high) >>> 1;
    const cue = cues[middle];
    if (time < cue.start) high = middle - 1;
    else if (time >= cue.end) low = middle + 1;
    else return cue;
  }
}

// A small reading lead offsets display latency; brief word gaps should not flash blank.
export function visibleSubtitle(cues: readonly SubtitleCue[], time: number): SubtitleCue | undefined {
  return activeSubtitle(cues, time) ?? activeSubtitle(cues, time + .12) ?? activeSubtitle(cues, time - .3);
}
