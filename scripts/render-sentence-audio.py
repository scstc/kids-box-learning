"""Generate local sentence recordings with a British English neural voice."""
import asyncio
import json
import sys
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent.parent

async def main():
    items = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    failures = []
    semaphore = asyncio.Semaphore(3)
    async def render(item):
        async with semaphore:
            target = ROOT / "public" / "course-audio" / f"{item['key']}.mp3"
            if target.exists() and target.stat().st_size > 1000:
                return
            for attempt in range(2):
                try:
                    await edge_tts.Communicate(item["text"], "en-GB-SoniaNeural", rate="-10%").save(str(target))
                    return
                except Exception as error:
                    if attempt == 1:
                        failures.append({"text": item["text"], "error": str(error)})
    await asyncio.gather(*(render(item) for item in items))
    print(json.dumps({"sentences": len(items), "failures": failures}, ensure_ascii=False))
    if failures:
        raise SystemExit(1)

asyncio.run(main())
