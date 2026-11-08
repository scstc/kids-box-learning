import { useEffect, useState } from "react";

export function useLearningMotion() {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem("kids-box-motion-v1") !== "off"; } catch { return true; }
  });
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  const toggle = () => setEnabled((current) => {
    try { localStorage.setItem("kids-box-motion-v1", current ? "off" : "on"); } catch { /* The current setting still applies. */ }
    return !current;
  });
  return { enabled, canAnimate: enabled && !reduced, toggle };
}
