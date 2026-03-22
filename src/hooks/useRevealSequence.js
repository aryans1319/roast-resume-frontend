import { useState, useEffect } from "react";

/**
 * 5-phase reveal sequence.
 * Each phase unlocks the next section of results.
 *
 * Phase 0 → Score ring appears
 * Phase 1 → Savage one-liner typewriter
 * Phase 2 → Issues reveal one by one
 * Phase 3 → Breakdown panels slide in
 * Phase 4 → Recruiter chat messages appear
 */
const PHASE_DELAYS = [
  0,     // phase 0: immediate
  1800,  // phase 1: after score ring animates
  3600,  // phase 2: after one-liner types out
  5800,  // phase 3: after issues appear
  7800,  // phase 4: after breakdown
];

export const useRevealSequence = (active) => {
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    if (!active) { setPhase(-1); return; }

    const timers = PHASE_DELAYS.map((delay, i) =>
      setTimeout(() => setPhase(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return phase;
};