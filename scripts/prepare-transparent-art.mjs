// Deterministic cutouts from the user's original flashcards; never change the source JPGs.
import sharp from 'sharp';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { bookFlashcards } from '../src/data/bookMedia.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicPath = (file) => path.join(root, 'public', file);
const clear = { r: 0, g: 0, b: 0, alpha: 0 };

// Seeds refer only to white negative space, never white paint, eyes or clothing.
const holes = {
  27: [[.559, .663]], // Numeral counters.
  31: [[.44, .301], [.566, .689]],
  33: [[.484, .377]],
  35: [[.679, .509]],
  57: [[.608, .255], [.725, .348], [.745, .678], [.30, .740]], // Chair rails.
  61: [[.572, .124], [.777, .909]], // Pen clip and drawn loop.
  77: [[.510, .541], [.646, .588], // Bicycle frame and spaces between spokes.
    [.788, .563], [.842, .559], [.85, .595], [.742, .618], [.888, .640],
    [.204, .649], [.167, .636], [.706, .640], [.267, .645], [.127, .667],
    [.269, .699], [.723, .663], [.108, .726], [.908, .708], [.873, .742],
    [.742, .742], [.773, .783], [.281, .740], [.710, .704], [.844, .785],
    [.815, .810], [.113, .753], [.271, .796], [.106, .803], [.125, .839],
    [.202, .873], [.240, .835], [.179, .876]],
  103: [[.453, .778], [.566, .86]], // Bird tail loops.
  125: [[.569, .791]], // Snake loop; retain its white highlights.
  129: [[.800, .735], [.516, .813]], // Monkey tail and bent leg.
  155: [[.411, .504], [.454, .644], [.342, .664], [.691, .724],
    [.838, .856], [.172, .734], [.720, .810], [.151, .870]],
  161: [[.191, .671], [.131, .719], [.107, .825], [.224, .849]],
};

async function cutout(input, seeds = []) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);
  let head = 0, tail = 0;
  const visit = (pixel) => {
    if (visited[pixel]) return;
    const offset = pixel * 4;
    const min = Math.min(data[offset], data[offset + 1], data[offset + 2]);
    const max = Math.max(data[offset], data[offset + 1], data[offset + 2]);
    if (min < 235 || max - min > 22) return;
    visited[pixel] = 1;
    queue[tail++] = pixel;
  };
  for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
  for (const [x, y] of seeds) {
    const sx = Math.floor(x * width), sy = Math.floor(y * height);
    // Normalized coordinates can shift a pixel when the source is resized.
    const before = tail;
    for (let radius = 0; radius <= 4 && tail === before; radius++)
      for (let dy = -radius; dy <= radius && tail === before; dy++)
        for (let dx = -radius; dx <= radius && tail === before; dx++)
          if (sx + dx >= 0 && sx + dx < width && sy + dy >= 0 && sy + dy < height)
            visit((sy + dy) * width + sx + dx);
  }
  while (head < tail) {
    const pixel = queue[head++];
    data[pixel * 4 + 3] = 0;
    const x = pixel % width;
    if (x > 0) visit(pixel - 1);
    if (x < width - 1) visit(pixel + 1);
    if (pixel >= width) visit(pixel - width);
    if (pixel + width < width * height) visit(pixel + width);
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

const cards = {};
for (const card of bookFlashcards) {
  const cropped = await sharp(publicPath(card.file))
    .extract({ left: 0, top: 0, width: 691, height: 795 })
    .png().toBuffer();
  const original = await sharp(cropped)
    .trim({ background: '#ffffff', threshold: 24 })
    .extend({ top: 12, bottom: 12, left: 12, right: 12, background: '#ffffff' })
    .png().toBuffer();
  const file = `book-art/card-${String(card.number).padStart(3, '0')}.png`;
  const image = await cutout(original, holes[card.number]);
  const info = await sharp(image).resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
    .png().toFile(publicPath(file));
  cards[card.number] = { file, width: info.width, height: info.height, source: { kind: 'flashcard', number: card.number } };
}

// Recompose comparison cards on transparent canvases, including inside the focus frame.
const chairLarge = await sharp(publicPath(cards[57].file)).resize(270, 455, { fit: 'contain', background: clear }).png().toBuffer();
const chairSmall = await sharp(publicPath(cards[57].file)).resize(150, 250, { fit: 'contain', background: clear }).png().toBuffer();
const pencilLong = await sharp(publicPath(cards[63].file)).resize(290, 455, { fit: 'contain', background: clear }).png().toBuffer();
const pencilCrop = await sharp(publicPath('book-pages/page-036.jpg')).extract({ left: 691, top: 1128, width: 74, height: 60 }).png().toBuffer();
const pencilShort = await sharp(await cutout(pencilCrop)).resize(120, 98).png().toBuffer();
for (const id of ['big', 'small', 'long', 'short']) {
  const first = id === 'big' || id === 'long';
  const chair = id === 'big' || id === 'small';
  const box = first ? [20, 50, 315, 490] : [365, 255, 195, 290];
  const frame = Buffer.from(`<svg width="600" height="600"><rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" rx="20" fill="none" stroke="#b48b39" stroke-width="5"/></svg>`);
  await sharp({ create: { width: 600, height: 600, channels: 4, background: clear } }).composite([
    { input: chair ? chairLarge : pencilLong, left: 35, top: 70 },
    { input: chair ? chairSmall : pencilShort, left: 385, top: chair ? 280 : 390 },
    { input: frame, left: 0, top: 0 },
  ]).png().toFile(publicPath(`book-art/word-5-${id}.png`));
}

const manifestPath = path.join(root, 'src/data/originalArt.ts');
let manifest = await readFile(manifestPath, 'utf8');
manifest = manifest.replace(/book-art\/(card-\d{3}|word-5-(?:big|small|long|short))\.webp/g, 'book-art/$1.png');
manifest = manifest.replace(/\nexport const originalFlashcardArt:[\s\S]*$/, '');
manifest += `\nexport const originalFlashcardArt: Record<number, OriginalArt> = ${JSON.stringify(cards, null, 2)};\n`;
await writeFile(manifestPath, manifest);
// Retire only the superseded derived files; original JPGs/PDF pages remain intact.
for (const file of [...Object.values(cards).map((card) => card.file), ...['big', 'small', 'long', 'short'].map((id) => `book-art/word-5-${id}.png`)]) {
  await unlink(publicPath(file.replace(/\.png$/, '.webp'))).catch((error) => { if (error.code !== 'ENOENT') throw error; });
}
console.log(`Prepared ${bookFlashcards.length} original flashcards and 4 comparison cards with transparency.`);
