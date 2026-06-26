import { useEffect, useRef, useState } from 'react';

// Cinematic ease-out-with-settle, matching a real gauge needle's weight.
// Fast acceleration, slight overshoot, gentle settle into place.
function easeOutBack(t) {
  const c1 = 1.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Animates a numeric value from 0 to `target` whenever `versionKey` changes.
 * Used for big numbers (512), percentages (68%), and progress widths alike —
 * pass the same versionKey (dataVersion from useDashboardData) to everything
 * so all sweeps trigger in sync whenever fresh data arrives.
 */
export function useCountUp(target, versionKey, durationMs = 1700) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const safeTarget = Number.isFinite(target) ? target : 0;
    const startTime = performance.now();
    setValue(0);

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutBack(progress);
      setValue(safeTarget * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setValue(safeTarget);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, versionKey, durationMs]);

  return value;
}
