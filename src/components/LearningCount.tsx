import CountUp from "./reactbits/CountUp";

export default function LearningCount({ value, animated }: { value: number; animated: boolean }) {
  return animated ? <CountUp to={value} duration={0.7} trigger="view" /> : <span>{value}</span>;
}
