import { useCountUp } from '../hooks/useCountUp';

/**
 * SVG arc that sweeps from 0 to `percent` whenever versionKey changes.
 * This is the literal "speedometer needle" element — used standalone on
 * the hosting card.
 */
export default function ProgressRing({ percent, versionKey, size = 96, strokeWidth = 9 }) {
  const animatedPercent = useCountUp(percent, versionKey);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(animatedPercent, 100) / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--bg-track)"
        strokeWidth={strokeWidth}
      />
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gradient-purple-start)" />
          <stop offset="100%" stopColor="var(--gradient-purple-end)" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
