import type { ReactNode } from "react";
import StarBorder from "./reactbits/StarBorder";

export default function RewardButton({ animated, className, onClick, children }: {
  animated: boolean; className: string; onClick: () => void; children: ReactNode;
}) {
  return animated ? <StarBorder className={className} theme="light" color="#f2a54a" trailColor="#69bce8"
    backgroundColor="var(--primary)" textColor="var(--on-primary)" stars={2} sparkle duration={3} onClick={onClick}>{children}</StarBorder>
    : <button className={className} onClick={onClick}>{children}</button>;
}
