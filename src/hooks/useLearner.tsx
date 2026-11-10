import { createContext, useContext } from "react";
import type { LearnerProfile } from "../data/learnerProfiles";

export type LearnerSession = { profile: LearnerProfile; switchLearner: () => void };
export const LearnerContext = createContext<LearnerSession | null>(null);

export function useLearner(): LearnerSession {
  const session = useContext(LearnerContext);
  if (!session) throw new Error("A learner must be selected before opening learning activities.");
  return session;
}
