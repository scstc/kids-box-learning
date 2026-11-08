// One-time build tool. Install the synthesizer in ignored artifacts, not the app:
// npm install --prefix artifacts/phonics-tools --no-save --no-package-lock @echogarden/espeak-ng-emscripten@0.3.5
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import createModule from "../artifacts/phonics-tools/node_modules/@echogarden/espeak-ng-emscripten/espeak-ng.js";
import { wordPronunciations, soundKey } from "../src/data/pronunciations.ts";

const module = await createModule({
  locateFile: (name) =>
    fileURLToPath(
      new URL(
        `../artifacts/phonics-tools/node_modules/@echogarden/espeak-ng-emscripten/${name}`,
        import.meta.url,
      ),
    ),
});
const voice = new module.eSpeakNGWorker();
if (voice.set_voice("en") !== 0)
  throw new Error("British English voice unavailable");
voice.set_rate(125);
voice.set_pitch(55);
const directory = new URL("../public/phonics-audio/", import.meta.url);
await mkdir(directory, { recursive: true });
const phonemes = {
  dʒ: "dZ",
  tʃ: "tS",
  ɑː: "A:",
  ɔː: "O:",
  ɜː: "3:",
  iː: "i:",
  uː: "u:",
  eɪ: "eI",
  aɪ: "aI",
  aʊ: "aU",
  əʊ: "@U",
  eə: "e@",
  ɪə: "I@",
  ɪ: "I",
  ʊ: "U",
  ə: "@",
  ɒ: "0",
  æ: "a",
  ʌ: "V",
  ŋ: "N",
  θ: "T",
  ð: "D",
  ʃ: "S",
  ʒ: "Z",
  ɡ: "g",
};
const tokens = Object.keys(phonemes).sort((a, b) => b.length - a.length);
function toEspeak(ipa) {
  let value = "";
  for (let index = 0; index < ipa.length;) {
    const token = tokens.find((item) => ipa.startsWith(item, index));
    if (token) {
      value += phonemes[token];
      index += token.length;
    } else {
      const character = ipa[index++];
      if (!/^[bdfhijklmnprstvwz e]$/.test(character))
        throw new Error(`Unmapped IPA: ${character} in ${ipa}`);
      value += character;
    }
  }
  return value;
}
const report = [];
for (const ipa of new Set(
  Object.values(wordPronunciations)
    .flatMap((word) => word.sounds)
    .filter(Boolean),
)) {
  const mnemonic = toEspeak(ipa);
  const chunks = [];
  voice.synthesize(`[[${mnemonic}]]`, (samples) => {
    chunks.push(
      Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength),
    );
    return false;
  });
  const pcm = Buffer.concat(chunks);
  if (pcm.length < 500) throw new Error(`Empty sound: ${ipa}`);
  const target = fileURLToPath(new URL(`${soundKey(ipa)}.mp3`, directory));
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-f",
      "s16le",
      "-ar",
      String(voice.get_samplerate()),
      "-ac",
      "1",
      "-i",
      "pipe:0",
      "-af",
      "silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.03,apad=pad_dur=0.12,loudnorm=I=-20:TP=-2:LRA=7",
      "-ar",
      "22050",
      "-b:a",
      "64k",
      target,
    ],
    { input: pcm },
  );
  if (result.status !== 0) throw new Error(result.stderr.toString());
  const mp3 = await readFile(target);
  if (mp3.length < 500) throw new Error(`Invalid MP3: ${ipa}`);
  report.push({
    ipa,
    mnemonic,
    file: `${soundKey(ipa)}.mp3`,
    samples: pcm.length / 2,
  });
}
await writeFile(
  new URL("../artifacts/phonics-generation.json", import.meta.url),
  JSON.stringify(report, null, 2),
);
console.log(`Generated ${report.length} British phonics demonstration clips.`);
process.exit(0);
