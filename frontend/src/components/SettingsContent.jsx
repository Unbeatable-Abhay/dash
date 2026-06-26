import { useTheme } from '../context/ThemeContext';
import { BrushIcon, SunIcon, MoonIcon, SyncIcon, InfoIcon, TerminalIcon, HeartIcon } from './Icons';
import { formatRelativeTime } from '../utils/format';
import './SettingsContent.css';

export default function SettingsContent({ lastSyncedAt, isSyncing, syncError, onSync, variant = 'card' }) {
  const { theme, setTheme } = useTheme();
  const sectionClass = variant === 'flat' ? 'settings-section settings-section--flat' : 'card settings-section';

  return (
    <div className={`settings-content settings-content--${variant}`}>
      <section className={sectionClass}>
        <div className="settings-section__header">
          <div className="icon-badge icon-badge--purple">
            <BrushIcon />
          </div>
          <div className="settings-section__header-text">
            <div className="settings-section__title">Appearance</div>
            <div className="settings-section__subtitle">Customize how the app looks</div>
          </div>
        </div>

        <div className="settings-section__label">Theme</div>

        <div className="theme-options">
          <button
            className={`theme-option pressable-soft ${theme === 'light' ? 'theme-option--active' : ''}`}
            onClick={() => setTheme('light')}
          >
            <span className="theme-option__icon"><SunIcon /></span>
            <span className="theme-option__label">Light</span>
            <span className={`radio-dot ${theme === 'light' ? 'radio-dot--active' : ''}`} />
          </button>

          <button
            className={`theme-option pressable-soft ${theme === 'dark' ? 'theme-option--active' : ''}`}
            onClick={() => setTheme('dark')}
          >
            <span className="theme-option__icon"><MoonIcon /></span>
            <span className="theme-option__label">Dark</span>
            <span className={`radio-dot ${theme === 'dark' ? 'radio-dot--active' : ''}`} />
          </button>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="settings-section__header">
          <div className="icon-badge icon-badge--purple">
            <SyncIcon />
          </div>
          <div className="settings-section__header-text">
            <div className="settings-section__title">Sync</div>
            <div className="settings-section__subtitle">Keep your dashboard up to date</div>
          </div>
        </div>

        <div className="sync-status-block">
          <div className="sync-status-block__row">
            <span className="sync-status-block__dot" />
            <span className="sync-status-block__label">{isSyncing ? 'Syncing…' : 'Synced'}</span>
          </div>
          <div className="sync-status-block__time">{formatRelativeTime(lastSyncedAt)}</div>

          <button
            className="sync-now-button pressable-soft"
            onClick={onSync}
            disabled={isSyncing}
          >
            <SyncIcon className={isSyncing ? 'sync-now-button__icon--spinning' : ''} />
            <span>{isSyncing ? 'Syncing…' : 'Sync Now'}</span>
          </button>

          {syncError && <div className="sync-error-toast">{syncError}</div>}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="settings-section__header">
          <div className="icon-badge icon-badge--purple">
            <InfoIcon />
          </div>
          <div className="settings-section__header-text">
            <div className="settings-section__title">About</div>
            <div className="settings-section__subtitle">App information</div>
          </div>
        </div>

        <div className="about-row">
          <span className="about-row__icon"><TerminalIcon /></span>
          <span className="about-row__label">Version</span>
          <span className="about-row__value">1.0</span>
        </div>
        <div className="about-row">
          <span className="about-row__icon"><HeartIcon /></span>
          <span className="about-row__label">Made by Abhay with 💖</span>
        </div>
      </section>
    </div>
  );
}
