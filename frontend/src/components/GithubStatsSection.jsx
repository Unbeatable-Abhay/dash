import GithubRepoCard from './GithubRepoCard';
import './GithubStatsSection.css';

export default function GithubStatsSection({ repos }) {
  if (!repos || repos.length === 0) return null;

  return (
    <section className="github-stats-section">
      <h2 className="section-heading">GitHub Stats</h2>
      <div className="github-stats-section__scroll-wrap">
        <div className="github-stats-section__row no-scrollbar">
          {repos.map((repo) => (
            <GithubRepoCard key={repo.name} repo={repo} />
          ))}
        </div>
        <div className="github-stats-section__fade" aria-hidden="true" />
      </div>
    </section>
  );
}
