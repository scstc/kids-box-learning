"""Render phonics and whole words with one British voice, directly from IPA."""
import argparse
import hashlib
import json
import re
import subprocess
import time
import urllib.request
from pathlib import Path

import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "artifacts/unified-voice"
REVISION = "1939ad2a8e416c0acfeecc08a694d14ef25f2231"
BASE = f"https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/{REVISION}"
VOICE = "bf_emma"
RECIPE = {
    "engine": "Kokoro-82M-v1.0-ONNX/q8",
    "voice": VOICE,
    "accent": "en-GB",
    "revision": REVISION,
    "speed": 0.85,
    "renderer": 2,
}


def digest(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def asset(name, remote, expected):
    target = CACHE / name
    if not target.exists() or digest(target) != expected:
        temporary = target.with_suffix(".download")
        print(f"Downloading {name}", flush=True)
        with urllib.request.urlopen(f"{BASE}/{remote}", timeout=60) as response:
            with temporary.open("wb") as output:
                while chunk := response.read(1024 * 1024):
                    output.write(chunk)
        if digest(temporary) != expected:
            raise ValueError(f"Checksum mismatch: {name}")
        temporary.replace(target)
    return target


def model_phonemes(ipa):
    # British dictionary /r/ is the approximant, not a trill. Kokoro uses /ɛ/
    # for the DRESS vowel; keep /eɪ/ and /eə/ unchanged. No letter-name TTS.
    value = re.sub(r"e(?![ɪə])", "ɛ", ipa).replace("r", "ɹ")
    vowels = "aeiouɑɒæɔəɛɜɪʊʌ"
    # Kokoro's training phonemizer places stress immediately before the vowel,
    # whereas the displayed IPA puts it before the syllable onset.
    value = re.sub(rf"([ˈˌ])([^{vowels} ˈˌ]*)([{vowels}])", r"\2\1\3", value)
    if not re.search("[ˈˌ]", value):
        value = re.sub(rf"[{vowels}]", lambda match: "ˈ" + match[0], value, count=1)
    return value


def replace_file(source, target):
    # Windows media readers and virus scanners can briefly hold a file open.
    for attempt in range(5):
        try:
            source.replace(target)
            return
        except PermissionError:
            if attempt == 4:
                raise
            time.sleep(0.25 * 2 ** attempt)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("queue", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    CACHE.mkdir(parents=True, exist_ok=True)
    model = asset("model_quantized.onnx", "onnx/model_quantized.onnx",
                  "fbae9257e1e05ffc727e951ef9b9c98418e6d79f1c9b6b13bd59f5c9028a1478")
    voice = asset(f"{VOICE}.bin", f"voices/{VOICE}.bin",
                  "669fe0647f9dd04fcab92f1439a40eeb4c8b4ab1f82e4996fe3d918ce4a63b73")
    voices = CACHE / "voices.npz"
    np.savez(voices, **{VOICE: np.fromfile(voice, dtype=np.float32).reshape(-1, 1, 256)})
    options = ort.SessionOptions()
    options.intra_op_num_threads = 4
    kokoro = Kokoro.from_session(ort.InferenceSession(str(model), options,
                                providers=["CPUExecutionProvider"]), str(voices))
    manifest_path = ROOT / "public/word-audio/manifest.json"
    old = json.loads(manifest_path.read_text("utf-8")) if manifest_path.exists() else {}
    previous = old.get("files", {}) if old.get("recipe") == RECIPE else {}
    files = {}
    def checkpoint():
        temporary = manifest_path.with_suffix(".tmp.json")
        temporary.write_text(json.dumps({"recipe": RECIPE, "files": files},
            ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        replace_file(temporary, manifest_path)

    items = json.loads(args.queue.read_text("utf-8"))
    for index, item in enumerate(items):
        path = ROOT / "public" / item["path"]
        path.parent.mkdir(parents=True, exist_ok=True)
        phonemes = model_phonemes(item["ipa"])
        unknown = set(phonemes) - kokoro.tokenizer.vocab.keys()
        if unknown:
            raise ValueError(f"Unsupported IPA in {item}: {unknown}")
        existing = previous.get(item["path"], {})
        if (not args.force and existing.get("ipa") == item["ipa"]
                and path.exists() and digest(path) == existing.get("sha256")):
            files[item["path"]] = existing
            continue
        samples, sample_rate = kokoro.create(phonemes, voice=VOICE,
            speed=RECIPE["speed"], lang="en-gb", is_phonemes=True)
        if len(samples) < sample_rate * 0.08 or not np.isfinite(samples).all():
            raise ValueError(f"Empty or invalid sound: {item}")
        if float(np.sqrt(np.mean(samples ** 2))) < 0.002:
            raise ValueError(f"Silent sound: {item}")
        # The same processing for parts and words avoids abrupt level changes.
        temporary = path.with_suffix(".tmp.mp3")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le",
            "-ar", str(sample_rate), "-ac", "1", "-i", "pipe:0", "-af",
            "silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.02,"
            "apad=pad_dur=0.10,loudnorm=I=-20:TP=-2:LRA=7",
            "-ar", "24000", "-b:a", "64k", "-metadata", f"artist=Kokoro {VOICE}",
            str(temporary)], input=samples.astype("<f4").tobytes(), check=True)
        if temporary.stat().st_size < 500:
            raise ValueError(f"Invalid MP3: {item}")
        replace_file(temporary, path)
        files[item["path"]] = {"ipa": item["ipa"], "phonemes": phonemes,
            "sha256": digest(path), "seconds": round(len(samples) / sample_rate, 3)}
        if (index + 1) % 25 == 0:
            checkpoint()
            print(f"Rendered {index + 1}/{len(items)}", flush=True)
    checkpoint()
    print(f"Verified {len(files)} offline clips with one voice: {VOICE}", flush=True)


if __name__ == "__main__":
    main()
