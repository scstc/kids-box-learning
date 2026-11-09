"""Extract the isolated sound from the reviewed teaching recording, not its example."""
import hashlib
import json
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "artifacts/recorded-ipa"
STAGE = CACHE / "staged"


def digest(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def main():
    catalog = json.loads((ROOT / "scripts/ipa-recordings.json").read_text("utf-8"))
    CACHE.mkdir(parents=True, exist_ok=True)
    STAGE.mkdir(parents=True, exist_ok=True)
    files = {}
    for item in catalog["recordings"]:
        source = CACHE / f"{item['sourceSha256']}.mp3"
        if not source.exists() or digest(source) != item["sourceSha256"]:
            for attempt in range(2):
                try:
                    with urllib.request.urlopen(item["sourceUrl"], timeout=30) as response:
                        data = response.read()
                    if hashlib.sha256(data).hexdigest() != item["sourceSha256"]:
                        raise ValueError(f"Teaching source changed; review before using: {item['ipa']}")
                    source.write_bytes(data)
                    break
                except Exception:
                    if attempt == 1:
                        raise
        start, end = item["start"], item["end"]
        if not 0 <= start < end < item["exampleStart"]:
            raise ValueError(f"Sound overlaps its example: {item['ipa']}")
        name = "-".join(f"{ord(c):x}" for c in item["ipa"]) + ".mp3"
        target = STAGE / name
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(source), "-af",
            f"atrim=start={start}:end={end},asetpts=PTS-STARTPTS,"
            f"afade=t=in:d=0.003,afade=t=out:st={end-start-.003}:d=0.003,"
            "adelay=40,apad=pad_dur=0.10,asetpts=N/SR/TB",
            "-ar", "24000", "-ac", "1", "-b:a", "64k",
            "-metadata", "artist=Pronunciation Studio", "-metadata", f"title=/{item['ipa']}/",
            "-metadata", f"comment={catalog['sourcePage']}", str(target)], check=True)
        seconds = float(subprocess.check_output(["ffprobe", "-v", "error",
            "-show_entries", "format=duration", "-of", "csv=p=0", str(target)]))
        if target.stat().st_size < 1000 or not .2 < seconds < 2:
            raise ValueError(f"Invalid isolated recording: {item['ipa']}")
        files[f"ipa-audio/{name}"] = {**item, "sha256": digest(target), "seconds": seconds}
    if len(files) != 44:
        raise ValueError("The complete 44-sound chart is required")
    # Publish only after every original recording and excerpt has passed checks.
    directory = ROOT / "public/ipa-audio"
    directory.mkdir(exist_ok=True)
    for path in files:
        (directory / Path(path).name).write_bytes((STAGE / Path(path).name).read_bytes())
    (directory / "manifest.json").write_text(json.dumps({"sourcePage": catalog["sourcePage"],
        "credit": catalog["credit"], "kind": "recorded-teaching-excerpts", "files": files},
        ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(f"Prepared {len(files)} recorded IPA sounds. Word/letter recordings were not regenerated.")


if __name__ == "__main__":
    main()
