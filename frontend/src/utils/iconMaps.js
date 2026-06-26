import { GlobeIcon, ServerIcon, LayersIcon, StarIcon, SparkleIcon, HexagonIcon } from '../components/Icons';

// Project type -> icon + accent color. Falls back to a generic icon for any
// future Render service type we haven't explicitly mapped.
const PROJECT_TYPE_MAP = {
  web_service: { Icon: GlobeIcon, color: 'var(--accent-purple)' },
  static_site: { Icon: GlobeIcon, color: 'var(--accent-purple)' },
  background_worker: { Icon: LayersIcon, color: '#f0883e' },
  private_service: { Icon: ServerIcon, color: 'var(--accent-blue)' },
  cron_job: { Icon: ServerIcon, color: 'var(--accent-blue)' },
};

const DEFAULT_PROJECT_ICON = { Icon: LayersIcon, color: 'var(--accent-gray)' };

export function getProjectIcon(type) {
  return PROJECT_TYPE_MAP[type] || DEFAULT_PROJECT_ICON;
}

export function formatProjectType(type) {
  if (!type) return 'Service';
  return type
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

// API provider name -> icon + color + gradient. Matched by case-insensitive
// substring so "Groq API", "groq", etc. all resolve the same way. Any
// provider not in this list still renders correctly with a sensible default —
// this is what makes new providers (OpenRouter, future TTS/STT) "just work"
// the moment the backend starts returning them, no frontend changes needed.
const API_PROVIDER_MAP = [
  { match: 'groq', Icon: StarIcon, color: 'var(--accent-purple)', gradient: ['var(--gradient-purple-start)', 'var(--gradient-purple-end)'] },
  { match: 'gemini', Icon: SparkleIcon, color: 'var(--accent-blue)', gradient: ['var(--gradient-blue-start)', 'var(--gradient-blue-end)'] },
  { match: 'tavily', Icon: SparkleIcon, color: 'var(--accent-blue)', gradient: ['var(--gradient-blue-start)', 'var(--gradient-blue-end)'] },
  { match: 'openrouter', Icon: HexagonIcon, color: 'var(--accent-green)', gradient: ['var(--gradient-green-start)', 'var(--gradient-green-end)'] },
  { match: 'cerebras', Icon: HexagonIcon, color: 'var(--accent-green)', gradient: ['var(--gradient-green-start)', 'var(--gradient-green-end)'] },
];

const DEFAULT_API_ICON = {
  Icon: HexagonIcon,
  color: 'var(--accent-gray)',
  gradient: ['#a8a8b0', '#8e8e93'],
};

export function getApiIcon(name = '') {
  const lower = name.toLowerCase();
  const found = API_PROVIDER_MAP.find((entry) => lower.includes(entry.match));
  return found || DEFAULT_API_ICON;
}
