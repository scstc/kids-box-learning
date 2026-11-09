// Build-only tools. Nothing here runs in the browser or ships in the APK.
// uv pip install --python .venv/Scripts/python.exe -r scripts/phonics-requirements.txt
// npm install --prefix artifacts/phonics-tools --no-save --no-package-lock @echogarden/espeak-ng-emscripten@0.3.5
// node scripts/render-phonics-audio.mjs [--force]
import { mkdir, writeFile, readFile, copyFile, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import createModule from "../artifacts/phonics-tools/node_modules/@echogarden/espeak-ng-emscripten/espeak-ng.js";
import { practiceAudioItems } from "../src/data/practiceAudio.ts";
import { phonicsInput, copyPhonicsSamples } from "./phonics-input.ts";

const root = new URL("../", import.meta.url);
const stage = new URL("artifacts/practice-audio/staged/", root);
await mkdir(stage, { recursive: true });
const items = practiceAudioItems();
const queue = new URL("queue.json", stage);
await writeFile(queue, JSON.stringify(items, null, 2));
const python = process.env.PHONICS_PYTHON ?? fileURLToPath(new URL(
  process.platform === "win32" ? ".venv/Scripts/python.exe" : ".venv/bin/python", root));
const natural = spawnSync(python, ["-X", "utf8", "scripts/render-practice-audio.py",
  fileURLToPath(queue), "--output", fileURLToPath(stage),
  ...(process.argv.includes("--force") ? ["--force"] : [])],
  { cwd: fileURLToPath(root), stdio: "inherit" });
if (natural.error) throw natural.error;
if (natural.status !== 0) process.exit(natural.status ?? 1);
const manifest = JSON.parse(await readFile(new URL("natural-manifest.json", stage), "utf8"));
const recipes = { natural: manifest.recipe, phonics: {
  engine: "eSpeak NG", package: "@echogarden/espeak-ng-emscripten@0.3.5",
  voice: "en+f3", accent: "en-GB", rate: 125, leadingPaddingSeconds: 0.14, renderer: 3,
} };
const files = manifest.files;
const module = await createModule({ locateFile: name => fileURLToPath(new URL(
  `artifacts/phonics-tools/node_modules/@echogarden/espeak-ng-emscripten/${name}`, root)) });
const voice = new module.eSpeakNGWorker();
if (voice.set_voice(recipes.phonics.voice) !== 0)
  throw new Error("British female phonics voice unavailable");
voice.set_rate(recipes.phonics.rate);
for (const item of items.filter(item => item.kind === "phonics")) {
  const input = phonicsInput(item.ipa);
  const chunks = [];
  voice.synthesize(input, samples => { chunks.push(copyPhonicsSamples(samples)); return false; });
  const pcm = Buffer.concat(chunks);
  if (pcm.length < 500) throw new Error(`Empty phoneme clip: ${item.ipa}`);
  const target = new URL(item.path, stage);
  await mkdir(new URL("./", target), { recursive: true });
  const result = spawnSync("ffmpeg", ["-y", "-v", "error", "-f", "s16le", "-ar",
    String(voice.get_samplerate()), "-ac", "1", "-i", "pipe:0", "-af",
    "adelay=140,apad=pad_dur=0.10", "-ar", "24000", "-b:a", "64k",
    "-metadata", `artist=eSpeak NG ${recipes.phonics.voice}`, "-metadata", `title=/${item.ipa}/`,
    fileURLToPath(target)], { input: pcm });
  if (result.error || result.status !== 0) throw result.error ?? new Error(result.stderr.toString());
  const bytes = await readFile(target);
  files[item.path] = { ...item, input, recipe: "phonics",
    sha256: createHash("sha256").update(bytes).digest("hex"),
    seconds: pcm.length / 2 / voice.get_samplerate() + 0.24 };
}
// Do not publish a partial corpus if any download or synthesis has failed.
if (Object.keys(files).length !== items.length) throw new Error("Incomplete audio corpus");
for (const item of items) {
  const source = new URL(item.path, stage);
  const bytes = await readFile(source);
  if (bytes.length < 500 || createHash("sha256").update(bytes).digest("hex") !== files[item.path].sha256)
    throw new Error(`Staged audio failed integrity check: ${item.path}`);
}
for (const item of items) {
  const target = new URL(`public/${item.path}`, root);
  await mkdir(new URL("./", target), { recursive: true });
  await copyFile(new URL(item.path, stage), target);
}
const target = new URL("public/word-audio/manifest.json", root);
const temporary = new URL("public/word-audio/manifest.tmp.json", root);
await writeFile(temporary, JSON.stringify({ renderer: 3, recipes, files }, null, 2) + "\n");
await rename(temporary, target);
console.log(`Packaged ${items.length} offline clips: natural words/letters and explicit phonemes.`);
process.exit(0);
