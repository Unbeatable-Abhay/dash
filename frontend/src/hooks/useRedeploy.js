import { useState, useCallback, useRef, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';
const POLL_INTERVAL_MS = 10000;

// Render deploy statuses that mean "still working, keep the button locked"
const IN_PROGRESS_STATUSES = ['created', 'build_in_progress', 'update_in_progress', 'pre_deploy_in_progress'];
// Statuses that mean "done, one way or another — unlock the button"
const TERMINAL_STATUSES = ['live', 'build_failed', 'update_failed', 'canceled', 'pre_deploy_failed', 'deactivated'];

export function useRedeploy(serviceId) {
  const [deployState, setDeployState] = useState('idle'); // idle | deploying | live | failed
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollStatus = useCallback((deployId) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/projects/${serviceId}/deploys/${deployId}/status`
        );
        if (!res.ok) throw new Error('Status check failed');
        const { status } = await res.json();

        if (TERMINAL_STATUSES.includes(status)) {
          stopPolling();
          setDeployState(status === 'live' ? 'live' : 'failed');
        }
        // otherwise still in progress — keep polling, no state change needed
      } catch {
        // A single failed poll doesn't give up — Render's API or the
        // network might just have hiccuped. Keep polling; the interval
        // will naturally keep retrying every 10s.
      }
    }, POLL_INTERVAL_MS);
  }, [serviceId, stopPolling]);

  const redeploy = useCallback(async () => {
    setDeployState('deploying');
    try {
      const res = await fetch(`${API_BASE}/api/projects/${serviceId}/redeploy`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Redeploy trigger failed');
      const { deploy_id } = await res.json();
      pollStatus(deploy_id);
    } catch {
      setDeployState('failed');
    }
  }, [serviceId, pollStatus]);

  useEffect(() => stopPolling, [stopPolling]);

  return { deployState, redeploy };
}
