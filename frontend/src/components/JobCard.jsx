import DriftGraph from './DriftGraph';
import { ClockIcon, AlertTriangleIcon, XCircleIcon, ActivityIcon } from './Icons';
import { getHealthStatusInfo } from '../utils/iconMaps';
import { formatRelativeToNow } from '../utils/format';
import './JobCard.css';

export default function JobCard({ job }) {
  const { color } = getHealthStatusInfo(job.health_status);
  const isWarning = job.health_status === 'warning';
  const isDanger = job.health_status === 'danger';

  const lastExecutionLabel = formatRelativeToNow(job.last_execution);
  const nextExecutionLabel = formatRelativeToNow(job.next_execution);

  return (
    <div className="card job-card">
      <div className="job-card__header">
        <span className="job-card__name">{job.name}</span>
        <span className="job-card__dot" style={{ background: color }} />
      </div>

      <div className="job-card__meta">
        {lastExecutionLabel && (
          <span className="job-card__meta-item">
            <ClockIcon /> {lastExecutionLabel}
          </span>
        )}

        {isDanger ? (
          <span className="job-card__meta-item job-card__meta-item--danger">
            <XCircleIcon /> Repeated failures
          </span>
        ) : isWarning ? (
          <span className="job-card__meta-item job-card__meta-item--warning">
            <AlertTriangleIcon /> Cold start
          </span>
        ) : nextExecutionLabel ? (
          <span className="job-card__meta-item">
            <ActivityIcon /> {nextExecutionLabel}
          </span>
        ) : null}
      </div>

      <DriftGraph history={job.history} color={color} />
    </div>
  );
}
