import StatusPill from './StatusPill';
import { ChevronIcon } from './Icons';
import { getProjectIcon, formatProjectType } from '../utils/iconMaps';
import './ProjectRow.css';

export default function ProjectRow({ project, onSelect }) {
  const { Icon, color } = getProjectIcon(project.type);

  return (
    <button
      onClick={() => onSelect(project)}
      className="project-row pressable-soft"
    >
      <div className="project-row__icon" style={{ background: color }}>
        <Icon />
      </div>
      <div className="project-row__info">
        <div className="project-row__name">{project.name}</div>
        <div className="project-row__type">
          {formatProjectType(project.type)} • {project.plan === 'free' ? 'Free' : project.plan}
        </div>
      </div>
      <StatusPill isOnline={project.is_online} />
      <ChevronIcon className="project-row__chevron" />
    </button>
  );
}
