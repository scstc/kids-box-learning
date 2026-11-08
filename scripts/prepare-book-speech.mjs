import { writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { bookAudioReferences, relatedBookAudio } from '../src/data/bookAudio.ts';
import { bookVideos } from '../src/data/bookMedia.ts';
const root = new URL('../', import.meta.url);
// Prioritize the phonics page requested by the parent, then all other book resources.
const files = [...new Set([
  ...bookAudioReferences.filter(item => item.page === 14).map(item => item.file).filter(Boolean),
  ...bookAudioReferences.map(item => item.file).filter(Boolean),
  ...relatedBookAudio.map(item => item.file), ...bookVideos.map(item => item.file),
])];
await mkdir(new URL('artifacts/', root), {recursive:true});
await writeFile(new URL('artifacts/book-speech-media.json',root),JSON.stringify(files.map(file=>({file,instrumental:bookVideos.some(video=>video.file===file&&video.kind==='karaoke')})),null,2));
const subtitles=Object.fromEntries(files.map(file=>[file,`subtitles/${createHash('sha256').update(file).digest('hex').slice(0,16)}.json`]));
await writeFile(new URL('src/data/bookSubtitles.ts',root),`// English subtitles recognized locally from the original media; loaded only when played.\nexport const bookSubtitles: Record<string, string> = ${JSON.stringify(subtitles,null,2)};\n`);
console.log({media:files.length});
