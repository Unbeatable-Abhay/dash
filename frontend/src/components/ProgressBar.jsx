import { useCountUp } from '../hooks/useCountUp';
import './ProgressBar.css';

export default function ProgressBar({ percent, versionKey, gradientFrom, gradientTo }) {
  const animatedPercent = useCountUp(percent, versionKey);
  const clamped = Math.min(Math.max(animatedPercent, 0), 100);

  return (
    <div className="progress-bar-track">
      <div
        className="progress-bar-fill"
        style={{
          width: `${clamped}%`,
          background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
        }}
      />
    </div>
  );
}
