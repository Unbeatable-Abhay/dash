import './StatusPill.css';

export default function StatusPill({ isOnline }) {
  return (
    <span className={`status-pill status-pill--fade ${isOnline ? 'status-pill--online' : 'status-pill--offline'}`}>
      {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}
