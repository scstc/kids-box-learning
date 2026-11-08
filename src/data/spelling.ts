// Ignore case, spaces and the textbook's hyphens; other characters remain errors.
export function matchesSpelling(answer: string, word: string): boolean {
  const normalize = (value: string) =>
    value.trim().toLowerCase().replace(/[\s-]/g, "");
  return normalize(answer) === normalize(word);
}
