import { useEffect, useRef, useState } from 'react';
import { GearIcon, SyncIcon } from './Icons';
import SettingsContent from './SettingsContent';
import { formatRelativeTime } from '../utils/format';
import './WebShell.css';

export default function WebShell({ data, isSyncing, syncError, onSync, children }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  const gearRef = useRef(null);

  useEffect(() => {
    if (!isPopoverOpen) return;
    function handleClickOutside(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        !gearRef.current.contains(e.target)
      ) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopoverOpen]);

  return (
    <div className="web-shell">
      <header className="web-shell__header">
        <div>
          <h1 className="web-shell__title">Dashboard</h1>
          <p className="web-shell__subtitle">Overview of your usage and projects</p>
        </div>

        <div className="web-shell__header-right">
          <div className="sync-indicator-pill">
            <span className="sync-indicator-pill__dot" />
            <span>{isSyncing ? 'Syncing…' : 'Last Synced'}</span>
            <span className="sync-indicator-pill__time">{formatRelativeTime(data.last_synced_at)}</span>
            <button
              className="sync-indicator-pill__refresh pressable"
              onClick={onSync}
              disabled={isSyncing}
              aria-label="Sync now"
            >
              <SyncIcon className={isSyncing ? 'sync-now-button__icon--spinning' : ''} />
            </button>
          </div>

          <button
            ref={gearRef}
            className="gear-button pressable"
            onClick={() => setIsPopoverOpen((v) => !v)}
            aria-label="Settings"
          >
            <GearIcon />
          </button>
        </div>

        {isPopoverOpen && (
          <div ref={popoverRef} className="settings-popover">
            <h2 className="settings-popover__title">Settings</h2>
            <p className="settings-popover__subtitle">Personal dashboard configuration</p>
            <SettingsContent
              lastSyncedAt={data.last_synced_at}
              isSyncing={isSyncing}
              syncError={syncError}
              onSync={onSync}
              variant="flat"
            />
          </div>
        )}
      </header>

      <main className="web-shell__main">{children}</main>

      {syncError && <div className="web-shell__error-toast">{syncError}</div>}
    </div>
  );
}
