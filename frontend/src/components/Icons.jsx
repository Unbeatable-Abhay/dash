// Minimal, consistent stroke-based icon set — no external icon library
// dependency needed for this small, fixed set of icons.

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
};

export function ActivityIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        d="M3 12.5h3.5l2-6 4 13 2.5-9.5 1.5 2.5H21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3.2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AlertTriangleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 4.2 21 19.5H3L12 4.2Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function XCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function GithubIcon(props) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.34-1.11.62-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.34 9.34 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .28.18.6.69.5C19.13 20.62 22 16.78 22 12.25 22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5M5 12l6-6M5 12l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalLinkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 7H6a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 6 19h9a1.5 1.5 0 0 0 1.5-1.5v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 5h6v6M19 5l-9 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GearIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
        stroke="currentColor" strokeWidth="1.7"
      />
      <path
        d="M12 2.75v2.4M12 18.85v2.4M5.64 5.64l1.7 1.7M16.66 16.66l1.7 1.7M2.75 12h2.4M18.85 12h2.4M5.64 18.36l1.7-1.7M16.66 7.34l1.7-1.7"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      />
    </svg>
  );
}

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
    </svg>
  );
}

export function SyncIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3M19.5 12a7.5 7.5 0 0 1-12.8 5.3"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
      <path d="M17.3 3.5v3.6h-3.6M6.7 20.5v-3.6h3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function ChevronIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GridIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" fill="currentColor" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" fill="currentColor" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" fill="currentColor" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" fill="currentColor" />
    </svg>
  );
}

export function LayersIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 4 8l8 4.5 8-4.5-8-4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 12l8 4.5 8-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 16l8 4.5 8-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function GlobeIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 12h17M12 3.5a13 13 0 0 1 0 17M12 3.5a13 13 0 0 0 0 17" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ServerIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4.5" width="16" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="13.5" width="16" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.3" cy="7.5" r="0.9" fill="currentColor" />
      <circle cx="7.3" cy="16.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function StarIcon(props) {
  return (
    <svg {...base} {...props} fill="currentColor">
      <path d="M12 3.5l2.4 5.4 5.9.6-4.5 4 1.3 5.8L12 16.4l-5.1 2.9 1.3-5.8-4.5-4 5.9-.6L12 3.5Z" />
    </svg>
  );
}

export function SparkleIcon(props) {
  return (
    <svg {...base} {...props} fill="currentColor">
      <path d="M12 3l1.8 5.6L19.4 10l-5.6 1.8L12 17.4l-1.8-5.6L4.6 10l5.6-1.4L12 3Z" />
    </svg>
  );
}

export function HexagonIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 3.5 19 8v8l-7 4.5L5 16V8l7-4.5Z"
        stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrushIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        d="M16.5 3.5c1.1 0 2 .9 2 2 0 .6-.2 1.1-.6 1.5L10 15l-3.5 1L7.5 12.5l7.9-7.9c.4-.4.9-.6 1.1-.6Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <path d="M6.5 13.5 4 19l5.5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartIcon(props) {
  return (
    <svg {...base} {...props} fill="currentColor">
      <path d="M12 20s-7-4.4-9.5-9C1 8 1.8 4.8 4.7 3.8 7 3 9 4 12 7c3-3 5-4 7.3-3.2 2.9 1 3.7 4.2 2.2 7.2C19 15.6 12 20 12 20Z" />
    </svg>
  );
}

export function TerminalIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9.5 10 12l-3 2.5M12 14.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
