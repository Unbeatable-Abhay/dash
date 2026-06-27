/**
 * Plots recent execution durations as a simple line graph, newest point on
 * the right. History arrives newest-first from the backend, so it's
 * reversed here for left-to-right chronological reading.
 *
 * A point is visually flagged (filled circle) when its duration is more
 * than 2.5x the median of the visible series — a looser visual threshold
 * than the backend's own health-status heuristic, since this just needs to
 * catch the eye, not classify health.
 */
export default function DriftGraph({ history, color }) {
  const points = (history || [])
    .filter((h) => Number.isFinite(h.duration))
    .map((h) => h.duration)
    .reverse();

  if (points.length < 2) {
    return (
      <svg viewBox="0 0 320 50" style={{ width: '100%', height: 50, display: 'block' }}>
        <line x1="0" y1="38" x2="320" y2="38" stroke="var(--border-row)" strokeWidth="0.5" />
      </svg>
    );
  }

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const sorted = [...points].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  const width = 320;
  const topPad = 8;
  const bottomPad = 12;
  const usableHeight = 50 - topPad - bottomPad;

  const coords = points.map((val, i) => {
    const x = (i / (points.length - 1)) * width;
    const normalized = (val - min) / range;
    const y = topPad + (1 - normalized) * usableHeight;
    return { x, y, val };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y.toFixed(1)}`).join(' ');
  const spike = coords.find((c) => median > 0 && c.val > median * 2.5);

  return (
    <svg viewBox="0 0 320 50" style={{ width: '100%', height: 50, display: 'block' }}>
      <line x1="0" y1="38" x2="320" y2="38" stroke="var(--border-row)" strokeWidth="0.5" />
      <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {spike && <circle cx={spike.x} cy={spike.y} r="3" fill={color} />}
    </svg>
  );
}
