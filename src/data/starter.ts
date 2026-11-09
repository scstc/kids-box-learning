export const starterLetters = [
  ["A", "eɪ"], ["B", "biː"], ["C", "siː"], ["D", "diː"], ["E", "iː"], ["F", "ef"],
  ["G", "dʒiː"], ["H", "eɪtʃ"], ["I", "aɪ"], ["J", "dʒeɪ"], ["K", "keɪ"], ["L", "el"],
  ["M", "em"], ["N", "en"], ["O", "əʊ"], ["P", "piː"], ["Q", "kjuː"], ["R", "ɑː"],
  ["S", "es"], ["T", "tiː"], ["U", "juː"], ["V", "viː"], ["W", "dʌbəljuː"], ["X", "eks"],
  ["Y", "waɪ"], ["Z", "zed"],
].map(([letter, ipa]) => ({ letter, ipa }));

export type StarterSound = { ipa: string; example: string; group: string };
const group = (name: string, pairs: string[][]): StarterSound[] => pairs.map(([ipa, example]) => ({ ipa, example, group: name }));
// A traditional 44-sound British English starter chart. /ʊə/ can merge with /ɔː/
// in contemporary accents, so examples never claim every speaker sounds alike.
export const starterSounds: StarterSound[] = [
  ...group("Short vowels", [["ɪ", "fish"], ["e", "red"], ["æ", "cat"], ["ɒ", "dog"], ["ʊ", "book"], ["ʌ", "bus"], ["ə", "banana"]]),
  ...group("Long vowels", [["iː", "green"], ["ɑː", "car"], ["ɔː", "ball"], ["uː", "blue"], ["ɜː", "bird"]]),
  ...group("Gliding vowels", [["eɪ", "train"], ["aɪ", "bike"], ["ɔɪ", "toy"], ["əʊ", "boat"], ["aʊ", "mouse"], ["ɪə", "ear"], ["eə", "chair"], ["ʊə", "pure"]]),
  ...group("Consonants", [["p", "pen"], ["b", "bag"], ["t", "ten"], ["d", "dog"], ["k", "cat"], ["ɡ", "green"], ["f", "fish"], ["v", "five"], ["θ", "three"], ["ð", "mother"], ["s", "snake"], ["z", "nose"], ["ʃ", "shirt"], ["ʒ", "television"], ["tʃ", "chair"], ["dʒ", "jacket"], ["m", "monkey"], ["n", "nose"], ["ŋ", "sing"], ["h", "house"], ["l", "leg"], ["r", "red"], ["j", "yellow"], ["w", "window"]]),
];
