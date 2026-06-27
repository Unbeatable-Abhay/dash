import { useState } from 'react';
import { TABS } from '../utils/tabs';
import SettingsContent from './SettingsContent';
import { formatRelativeTime } from '../utils/format';
import { SyncIcon } from './Icons';
import './WebShell.css';

export default function WebShell({ data, isSyncing, syncError, onSync, dashboardContent, monitorContent }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="web-shell">
      <header className="web-shell__header">
        <div>
          <h1 className="web-shell__title">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'monitor' && 'Monitor'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          <p className="web-shell__subtitle">
            {activeTab === 'dashboard' && 'Overview of your usage and projects'}
            {activeTab === 'monitor' && 'Cron job health at a glance'}
            {activeTab === 'settings' && 'Personal dashboard configuration'}
          </p>
        </div>

        {activeTab === 'dashboard' && (
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
        )}
      </header>

      <nav className="web-tab-row">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`web-tab-row__item pressable ${activeTab === tab.id ? 'web-tab-row__item--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.Icon />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="web-shell__main">
        <div key={activeTab} className="web-shell__page-fade">
          {activeTab === 'dashboard' && dashboardContent}
          {activeTab === 'monitor' && monitorContent}
          {activeTab === 'settings' && (
            <SettingsContent
              lastSyncedAt={data.last_synced_at}
              isSyncing={isSyncing}
              syncError={syncError}
              onSync={onSync}
            />
          )}
        </div>
      </main>

      {syncError && <div className="web-shell__error-toast">{syncError}</div>}
    </div>
  );
}
