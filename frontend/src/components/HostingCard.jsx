import ProgressRing from './ProgressRing';
import ProgressBar from './ProgressBar';
import CountUpNumber from './CountUpNumber';
import { LayersIcon, InfoIcon } from './Icons';
import { formatRenewalDate } from '../utils/format';
import './HostingCard.css';

export default function HostingCard({ hosting, versionKey }) {
  const used = hosting?.hours_used ?? 0;
  const total = hosting?.hours_total ?? 750;
  const percent = total > 0 ? (used / total) * 100 : 0;

  return (
    <section className="card hosting-card">
      <div className="hosting-card__header">
        <div className="icon-badge icon-badge--purple">
          <LayersIcon />
        </div>
        <h2 className="hosting-card__title">Render Free Hosting</h2>
      </div>

      <div className="hosting-card__body">
        <div className="hosting-card__stats">
          <div className="hosting-card__number">
            <CountUpNumber value={used} versionKey={versionKey} />
            <span className="hosting-card__number-total"> / {total}</span>
          </div>
          <div className="hosting-card__label">Free Hosting Hours Left</div>
        </div>

        <div className="hosting-card__ring">
          <ProgressRing percent={percent} versionKey={versionKey} />
          <div className="hosting-card__ring-label">
            <CountUpNumber value={percent} versionKey={versionKey} suffix="%" />
          </div>
        </div>
      </div>

      <ProgressBar
        percent={percent}
        versionKey={versionKey}
        gradientFrom="var(--gradient-purple-start)"
        gradientTo="var(--gradient-purple-end)"
      />

      <div className="hosting-card__footer pressable">
        <span>Renews on {formatRenewalDate(hosting?.renews_on)}</span>
        <InfoIcon className="hosting-card__info-icon" />
      </div>
    </section>
  );
}
