import { mkdir, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { getAudioItems } from "../src/data/course.ts";

const directory = fileURLToPath(
  new URL("../public/course-audio/", import.meta.url),
);
await mkdir(directory, { recursive: true });
const queue = getAudioItems().filter((item) => !/[.!?]/.test(item.text));
let count = 0;
const failures = [];
async function worker() {
  while (queue.length) {
    const item = queue.shift();
    const path = `${directory}/${item.key}.mp3`;
    if (
      await stat(path)
        .then((file) => file.size > 1000)
        .catch(() => false)
    ) {
      count++;
      continue;
    }
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(
          `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(item.text)}&type=1`,
          { signal: AbortSignal.timeout(20000) },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        let data = new Uint8Array(await response.arrayBuffer());
        if (
          data.length > 1000 &&
          Buffer.from(data.subarray(0, 4)).toString() === "RIFF"
        ) {
          data = await new Promise((resolve, reject) => {
            const process = spawn("ffmpeg", [
              "-loglevel",
              "error",
              "-i",
              "pipe:0",
              "-f",
              "mp3",
              "pipe:1",
            ]);
            const chunks = [];
            process.stdout.on("data", (chunk) => chunks.push(chunk));
            process.on("error", reject);
            process.on("close", (code) =>
              code === 0
                ? resolve(Buffer.concat(chunks))
                : reject(new Error("Audio conversion failed")),
            );
            process.stdin.on("error", reject);
            process.stdin.end(data);
          });
        }
        if (
          data.length < 1000 ||
          !(data[0] === 0x49 || (data[0] === 0xff && (data[1] & 0xe0) === 0xe0))
        )
          throw new Error("Invalid MP3 response");
        await writeFile(path, data);
        count++;
        break;
      } catch (error) {
        if (attempt === 1)
          failures.push({ text: item.text, error: String(error) });
      }
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(JSON.stringify({ saved: count, failures }, null, 2));
if (failures.length) process.exitCode = 1;
