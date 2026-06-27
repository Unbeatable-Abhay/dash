import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

export function useProjectDeploys(serviceId) {
  const [deploys, setDeploys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`${API_BASE}/api/projects/${serviceId}/deploys`)
      .then((res) => (res.ok ? res.json() : { deploys: [] }))
      .then((data) => {
        if (!cancelled) setDeploys(data.deploys || []);
      })
      .catch(() => {
        if (!cancelled) setDeploys([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [serviceId]);

  return { deploys, isLoading };
}
