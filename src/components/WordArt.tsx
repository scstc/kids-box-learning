import { useState } from "react";
import { courseUnits } from "../data/course";
import { originalWordArt } from "../data/originalArt";
import { mediaUrl } from "../data/media";

export default function WordArt({ id, unitId, className = "" }: {
  id: string;
  unitId: number;
  className?: string;
}) {
  const image = originalWordArt[`${unitId}:${id}`];
  const [failedFile, setFailedFile] = useState("");
  const meaning = courseUnits.find((unit) => unit.id === unitId)?.words.find((word) => word.id === id)?.zh ?? "看图听音";
  if (!image || failedFile === image.file)
    return <span className={`word-art kb-original-word-art kb-word-meaning ${className}`} aria-hidden="true">{meaning}</span>;
  return <img key={image.file} className={`word-art kb-original-word-art ${className}`} src={mediaUrl(image.file)}
    width={image.width} height={image.height} alt="" aria-hidden="true" decoding="async"
    onError={() => setFailedFile(image.file)} />;
}
