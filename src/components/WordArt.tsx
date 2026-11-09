import { useState } from "react";
import { originalWordArt } from "../data/originalArt";
import { mediaUrl } from "../data/media";

export default function WordArt({ id, unitId, className = "" }: {
  id: string;
  unitId: number;
  className?: string;
}) {
  const image = originalWordArt[`${unitId}:${id}`];
  const [failedFile, setFailedFile] = useState("");
  const clues: Record<string, string> = {
    hello: "👋 Meet a friend", goodbye: "👋 See you soon!", baby: "👶 A little one",
    dress: "👗 Something to wear", play: "🧸 Have some fun!", run: "🏃 Move fast!",
    jump: "🦘 Up in the air!", dance: "💃 Move to the music", funny: "😆 It makes you laugh",
    hungry: "🍽️ Time to eat!", garden: "🌷 Flowers grow here",
  };
  const meaning = clues[id] ?? "🎧 Look and listen";
  if (!image || failedFile === image.file)
    return <span className={`word-art kb-original-word-art kb-word-meaning ${className}`} aria-hidden="true">{meaning}</span>;
  return <img key={image.file} className={`word-art kb-original-word-art ${className}`} src={mediaUrl(image.file)}
    width={image.width} height={image.height} alt="" aria-hidden="true" decoding="async"
    onError={() => setFailedFile(image.file)} />;
}
