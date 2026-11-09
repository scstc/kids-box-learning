import TechText from "./reactbits/TechText";

export default function LearningWord({ text, animated, color, replay, onRead }: {
  text: string;
  animated: boolean;
  color: string;
  replay: number;
  onRead: () => void;
}) {
  return <h2 className={`kb-learning-word${text.length > 11 ? " kb-long-word" : ""}`} lang="en" aria-label={text}>
    {animated ? <div className="kb-tech-word" role="button" tabIndex={0} aria-label={`Play word ${text}`} onClick={onRead}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onRead(); } }}>
      <TechText key={`${text}:${replay}`} text={text} fontFamily="Nunito Variable" fontWeight={800}
        fontSize={text.length > 11 ? 62 : 88} letterSpacing={-0.025} color={color} accentColor="#f2a54a"
        align="left" intro="type" introDuration={0.85} labels={false} guides={false} specks={5}
        draggable={false} sweep={false} bounce={0.2} lineStyle="solid" strokeWidth={1.8} clickKick />
    </div> : text}
  </h2>;
}
