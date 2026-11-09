"""Download publisher originals without trimming, synthesis, or re-encoding."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "scripts/cambridge-recordings.json"
STAGE = ROOT / "artifacts/cambridge-audio-stage"


def download(item):
    relative, record = item
    url = record["url"]
    if not url.startswith("https://dictionary.cambridge.org/media/english/uk_"):
        raise ValueError(f"Not a UK publisher recording: {url}")
    target = STAGE / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists():
        for attempt in range(3):
            try:
                request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(request, timeout=30) as response:
                    if response.headers.get_content_type() != "audio/mpeg":
                        raise ValueError(f"Not MP3: {relative}")
                    data = response.read()
                if len(data) < 500:
                    raise ValueError(f"Empty recording: {relative}")
                target.write_bytes(data)
                break
            except Exception as error:
                if attempt == 2:
                    raise RuntimeError(f"Could not download {relative}: {url}") from error
                time.sleep(attempt + 1)
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(target), "-f", "null", "-"], check=True, capture_output=True)
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(target)], check=True, capture_output=True, text=True)
    duration = float(json.loads(probe.stdout)["format"]["duration"])
    if not 0.08 < duration < 20:
        raise ValueError(f"Unexpected duration {duration}: {relative}")
    data = target.read_bytes()
    sha256 = hashlib.sha256(data).hexdigest()
    if record.get("sha256") and sha256 != record["sha256"]:
        raise ValueError(f"Publisher bytes changed; review before using: {relative}")
    return relative, record | {"sha256": sha256, "bytes": len(data), "seconds": duration}


if __name__ == "__main__":
    catalog = json.loads(CATALOG.read_text("utf8"))
    files = {}
    failures = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(download, item) for item in catalog["files"].items()]
        for future in concurrent.futures.as_completed(futures):
            try:
                relative, record = future.result()
                files[relative] = record
            except Exception as error:
                failures.append(str(error))
    if failures:
        raise RuntimeError("\n".join(failures))
    # Publish only after every source has downloaded and decoded successfully.
    for relative in files:
        target = ROOT / "public" / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(STAGE / relative, target)
    manifest = {"publisher": catalog["publisher"], "accent": catalog["accent"], "processing": "Original publisher bytes; no trimming, synthesis, or re-encoding", "files": files}
    (ROOT / "public/cambridge-audio/manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", "utf8")
    runtime = {key: value for key, value in catalog.items() if key != "files"}
    (ROOT / "src/data/cambridgePronunciation.json").write_text(json.dumps(runtime, ensure_ascii=False, indent=2) + "\n", "utf8")
    print(f"Published {len(files)} verified original recordings ({sum(r['bytes'] for r in files.values()):,} bytes).")
