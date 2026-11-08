import type { AnimalId } from "../data/animals";
import { originalWordArt } from "../data/originalArt";
import { mediaUrl } from "../data/media";

export default function AnimalArt({ animal, className = "" }: { animal: AnimalId; className?: string }) {
  const image = originalWordArt[`7:${animal}`];
  return <img className={`animal-art ${className}`} src={mediaUrl(image.file)} width={image.width} height={image.height} alt="" aria-hidden="true" style={{ objectFit: "contain" }} />;
}

export function SceneLeaves() {
  return (
    <svg
      className="scene-leaves"
      viewBox="0 0 500 410"
      fill="none"
      aria-hidden="true"
    >
      <path d="M22 406q28-90 5-189" stroke="#688756" strokeWidth="5" />
      <path
        d="M30 331q-51-10-45-67 52 13 45 67M33 302q55-13 54-66-54 10-54 66M32 269Q-7 248-5 202q49 11 37 67M32 238q43-20 38-61-45 12-38 61"
        fill="#7c9c67"
      />
      <path d="M460 415q-36-74-23-145" stroke="#688756" strokeWidth="4" />
      <path
        d="M447 361q-46-3-49-46 44 6 49 46M439 336q41-17 40-53-44 15-40 53M436 310q-39-11-37-47 39 8 37 47M438 289q34-12 36-45-38 6-36 45"
        fill="#90a675"
      />
      <path
        d="M78 411q0-46-16-69m15 43q17-27 29-29M402 412q-7-26 4-45"
        stroke="#91a773"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="m365 69 3-9 3 9 9 3-9 3-3 9-3-9-9-3zM78 116l2-6 2 6 6 2-6 2-2 6-2-6-6-2z"
        fill="#d6aa54"
      />
      <circle cx="400" cy="131" r="4" fill="#c6d2ad" />
      <circle cx="103" cy="48" r="3" fill="#c6d2ad" />
    </svg>
  );
}
