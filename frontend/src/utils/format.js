export function formatCountdown(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0h 0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function formatRenewalDate(isoDateStr) {
  if (!isoDateStr) return 'Unknown';
  const date = new Date(isoDateStr);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatRelativeTime(isoDateStr) {
  if (!isoDateStr) return 'Never';
  const date = new Date(isoDateStr);
  if (Number.isNaN(date.getTime())) return 'Never';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec} seconds ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
}

export function formatRelativeToNow(isoDateStr) {
  if (!isoDateStr) return null;
  const date = new Date(isoDateStr);
  if (Number.isNaN(date.getTime())) return null;

  const diffMs = date.getTime() - Date.now();
  const isFuture = diffMs > 0;
  const diffSec = Math.abs(Math.floor(diffMs / 1000));

  let label;
  if (diffSec < 60) label = `${diffSec}s`;
  else if (diffSec < 3600) label = `${Math.floor(diffSec / 60)}m`;
  else if (diffSec < 86400) label = `${Math.floor(diffSec / 3600)}h`;
  else label = `${Math.floor(diffSec / 86400)}d`;

  return isFuture ? `in ${label}` : `${label} ago`;
}

export function formatNumber(n) {
  if (!Number.isFinite(n)) return '0';
  // Show one decimal only when needed (e.g. 497.57 -> "497.6"), whole
  // numbers stay clean (e.g. 1250 -> "1,250")
  const rounded = Math.round(n * 10) / 10;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 1 });
}
