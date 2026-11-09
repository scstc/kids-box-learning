import type { CSSProperties } from "react";
import { Star } from "lucide-react";
import ShinyText from "./reactbits/ShinyText";
import "./correctCelebration.css";

export default function CorrectCelebration({ message = "That's right!" }: { message?: string }) {
  return <div className="kb-correct-celebration" aria-hidden="true">
    <div className="kb-correct-badge"><Star size={28} fill="currentColor" /><strong><ShinyText text={message} color="#24324b" shineColor="#3b60d9" trigger="view" speed={0.7} glow={0} /></strong><Star size={23} fill="currentColor" /></div>
    {Array.from({ length: 28 }, (_, index) => <i key={index} style={{
      "--piece-x": `${Math.cos(index * 2.4) * (95 + index % 6 * 22)}px`,
      "--piece-y": `${Math.sin(index * 2.4) * 95 - 80}px`,
      "--piece-turn": `${index % 2 ? 310 : -250}deg`,
      "--piece-delay": `${index % 5 * 30}ms`,
      background: ["#f2a54a", "#69bce8", "#8d89e8", "#3b60d9"][index % 4],
    } as CSSProperties} />)}
  </div>;
}
