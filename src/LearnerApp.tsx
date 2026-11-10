import { useRef, useState } from "react";
import CourseApp from "./CourseApp";
import LearnerPicker from "./components/LearnerPicker";
import { chooseLearner, openLearner, readLearnerRegistry, removeLearner, type LearnerRegistry } from "./data/learnerProfiles";
import { deleteLearnerHandwriting } from "./data/bookInk";
import { screenRecorder } from "./data/screenRecorder";
import { LearnerContext } from "./hooks/useLearner";
import { useScreenRecording } from "./hooks/useScreenRecording";

export default function LearnerApp() {
  const { stopBeforeSwitch, refreshStatus, busy: recordingBusy } = useScreenRecording();
  const [initial] = useState(() => {
    try { return { registry: readLearnerRegistry(localStorage), error: "" }; }
    catch { return { registry: { profiles: [], activeId: null } as LearnerRegistry, error: "Saved learners could not be read. Check this device’s storage and try again." }; }
  });
  const [registry, setRegistry] = useState(initial.registry);
  const [choosing, setChoosing] = useState(false);
  const [error, setError] = useState(initial.error);
  const [deletionError, setDeletionError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [working, setWorking] = useState(false);
  const actionRunning = useRef(false);
  const profile = registry.profiles.find(profile => profile.id === registry.activeId);
  let canImportLegacy = false;
  try { canImportLegacy = localStorage.getItem("kids-box-learners-v1") === null; }
  catch { /* The storage error is already shown in the learner picker. */ }
  const select = async (action: () => { registry: LearnerRegistry }) => {
    if (actionRunning.current) return;
    actionRunning.current = true; setWorking(true); setError("");
    try {
      if (!await stopBeforeSwitch()) {
        setError("Stop and save the current recording before choosing another learner.");
        return;
      }
      const result = action();
      setRegistry(result.registry);
      setDeletionError(""); setFeedback("");
      setChoosing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "The learner could not be saved. Please try again.");
    } finally { actionRunning.current = false; setWorking(false); }
  };
  const switchLearner = async () => {
    if (!await stopBeforeSwitch()) return;
    try {
      const latest = readLearnerRegistry(localStorage);
      setRegistry({ ...latest, activeId: profile?.id ?? null });
      setError("");
    } catch { setError("Saved learners could not be read. Please try again."); }
    setChoosing(true);
  };
  const deleteProfile = async (id: string) => {
    if (actionRunning.current) return false;
    actionRunning.current = true; setWorking(true); setDeletionError(""); setFeedback(""); setError("");
    let deleted = false;
    try {
      const latest = readLearnerRegistry(localStorage);
      if (!latest.profiles.some(item => item.id === id)) throw new Error("This learner profile could not be found.");
      if (!await stopBeforeSwitch()) {
        setDeletionError("Stop and save the current recording before deleting a learner. Then try again.");
        return false;
      }
      const { recordings } = await screenRecorder.listRecordings({ learnerId: id, requireComplete: true });
      for (const recording of recordings) {
        if (recording.learnerId !== id) throw new Error("A saved recording could not be matched to this learner.");
        await screenRecorder.remove({ id: recording.id, learnerId: id });
      }
      await deleteLearnerHandwriting(id);
      const result = removeLearner(localStorage, id);
      setRegistry(result.registry); setChoosing(true);
      setFeedback(`${result.removed.name}’s profile and local learning data were deleted.`);
      deleted = true;
      return true;
    } catch {
      setDeletionError("Deletion could not finish. Some data may already have been removed. The profile is still available; please try deleting it again.");
      return false;
    } finally {
      try { await refreshStatus(); }
      catch { if (deleted) setError("The learner was deleted, but recording status could not be refreshed. Please reopen the app."); }
      actionRunning.current = false; setWorking(false);
    }
  };
  if (!profile || choosing) return <LearnerPicker profiles={registry.profiles} activeId={profile?.id ?? null} error={error}
    deletionError={deletionError} feedback={feedback} busy={working || recordingBusy}
    canImportLegacy={canImportLegacy}
    onName={(name, avatarId) => { void select(() => openLearner(localStorage, name, avatarId)); }}
    onChoose={id => { void select(() => chooseLearner(localStorage, id)); }}
    onDelete={deleteProfile} onDismissDeletionError={() => setDeletionError("")}
    onCancel={profile ? () => { setError(""); setChoosing(false); } : undefined} />;
  return <LearnerContext.Provider value={{ profile, switchLearner }}><CourseApp key={profile.id} /></LearnerContext.Provider>;
}
