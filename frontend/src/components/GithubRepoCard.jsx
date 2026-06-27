import { GithubIcon } from './Icons';
import './GithubRepoCard.css';

export default function GithubRepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card github-repo-card pressable-soft"
    >
      <div className="github-repo-card__header">
        <span className="icon-badge icon-badge--neutral github-repo-card__icon">
          <GithubIcon />
        </span>
        <span className="github-repo-card__name">{repo.name}</span>
      </div>

      <div className="github-repo-card__stats">
        <div className="github-repo-card__stat">
          <span className="github-repo-card__stat-value">{repo.stars}</span>
          <span className="github-repo-card__stat-label">Stars</span>
        </div>
        <div className="github-repo-card__stat">
          <span className="github-repo-card__stat-value">{repo.forks}</span>
          <span className="github-repo-card__stat-label">Forks</span>
        </div>
        <div className="github-repo-card__stat">
          <span className="github-repo-card__stat-value">{repo.unique_views_14d}</span>
          <span className="github-repo-card__stat-label">Visitors</span>
        </div>
        <div className="github-repo-card__stat">
          <span className="github-repo-card__stat-value">{repo.clones_14d}</span>
          <span className="github-repo-card__stat-label">Clones</span>
        </div>
      </div>

      <span className="github-repo-card__window">Last 14 days</span>
    </a>
  );
}
