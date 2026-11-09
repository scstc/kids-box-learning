import { allWordEntries, audioKey } from "./course.ts";
import { soundKey } from "./pronunciations.ts";
import { starterLetters, starterSounds } from "./starter.ts";

// Starter examples outside the course vocabulary use the natural word voice.
const extraExamples: Record<string, string> = {
  pure: "pjʊə",
  television: "ˈtelɪvɪʒən",
  toy: "tɔɪ",
};
export const practiceWords = [...new Map([
  ...allWordEntries.map(({ word }) => [word.id, { text: word.en, ipa: word.ipa }] as const),
  ...Object.entries(extraExamples).map(([text, ipa]) => [audioKey(text), { text, ipa }] as const),
]).values()];
const wordKeys = new Set(practiceWords.map(({ text }) => audioKey(text)));

export function wordAudioPath(text: string): string {
  const key = audioKey(text);
  return `${wordKeys.has(key) ? "word-audio" : "course-audio"}/${key}.mp3`;
}

export function soundAudioPath(ipa: string): string {
  return `phonics-audio/${soundKey(ipa)}.mp3`;
}

// Shared by the offline renderer and coverage tests; silent chunks are excluded.
export function practiceAudioItems() {
  const sounds = new Set([
    ...allWordEntries.flatMap(({ word }) => word.sounds).filter(Boolean),
    ...starterLetters.map(({ ipa }) => ipa),
    ...starterSounds.map(({ ipa }) => ipa),
  ]);
  return [
    ...practiceWords.map(({ text, ipa }) => ({ kind: "word" as const, text, ipa, path: wordAudioPath(text) })),
    ...[...sounds].map(ipa => {
      const letter = starterLetters.find(item => item.ipa === ipa);
      return { kind: letter ? "letter" as const : "phonics" as const,
        text: letter?.letter ?? ipa, ipa, path: soundAudioPath(ipa) };
    }),
  ];
}
