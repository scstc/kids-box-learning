// Import the reviewed, clean 93-page Book 1 scan without changing the source PDF.
// Requires Poppler's pdfinfo and pdfimages on PATH. Output keeps the reviewed hotspot geometry.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { originalCover, originalUnitArt, originalWordArt } from '../src/data/originalArt.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
if (!process.argv[2]) throw Error('Usage: node scripts/import-book-pdf.mjs <path-to-01.pdf>');
const source = path.resolve(process.argv[2]);
const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: 'utf8', windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw Error(`${command}: ${result.stderr}`);
  return result.stdout;
};
const info = run('pdfinfo', [source]);
if (!/^Pages:\s+93\s*$/m.test(info)) throw Error('Expected the reviewed Book 1 scan with 93 PDF pages.');
const sha256 = createHash('sha256').update(await readFile(source)).digest('hex');
const staging = path.join(root, 'artifacts', 'book-pdf-import', sha256);
await mkdir(staging, { recursive: true });
run('pdfimages', ['-j', source, path.join(staging, 'image')]);
const images = (await readdir(staging)).filter(file => /^image-\d+\.jpg$/.test(file)).sort();
if (images.length !== 93) throw Error('Expected exactly one JPEG scan per PDF page.');

// Validate the whole input before replacing any bundled asset.
for (const [index, file] of images.entries()) {
  const meta = await sharp(path.join(staging, file)).metadata();
  const expected = index === 0 ? [850, 906] : [1264, 1607];
  if (meta.width !== expected[0] || meta.height !== expected[1])
    throw Error(`Unexpected geometry on PDF page ${index + 1}: ${meta.width} × ${meta.height}. Recheck hotspot alignment first.`);
}
const pages = path.join(staging, 'book-pages');
await mkdir(pages, { recursive: true });
for (const [index, file] of images.entries()) {
  const cover = index === 0;
  const output = cover ? path.join(staging, 'cover.jpg') : path.join(pages, `page-${String(index + 3).padStart(3, '0')}.jpg`);
  await sharp(path.join(staging, file)).resize(cover ? 1502 : 1259, 1600, { fit: 'fill' })
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(output);
}
// Extra vocabulary crops and plural compositions are rebuilt from the imported pages below.
const artwork = [originalCover, ...Object.values(originalUnitArt), ...Object.values(originalWordArt).filter(art => art.source.kind === 'pdf' && !art.file.startsWith('book-art/extra-'))];
for (const art of artwork) {
  const [left, top, width, height] = art.source.rect;
  const page = art.source.page === 'cover' ? path.join(staging, 'cover.jpg') : path.join(pages, `page-${String(art.source.page).padStart(3, '0')}.jpg`);
  const output = path.join(staging, art.file);
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(page).extract({ left, top, width, height }).resize(art.width, art.height, { fit: 'fill' })
    .webp({ quality: 88 }).toFile(output);
}

for (let page = 4; page <= 95; page++) {
  const name = `page-${String(page).padStart(3, '0')}.jpg`;
  await copyFile(path.join(pages, name), path.join(root, 'public', 'book-pages', name));
}
for (const art of artwork) await copyFile(path.join(staging, art.file), path.join(root, 'public', art.file));
await copyFile(source, path.join(staging, 'source.pdf'));
await writeFile(path.join(root, 'public', 'book-source.json'), JSON.stringify({
  fileName: path.basename(source), sha256, pdfPages: 93, firstPrintedPage: 4, lastPrintedPage: 95,
  pageWidth: 1259, pageHeight: 1600, extractedArtwork: artwork.length,
}, null, 2) + '\n');
console.log({ source: path.basename(source), sha256, pages: 92, artwork: artwork.length });
run(process.execPath, [path.join(root, 'scripts', 'expand-vocabulary-art.mjs')]);
