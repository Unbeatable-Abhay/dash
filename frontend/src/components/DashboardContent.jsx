import HostingCard from './HostingCard';
import ApiCreditsSection from './ApiCreditsSection';
import ProjectsSection from './ProjectsSection';
import GithubStatsSection from './GithubStatsSection';
import './DashboardContent.css';

export default function DashboardContent({ data, versionKey, onSelectProject }) {
  return (
    <div className="dashboard-content">
      <div className="dashboard-content__top-row">
        <HostingCard hosting={data.hosting} versionKey={versionKey} />
        <ApiCreditsSection apis={data.apis} versionKey={versionKey} />
      </div>
      <ProjectsSection projects={data.projects} onSelectProject={onSelectProject} />
      <GithubStatsSection repos={data.github} />
    </div>
  );
}
