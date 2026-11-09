import type { BookHotspot } from "./bookHotspots";

// Enlarge small targets into free space, without covering another printed
// word or picture. The book's coordinates always remain the minimum bounds.
export function bookTouchTargets(regions: BookHotspot[], pageWidth: number, pageHeight: number) {
  const boxes = regions.map(region => ({
    left: region.x / 100 * pageWidth,
    top: region.y / 100 * pageHeight,
    width: region.width / 100 * pageWidth,
    height: region.height / 100 * pageHeight,
  }));
  return regions.map((region, index) => {
    if (region.kind === "text" || pageWidth <= 0 || pageHeight <= 0) return { minWidth: 0, minHeight: 0 };
    const box = boxes[index];
    const right = box.left + box.width, bottom = box.top + box.height;
    let minWidth = Math.max(44, box.width), minHeight = Math.max(44, box.height);
    for (let otherIndex = 0; otherIndex < boxes.length; otherIndex++) {
      if (otherIndex === index || regions[otherIndex].word === region.word) continue;
      const other = boxes[otherIndex];
      const otherRight = other.left + other.width, otherBottom = other.top + other.height;
      if (other.left < right && otherRight > box.left && other.top < bottom && otherBottom > box.top) {
        // Existing, intentional source overlap must not grow with scaling.
        minWidth = box.width; minHeight = box.height; break;
      }
      if (other.left >= right && other.left < box.left + minWidth && other.top < box.top + minHeight && otherBottom > box.top)
        minWidth = Math.max(box.width, other.left - box.left);
      if (other.top >= bottom && other.top < box.top + minHeight && other.left < box.left + minWidth && otherRight > box.left)
        minHeight = Math.max(box.height, other.top - box.top);
    }
    return { minWidth, minHeight };
  });
}
