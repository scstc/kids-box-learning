// Offline asset build only; no model, Python or network is needed in the app.
// uv pip install --python .venv/Scripts/python.exe -r scripts/phonics-requirements.txt
// node scripts/render-phonics-audio.mjs [--force]
import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { practiceAudioItems } from "../src/data/practiceAudio.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = new URL("../artifacts/unified-voice/", import.meta.url);
await mkdir(directory, { recursive: true });
const queue = new URL("queue.json", directory);
await writeFile(queue, JSON.stringify(practiceAudioItems(), null, 2));
const python = process.env.PHONICS_PYTHON ?? fileURLToPath(new URL(
  process.platform === "win32" ? "../.venv/Scripts/python.exe" : "../.venv/bin/python",
  import.meta.url,
));
const result = spawnSync(python, [
  "-X", "utf8", "scripts/render-practice-audio.py", fileURLToPath(queue),
  ...(process.argv.includes("--force") ? ["--force"] : []),
], { cwd: root, stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
