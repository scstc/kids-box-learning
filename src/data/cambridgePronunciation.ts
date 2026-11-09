import catalog from "./cambridgePronunciation.json";

export type RecordedWordGuide = {
  ipa: string;
  sounds: string[];
  sourcePage: string | null;
  audio: string | null;
  source: "dictionary" | "practice";
};

export const recordedWords = catalog.words as Record<string, RecordedWordGuide>;
const recordedSounds = catalog.sounds as Record<string, { file: string; example: string }>;

// Callers supply the existing stable vocabulary key; names have no guide.
export function recordedWordGuide(id: string): RecordedWordGuide | undefined {
  return Object.hasOwn(recordedWords, id) ? recordedWords[id] : undefined;
}

export function recordedSoundPath(ipa: string): string {
  const sound = recordedSounds[ipa];
  if (!sound) throw new Error(`Missing recorded Cambridge sound: /${ipa}/`);
  return sound.file;
}
