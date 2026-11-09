"""Build natural words and letter names; phonics use a dedicated phoneme renderer."""
import argparse
import asyncio
import hashlib
import json
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "artifacts/practice-audio/natural"
RECIPE = {"engine": "Microsoft Edge neural TTS", "voice": "en-GB-SoniaNeural",
          "accent": "en-GB", "rate": "-10%", "renderer": 3}


def digest(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def source_key(text):
    return hashlib.sha256(json.dumps({"text": text, "recipe": RECIPE},
        sort_keys=True).encode()).hexdigest()


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("queue", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    CACHE.mkdir(parents=True, exist_ok=True)
    items = [item for item in json.loads(args.queue.read_text("utf-8"))
             if item["kind"] in ("word", "letter")]
    semaphore = asyncio.Semaphore(3)
    files = {}

    async def render(item):
        async with semaphore:
            # Plain text is essential: raw IPA is not natural word/letter speech.
            text = item["text"] + "."
            source = CACHE / f"{source_key(text)}.mp3"
            if args.force or not source.exists():
                for attempt in range(3):
                    try:
                        temporary = source.with_suffix(".tmp.mp3")
                        await edge_tts.Communicate(text, RECIPE["voice"],
                            rate=RECIPE["rate"]).save(str(temporary))
                        if temporary.stat().st_size < 1000:
                            raise ValueError(f"Empty speech: {text}")
                        temporary.replace(source)
                        break
                    except Exception:
                        if attempt == 2:
                            raise
                        await asyncio.sleep(1 + attempt)
            target = args.output / item["path"]
            target.parent.mkdir(parents=True, exist_ok=True)
            # Trim only the trailing pause. Preserve the original speech onset
            # and level; no leading silenceremove or per-clip loudness boosting.
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(source),
                "-af", "areverse,silenceremove=start_periods=1:start_threshold=-65dB:"
                "start_silence=0.16,areverse", "-ar", "24000", "-ac", "1", "-b:a", "64k",
                "-metadata", f"artist={RECIPE['voice']}", "-metadata", f"title={item['text']}",
                str(target)], check=True)
            seconds = float(subprocess.check_output(["ffprobe", "-v", "error",
                "-show_entries", "format=duration", "-of", "csv=p=0", str(target)]))
            files[item["path"]] = {**item, "recipe": "natural", "input": text,
                "sourceSha256": digest(source), "sha256": digest(target), "seconds": seconds}

    await asyncio.gather(*(render(item) for item in items))
    (args.output / "natural-manifest.json").write_text(json.dumps(
        {"recipe": RECIPE, "files": files}, ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(f"Staged {len(files)} natural word/letter clips ({RECIPE['voice']})", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
