import { useCallback, useEffect, useState, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

const EMPTY_DATA = {
  last_synced_at: null,
  hosting: { hours_used: 0, hours_total: 750, renews_on: null },
  apis: [],
  projects: [],
  monitor: [],
};

/**
 * Central data hook for the whole dashboard.
 *
 * - Loads cached data once on mount (GET /api/dashboard)
 * - Exposes sync() which calls POST /api/sync (used by the Sync Now button)
 * - Tracks a "data version" counter that increments on every successful fetch,
 *   so components can key their sweep animations off it and replay the
 *   speedometer effect any time fresh data arrives — whether from the initial
 *   load or a manual sync. Same trigger, no special-casing.
 * - Sync failures never touch existing data — old numbers stay on screen,
 *   only a transient error message is surfaced.
 */
export function useDashboardData() {
  const [data, setData] = useState(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard`);
        if (!res.ok) throw new Error('Failed to load dashboard');
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setDataVersion((v) => v + 1);
        }
      } catch {
        // Backend unreachable on first load — fall back to the empty
        // default. This still renders the zeros-sweep state intentionally,
        // matching the "frontend never needs a special empty state" rule.
        if (!cancelled) setDataVersion((v) => v + 1);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  const sync = useCallback(async () => {
    if (isSyncing) return; // guard against overlapping requests
    setIsSyncing(true);
    setSyncError(null);

    try {
      const res = await fetch(`${API_BASE}/api/sync`, { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      const json = await res.json();
      setData(json);
      setDataVersion((v) => v + 1);
    } catch {
      setSyncError("Couldn't sync, try again");
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => setSyncError(null), 3500);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  const updateJobEnabled = useCallback((jobId, enabled) => {
    setData((prev) => ({
      ...prev,
      monitor: (prev.monitor || []).map((job) => {
        if (job.job_id !== jobId) return job;
        if (!enabled) {
          // Turning off: remember the real status so it can be restored
          // if this gets rolled back after a failed request.
          return { ...job, is_enabled: false, health_status: 'disabled', _priorHealthStatus: job.health_status };
        }
        // Turning on: restore whatever health_status it had before being
        // disabled, if we have it. The next real sync will correct this
        // properly either way — this is just the optimistic guess.
        const restored = job._priorHealthStatus ?? job.health_status;
        return { ...job, is_enabled: true, health_status: restored, _priorHealthStatus: undefined };
      }),
    }));
  }, []);

  return { data, isLoading, isSyncing, syncError, dataVersion, sync, updateJobEnabled };
}
