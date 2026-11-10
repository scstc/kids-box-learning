import { useState } from "react";
import CourseApp from "./CourseApp";
import LearnerPicker from "./components/LearnerPicker";
import { chooseLearner, openLearner, readLearnerRegistry, type LearnerRegistry } from "./data/learnerProfiles";
import { LearnerContext } from "./hooks/useLearner";
import { useScreenRecording } from "./hooks/useScreenRecording";

export default function LearnerApp() {
  const { stopBeforeSwitch } = useScreenRecording();
  const [initial] = useState(() => {
    try { return { registry: readLearnerRegistry(localStorage), error: "" }; }
    catch { return { registry: { profiles: [], activeId: null } as LearnerRegistry, error: "Saved learners could not be read. Check this device’s storage and try again." }; }
  });
  const [registry, setRegistry] = useState(initial.registry);
  const [choosing, setChoosing] = useState(false);
  const [error, setError] = useState(initial.error);
  const profile = registry.profiles.find(profile => profile.id === registry.activeId);
  const select = (action: () => { registry: LearnerRegistry }) => {
    try {
      const result = action();
      setRegistry(result.registry);
      setError("");
      setChoosing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "The learner could not be saved. Please try again.");
    }
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
  if (!profile || choosing) return <LearnerPicker profiles={registry.profiles} activeId={profile?.id ?? null} error={error}
    onName={name => select(() => openLearner(localStorage, name))}
    onChoose={id => select(() => chooseLearner(localStorage, id))}
    onCancel={profile ? () => { setError(""); setChoosing(false); } : undefined} />;
  return <LearnerContext.Provider value={{ profile, switchLearner }}><CourseApp key={profile.id} /></LearnerContext.Provider>;
}
