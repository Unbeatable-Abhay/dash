import './AmbientBackground.css';

/**
 * Soft, blurred bokeh-light ambiance behind the dashboard, matching the
 * reference images' floating-glass-panel-over-a-photo feel — built as a
 * layered radial-gradient scene rather than a stock photo, so it adapts
 * cleanly to light/dark theme and never needs a licensed image asset.
 */
export default function AmbientBackground() {
  return <div className="ambient-background" aria-hidden="true" />;
}
