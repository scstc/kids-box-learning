import type { ReactNode } from "react";
import StarBorder from "./reactbits/StarBorder";

export default function RewardButton({ animated, className, onClick, children }: {
  animated: boolean; className: string; onClick: () => void; children: ReactNode;
}) {
  return animated ? <StarBorder className={className} theme="light" color="#e0b94f" trailColor="#91ae73"
    backgroundColor="#587641" textColor="#fffefa" stars={2} sparkle duration={3} onClick={onClick}>{children}</StarBorder>
    : <button className={className} onClick={onClick}>{children}</button>;
}
