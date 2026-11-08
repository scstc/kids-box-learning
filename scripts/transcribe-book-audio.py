"""Build offline English subtitles locally. Run with the project's uv environment.

uv pip install --python .venv/Scripts/python.exe -r scripts/speech-requirements.txt
node scripts/prepare-book-speech.mjs
.venv/Scripts/python.exe scripts/transcribe-book-audio.py
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import sys
import subprocess
import numpy as np
sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
# Windows wheels carry CUDA libraries in these directories; leave the system PATH alone.
DLL_HANDLES = []
if os.name == "nt":
    for directory in (Path(sys.prefix) / "Lib/site-packages/nvidia").glob("*/bin"):
        DLL_HANDLES.append(os.add_dll_directory(str(directory)))
        os.environ["PATH"] = str(directory) + os.pathsep + os.environ.get("PATH", "")

from faster_whisper import WhisperModel

parser = argparse.ArgumentParser()
parser.add_argument("--model", default="large-v3-turbo")
parser.add_argument("--limit", type=int, default=0)
parser.add_argument("--device", default="cuda")
args = parser.parse_args()
items = json.loads((ROOT / "artifacts/book-speech-media.json").read_text(encoding="utf-8"))
directory = ROOT / "public/subtitles"
directory.mkdir(exist_ok=True)
model = None
processed = 0
failures = []
for item in items:
    target = directory / (hashlib.sha256(item["file"].encode()).hexdigest()[:16] + ".json")
    if item.get("instrumental") and target.exists():
        document = json.loads(target.read_text(encoding="utf-8"))
        document.update({"cues": [], "instrumental": True, "model": args.model})
        target.write_text(json.dumps(document, separators=(",", ":")), encoding="utf-8")
        continue
    if target.exists():
        existing = json.loads(target.read_text(encoding="utf-8"))
        if existing.get("model") == args.model and existing.get("pipeline") == "continuous-speech-v2":
            continue
    if model is None:
        model = WhisperModel(args.model, device=args.device, compute_type="int8_float16" if args.device == "cuda" else "int8", download_root=str(ROOT / "artifacts/whisper-models"))
    try:
        decoded = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ROOT / "public" / item["file"]), "-f", "f32le", "-ac", "1", "-ar", "16000", "pipe:1"], capture_output=True, check=True)
        samples = np.frombuffer(decoded.stdout, dtype=np.float32)
        segments, info = model.transcribe(samples, language="en", beam_size=5,
            # VAD incorrectly drops short replies, phonics sounds and singing in this book.
            word_timestamps=True, vad_filter=False, condition_on_previous_text=False,
            initial_prompt="Kid's Box. Mr Star, Mrs Star, Stella, Simon, Suzy, Monty, Maskman, Marie, Meera, Lenny, Alex.")
        cues = []
        for segment in segments:
            if segment.no_speech_prob > .7 and segment.avg_logprob < -1:
                continue
            words = []
            if not segment.words and segment.text.strip() and segment.end > segment.start:
                cues.append({"start": round(segment.start, 3), "end": round(segment.end, 3), "text": segment.text.strip()})
                continue
            for word in segment.words or []:
                text = word.word.strip()
                if not text:
                    continue
                if words and (word.start - words[-1]["end"] > .9 or word.end - words[0]["start"] > 6):
                    cues.append({"start": words[0]["start"], "end": words[-1]["end"], "text": " ".join(w["text"] for w in words), "words": words})
                    words = []
                words.append({"start": round(word.start, 3), "end": round(word.end, 3), "text": text})
                if words[-1]["end"] > words[0]["start"] and (len(words) >= 8 or sum(len(w["text"]) + 1 for w in words) >= 52 or text.endswith((".", "?", "!"))):
                    cues.append({"start": words[0]["start"], "end": words[-1]["end"], "text": " ".join(w["text"] for w in words), "words": words})
                    words = []
            if words:
                # Keep recognized zero-duration words; they still belong in the displayed sentence.
                if words[-1]["end"] <= words[0]["start"] and cues:
                    cues[-1]["text"] += " " + " ".join(w["text"] for w in words)
                    if cues[-1].get("words"):
                        cues[-1]["words"].extend(words)
                else:
                    cues.append({"start": words[0]["start"], "end": max(words[-1]["end"], words[0]["start"] + .04), "text": " ".join(w["text"] for w in words), "words": words})
        target.write_text(json.dumps({"source": "automatic", "model": args.model, "pipeline": "continuous-speech-v2", "language": "en", "duration": round(info.duration, 3), "cues": cues}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        processed += 1
        print(json.dumps({"file": item["file"], "cues": len(cues), "duration": round(info.duration, 1)}, ensure_ascii=False), flush=True)
        if args.limit and processed >= args.limit:
            break
    except Exception as error:
        failures.append({"file": item["file"], "error": str(error)})
        print(json.dumps(failures[-1], ensure_ascii=False), flush=True)
        if len(failures) >= 3:
            break
print(json.dumps({"processed": processed, "failures": failures}, ensure_ascii=False), flush=True)
if failures:
    raise SystemExit(1)
