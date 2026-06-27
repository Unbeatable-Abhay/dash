import { useState, Fragment } from 'react';
import { TABS } from '../utils/tabs';
import SettingsContent from './SettingsContent';
import './MobileShell.css';

export default function MobileShell({ data, isSyncing, syncError, onSync, dashboardContent, monitorContent }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const titles = {
    dashboard: ['Dashboard', 'Overview of your usage and projects'],
    monitor: ['Monitor', 'Cron job health at a glance'],
    settings: ['Settings', 'Personal dashboard configuration'],
  };
  const [title, subtitle] = titles[activeTab];

  return (
    <div className="mobile-shell">
      <main className="mobile-shell__main">
        <div key={activeTab} className="mobile-shell__screen-fade">
          <header className="mobile-shell__header">
            <h1 className="mobile-shell__title">{title}</h1>
            <p className="mobile-shell__subtitle">{subtitle}</p>
          </header>

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

      <nav className="tab-bar">
        {TABS.map((tab, i) => (
          <Fragment key={tab.id}>
            {i > 0 && <div className="tab-bar__divider" />}
            <button
              className={`tab-bar__item pressable ${activeTab === tab.id ? 'tab-bar__item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.Icon />
              <span>{tab.label}</span>
            </button>
          </Fragment>
        ))}
      </nav>

      {syncError && <div className="mobile-shell__error-toast">{syncError}</div>}
    </div>
  );
}
