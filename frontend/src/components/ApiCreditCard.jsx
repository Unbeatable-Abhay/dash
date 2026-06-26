import ProgressBar from './ProgressBar';
import CountUpNumber from './CountUpNumber';
import { InfoIcon } from './Icons';
import { getApiIcon } from '../utils/iconMaps';
import { formatCountdown } from '../utils/format';
import './ApiCreditCard.css';

export default function ApiCreditCard({ api, versionKey }) {
  const { Icon, gradient } = getApiIcon(api.name);
  const used = api.used ?? 0;
  const total = api.total ?? 0;
  const percent = total > 0 ? (used / total) * 100 : 0;

  return (
    <div className="card api-card">
      <div className="api-card__header">
        <div
          className="icon-badge"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        >
          <Icon />
        </div>
        <span className="api-card__name">{api.name}</span>
      </div>

      <div className="api-card__number">
        <CountUpNumber value={used} versionKey={versionKey} />
        <span className="api-card__number-total"> / {total}</span>
      </div>
      <div className="api-card__label">Credits Left</div>

      <ProgressBar
        percent={percent}
        versionKey={versionKey}
        gradientFrom={gradient[0]}
        gradientTo={gradient[1]}
      />

      <div className="api-card__footer pressable">
        <span>Resets in {formatCountdown(api.resets_in_seconds)}</span>
        <InfoIcon className="api-card__info-icon" />
      </div>
    </div>
  );
}
