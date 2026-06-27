import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

/**
 * Toggles a single cron job's enabled state.
 *
 * Optimistic: the switch flips immediately in the UI, then the request
 * fires. If the request fails, the switch reverts and a brief error shows
 * — rather than making the user wait for a round trip before seeing any
 * feedback, which would feel sluggish for a simple on/off control.
 */
export function useJobToggle(onToggled) {
  const [pendingJobId, setPendingJobId] = useState(null);
  const [toggleError, setToggleError] = useState(null);

  const toggleJob = useCallback(async (jobId, nextEnabled) => {
    setPendingJobId(jobId);
    setToggleError(null);
    onToggled(jobId, nextEnabled); // optimistic update

    try {
      const res = await fetch(`${API_BASE}/api/monitor/${jobId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextEnabled }),
      });
      if (!res.ok) throw new Error('Toggle failed');
    } catch {
      onToggled(jobId, !nextEnabled); // roll back
      setToggleError("Couldn't update job");
      setTimeout(() => setToggleError(null), 3000);
    } finally {
      setPendingJobId(null);
    }
  }, [onToggled]);

  return { toggleJob, pendingJobId, toggleError };
}
