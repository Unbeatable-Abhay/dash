import { useState } from 'react';
import { GridIcon, GearIcon } from './Icons';
import SettingsContent from './SettingsContent';
import './MobileShell.css';

export default function MobileShell({ data, isSyncing, syncError, onSync, children }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="mobile-shell">
      <main className="mobile-shell__main">
        <div key={activeTab} className="mobile-shell__screen-fade">
          {activeTab === 'dashboard' ? (
            <>
              <header className="mobile-shell__header">
                <h1 className="mobile-shell__title">Dashboard</h1>
                <p className="mobile-shell__subtitle">Overview of your usage and projects</p>
              </header>
              {children}
            </>
          ) : (
            <>
              <header className="mobile-shell__header">
                <h1 className="mobile-shell__title">Settings</h1>
                <p className="mobile-shell__subtitle">Personal dashboard configuration</p>
              </header>
              <SettingsContent
                lastSyncedAt={data.last_synced_at}
                isSyncing={isSyncing}
                syncError={syncError}
                onSync={onSync}
              />
            </>
          )}
        </div>
      </main>

      <nav className="tab-bar">
        <button
          className={`tab-bar__item pressable ${activeTab === 'dashboard' ? 'tab-bar__item--active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <GridIcon />
          <span>Dashboard</span>
        </button>
        <div className="tab-bar__divider" />
        <button
          className={`tab-bar__item pressable ${activeTab === 'settings' ? 'tab-bar__item--active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <GearIcon />
          <span>Settings</span>
        </button>
      </nav>

      {syncError && <div className="mobile-shell__error-toast">{syncError}</div>}
    </div>
  );
}
