import type { CSSProperties } from "react";
import { Star } from "lucide-react";
import "./correctCelebration.css";

export default function CorrectCelebration({ message = "答对啦！" }: { message?: string }) {
  return <div className="kb-correct-celebration" aria-hidden="true">
    <div className="kb-correct-badge"><Star size={28} fill="currentColor" /><strong>{message}</strong><Star size={23} fill="currentColor" /></div>
    {Array.from({ length: 28 }, (_, index) => <i key={index} style={{
      "--piece-x": `${Math.cos(index * 2.4) * (95 + index % 6 * 22)}px`,
      "--piece-y": `${Math.sin(index * 2.4) * 95 - 80}px`,
      "--piece-turn": `${index % 2 ? 310 : -250}deg`,
      "--piece-delay": `${index % 5 * 30}ms`,
      background: ["#d6ad4e", "#8fae70", "#c398bb", "#7faac5"][index % 4],
    } as CSSProperties} />)}
  </div>;
}
