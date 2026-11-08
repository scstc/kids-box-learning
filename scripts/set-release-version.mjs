import { readFile, writeFile } from 'node:fs/promises';
import { parseReleaseVersion, nextReleaseVersion } from '../src/data/releaseVersion.ts';
const root = new URL('../', import.meta.url);
const current = JSON.parse(await readFile(new URL('app-version.json', root), 'utf8'));
const next = parseReleaseVersion(process.argv[2] ?? nextReleaseVersion(current.version));
if (!next || next.versionCode <= current.versionCode) throw new Error('Use a newer YY.quarter.release version, e.g. 26.4.2.');
await writeFile(new URL('app-version.json', root), JSON.stringify(next, null, 2) + '\n');
console.log(next);
