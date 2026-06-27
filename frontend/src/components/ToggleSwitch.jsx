import './ToggleSwitch.css';

export default function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      className={`toggle-switch pressable ${checked ? 'toggle-switch--on' : ''}`}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'Disable job' : 'Enable job'}
    >
      <span className="toggle-switch__thumb" />
    </button>
  );
}
