import { useRedeploy } from '../hooks/useRedeploy';
import { useProjectDeploys } from '../hooks/useProjectDeploys';
import { ArrowLeftIcon, ExternalLinkIcon, SyncIcon } from './Icons';
import { getProjectIcon, formatProjectType } from '../utils/iconMaps';
import { formatRelativeTime } from '../utils/format';
import StatusPill from './StatusPill';
import './ProjectDetailPage.css';

const DEPLOY_STATUS_COLORS = {
  live: 'var(--accent-green)',
  build_failed: '#A32D2D',
  update_failed: '#A32D2D',
  canceled: 'var(--text-tertiary)',
  deactivated: 'var(--text-tertiary)',
};

export default function ProjectDetailPage({ project, onBack }) {
  const { Icon, color } = getProjectIcon(project.type);
  const { deployState, redeploy } = useRedeploy(project.service_id);
  const { deploys, isLoading } = useProjectDeploys(project.service_id);

  const isDeploying = deployState === 'deploying';
  const buttonLabel =
    deployState === 'deploying' ? 'Deploying…' :
    deployState === 'failed' ? 'Deploy Failed — Retry' :
    deployState === 'live' ? 'Redeployed — Redeploy Again' :
    'Redeploy Latest Commit';

  return (
    <div className="project-detail-page">
      <button className="project-detail-page__back pressable" onClick={onBack}>
        <ArrowLeftIcon /> <span>Projects</span>
      </button>

      <div className="project-detail-page__header">
        <div className="project-detail-page__icon" style={{ background: color }}>
          <Icon />
        </div>
        <div className="project-detail-page__header-text">
          <h1 className="project-detail-page__name">{project.name}</h1>
          <p className="project-detail-page__type">
            {formatProjectType(project.type)} · {project.plan === 'free' ? 'Free' : project.plan}
          </p>
        </div>
        <StatusPill isOnline={project.is_online} />
      </div>

      <section className="card project-detail-page__section">
        <p className="project-detail-page__section-title">Deploy</p>

        {deploys[0] && (
          <>
            <div className="project-detail-page__row">
              <span>Current commit</span>
              <code className="project-detail-page__commit">{deploys[0].commit_id}</code>
            </div>
            <div className="project-detail-page__row">
              <span>Last deployed</span>
              <span className="project-detail-page__muted">{formatRelativeTime(deploys[0].created_at)}</span>
            </div>
          </>
        )}

        <button
          className="redeploy-button pressable-soft"
          onClick={redeploy}
          disabled={isDeploying}
        >
          <SyncIcon className={isDeploying ? 'sync-now-button__icon--spinning' : ''} />
          <span>{buttonLabel}</span>
        </button>
        <p className="project-detail-page__caveat">
          Free tier · brief downtime during deploy · uses pipeline minutes
        </p>
      </section>

      <section className="card project-detail-page__section">
        <p className="project-detail-page__section-title">Recent Deploys</p>
        {isLoading ? (
          <p className="project-detail-page__muted">Loading…</p>
        ) : deploys.length === 0 ? (
          <p className="project-detail-page__muted">No deploy history yet</p>
        ) : (
          deploys.slice(0, 5).map((d) => (
            <div className="deploy-history-row" key={d.id}>
              <span
                className="deploy-history-row__dot"
                style={{ background: DEPLOY_STATUS_COLORS[d.status] || 'var(--text-tertiary)' }}
              />
              <code className="deploy-history-row__commit">{d.commit_id || '—'}</code>
              <span className="deploy-history-row__message">{d.commit_message || 'No message'}</span>
              <span className="deploy-history-row__time">{formatRelativeTime(d.created_at)}</span>
            </div>
          ))
        )}
      </section>

      <section className="card project-detail-page__section">
        <p className="project-detail-page__section-title">Quick Links</p>
        <a href={project.render_url} target="_blank" rel="noopener noreferrer" className="project-detail-page__link-row pressable-soft">
          <span>View on Render</span>
          <ExternalLinkIcon />
        </a>
      </section>
    </div>
  );
}
