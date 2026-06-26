import ApiCreditCard from './ApiCreditCard';
import './ApiCreditsSection.css';

export default function ApiCreditsSection({ apis, versionKey }) {
  if (!apis || apis.length === 0) return null;

  return (
    <section className="api-credits-section">
      <h2 className="section-heading">API Credits Left Today</h2>
      <div className="api-credits-section__scroll-wrap">
        <div className="api-credits-section__row no-scrollbar">
          {apis.map((api) => (
            <ApiCreditCard key={api.name} api={api} versionKey={versionKey} />
          ))}
        </div>
        {/* Soft edge fade — the iOS-style "there's more, swipe" affordance.
            Purely decorative, pointer-events disabled so it never blocks
            the actual scroll gesture underneath it. */}
        <div className="api-credits-section__fade" aria-hidden="true" />
      </div>
    </section>
  );
}
