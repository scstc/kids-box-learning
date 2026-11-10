import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, Footprints, Sprout, Trash2 } from "lucide-react";
import type { LearnerProfile } from "../data/learnerProfiles";
import { learnerTotals, readLearnerSummary } from "../data/learnerSummary";
import { defaultLearnerAvatarId, learnerAvatars } from "../data/learnerAvatars";
import LearnerAvatar from "./LearnerAvatar";
import "./learners.css";

type Props = {
  profiles: LearnerProfile[];
  activeId: string | null;
  error: string;
  deletionError: string;
  feedback: string;
  busy: boolean;
  canImportLegacy: boolean;
  onName: (name: string, avatarId: string) => void;
  onChoose: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onDismissDeletionError: () => void;
  onCancel?: () => void;
};

export default function LearnerPicker({ profiles, activeId, error, deletionError, feedback, busy, canImportLegacy, onName, onChoose, onDelete, onDismissDeletionError, onCancel }: Props) {
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(defaultLearnerAvatarId);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const keepLearner = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!confirmDelete) return;
    const frame = requestAnimationFrame(() => keepLearner.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [confirmDelete]);
  return <main className="kb-learner-picker">
    <div className="kb-learner-brand"><Sprout size={27} aria-hidden="true" />Kids Box</div>
    <div className="kb-learner-heading"><span className="kb-eyebrow">YOUR OWN LITTLE ADVENTURE</span>
      <h1>Who’s learning today?</h1>
      <p>Choose your name or add a learner. Your progress and handwritten notes stay with your name on this device.</p>
    </div>
    {feedback && <p className="kb-learner-feedback" role="status">{feedback}</p>}
    <form className="kb-learner-form" aria-busy={busy} onSubmit={event => { event.preventDefault(); if (!busy) onName(name, avatarId); }}>
      <label htmlFor="kb-learner-name">Your name</label>
      <div className="kb-learner-name-row"><input id="kb-learner-name" name="learner" value={name} maxLength={32} autoComplete="off" autoCapitalize="words" disabled={busy}
        placeholder="Type your name" onChange={event => setName(event.target.value)} required aria-describedby={error ? "kb-learner-error" : "kb-learner-help"} />
        <button className="kb-btn" type="submit" disabled={busy}>Start learning<ArrowRight size={19} aria-hidden="true" /></button></div>
      <fieldset className="kb-avatar-picker" disabled={busy}>
        <legend>Choose your hero</legend>
        <div>{learnerAvatars.map(avatar => <label key={avatar.id} className="kb-avatar-option" data-selected={avatarId === avatar.id || undefined}>
          <input type="radio" name="learner-avatar" value={avatar.id} checked={avatarId === avatar.id} onChange={() => setAvatarId(avatar.id)} />
          <span className="kb-avatar-art"><LearnerAvatar avatarId={avatar.id} />{avatarId === avatar.id && <Check className="kb-avatar-check" size={17} aria-hidden="true" />}</span>
          <span>{avatar.name}</span>
        </label>)}</div>
      </fieldset>
      <p id="kb-learner-help">Using a saved name brings back that learner’s progress.</p>
      {canImportLegacy && <p>Your existing learning records will be kept for the first learner you add.</p>}
      {error && <p id="kb-learner-error" className="kb-learner-error" role="alert">{error}</p>}
    </form>
    {!!profiles.length && <section className="kb-learner-list" aria-label="Saved learners">
      <h2>Pick up where you left off</h2>
      <div>{profiles.map(profile => {
        let summary;
        try { summary = readLearnerSummary(localStorage, profile.id); } catch { /* The learner can still retry opening their records. */ }
        return <article key={profile.id} className="kb-learner-entry">
          <button className="kb-learner-card" disabled={busy} aria-label={`Continue as ${profile.name}`} aria-current={activeId === profile.id ? "true" : undefined} onClick={() => onChoose(profile.id)}>
          <LearnerAvatar avatarId={profile.avatarId} />
          <span className="kb-learner-card-copy"><strong>{profile.name}</strong>
            {summary ? <><span><Footprints size={16} aria-hidden="true" />{summary.words} / {learnerTotals.words} words · {summary.challenges} / {learnerTotals.challenges} challenges</span>
              <span><BookOpen size={16} aria-hidden="true" />{summary.activities} book activities · Page {summary.page}</span></> : <span>Open to view your progress</span>}
          </span><ArrowRight size={21} aria-hidden="true" />
          </button>
          <button className="kb-learner-delete" disabled={busy} aria-label={`Delete learner ${profile.name}`} onClick={() => { onDismissDeletionError(); setConfirmDelete(profile.id); }}><Trash2 size={18} aria-hidden="true" /><span>Delete</span></button>
          {confirmDelete === profile.id && <div className="kb-learner-delete-confirmation" role="group" aria-label={`Delete ${profile.name}’s profile`} aria-busy={busy}>
            <h3>Delete {profile.name}?</h3>
            <p>This permanently deletes this learner’s profile, learning progress, handwritten notes, personal settings and saved videos on this device. Downloaded or shared video copies will stay. Other learners will keep their data.</p>
            {deletionError && <p className="kb-learner-error" role="alert">{deletionError}</p>}
            <div><button ref={keepLearner} className="kb-btn kb-btn-secondary" disabled={busy} onClick={() => { setConfirmDelete(null); onDismissDeletionError(); }}>Keep learner</button>
              <button className="kb-btn kb-btn-danger" disabled={busy} onClick={() => { void onDelete(profile.id).then(deleted => { if (deleted) setConfirmDelete(null); }); }}>{busy ? "Deleting…" : "Delete learner"}</button></div>
          </div>}
        </article>;
      })}</div>
    </section>}
    {onCancel && <button className="kb-btn kb-btn-secondary kb-learner-back" disabled={busy} onClick={onCancel}>Back to learning</button>}
    <p className="kb-avatar-credit">Avatars by <a href="https://icons8.com/icons/set/characters" target="_blank" rel="noreferrer">Icons8</a></p>
  </main>;
}
