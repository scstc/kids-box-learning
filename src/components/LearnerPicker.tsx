import { useState } from "react";
import { ArrowRight, BookOpen, Footprints, Sprout, UserRound } from "lucide-react";
import type { LearnerProfile } from "../data/learnerProfiles";
import { learnerTotals, readLearnerSummary } from "../data/learnerSummary";
import "./learners.css";

type Props = {
  profiles: LearnerProfile[];
  activeId: string | null;
  error: string;
  onName: (name: string) => void;
  onChoose: (id: string) => void;
  onCancel?: () => void;
};

export default function LearnerPicker({ profiles, activeId, error, onName, onChoose, onCancel }: Props) {
  const [name, setName] = useState("");
  return <main className="kb-learner-picker">
    <div className="kb-learner-brand"><Sprout size={27} aria-hidden="true" />Kids Box</div>
    <div className="kb-learner-heading"><span className="kb-eyebrow">YOUR OWN LITTLE ADVENTURE</span>
      <h1>Who’s learning today?</h1>
      <p>Choose your name or add a learner. Your progress and handwritten notes stay with your name on this device.</p>
    </div>
    <form className="kb-learner-form" onSubmit={event => { event.preventDefault(); onName(name); }}>
      <label htmlFor="kb-learner-name">Your name</label>
      <div><input id="kb-learner-name" name="learner" value={name} maxLength={32} autoComplete="off" autoCapitalize="words"
        placeholder="Type your name" onChange={event => setName(event.target.value)} required aria-describedby={error ? "kb-learner-error" : "kb-learner-help"} />
        <button className="kb-btn" type="submit">Start learning<ArrowRight size={19} aria-hidden="true" /></button></div>
      <p id="kb-learner-help">Using a saved name brings back that learner’s progress.</p>
      {!profiles.length && <p>Your existing learning records will be kept for the first learner you add.</p>}
      {error && <p id="kb-learner-error" className="kb-learner-error" role="alert">{error}</p>}
    </form>
    {!!profiles.length && <section className="kb-learner-list" aria-label="Saved learners">
      <h2>Pick up where you left off</h2>
      <div>{profiles.map(profile => {
        let summary;
        try { summary = readLearnerSummary(localStorage, profile.id); } catch { /* The learner can still retry opening their records. */ }
        return <button key={profile.id} className="kb-learner-card" aria-label={`Continue as ${profile.name}`} aria-current={activeId === profile.id ? "true" : undefined} onClick={() => onChoose(profile.id)}>
          <span className="kb-learner-avatar" aria-hidden="true"><UserRound size={27} /></span>
          <span className="kb-learner-card-copy"><strong>{profile.name}</strong>
            {summary ? <><span><Footprints size={16} aria-hidden="true" />{summary.words} / {learnerTotals.words} words · {summary.challenges} / {learnerTotals.challenges} challenges</span>
              <span><BookOpen size={16} aria-hidden="true" />{summary.activities} book activities · Page {summary.page}</span></> : <span>Open to view your progress</span>}
          </span><ArrowRight size={21} aria-hidden="true" />
        </button>;
      })}</div>
    </section>}
    {onCancel && <button className="kb-btn kb-btn-secondary kb-learner-back" onClick={onCancel}>Back to learning</button>}
  </main>;
}
