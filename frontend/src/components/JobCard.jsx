import DriftGraph from './DriftGraph';
import ToggleSwitch from './ToggleSwitch';
import { ClockIcon, AlertTriangleIcon, XCircleIcon, ActivityIcon } from './Icons';
import { getHealthStatusInfo } from '../utils/iconMaps';
import { formatRelativeToNow } from '../utils/format';
import './JobCard.css';

export default function JobCard({ job, onToggle, isPending }) {
  const { color } = getHealthStatusInfo(job.health_status);
  const isWarning = job.health_status === 'warning';
  const isDanger = job.health_status === 'danger';
  const isDisabled = job.health_status === 'disabled';

  const lastExecutionLabel = formatRelativeToNow(job.last_execution);
  const nextExecutionLabel = formatRelativeToNow(job.next_execution);

  return (
    <div className={`card job-card ${isDisabled ? 'job-card--disabled' : ''}`}>
      <div className="job-card__header">
        <span className="job-card__name">{job.name}</span>
        <div className="job-card__header-right">
          <span className="job-card__dot" style={{ background: color }} />
          <ToggleSwitch
            checked={!!job.is_enabled}
            onChange={(next) => onToggle(job.job_id, next)}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="job-card__meta">
        {lastExecutionLabel && (
          <span className="job-card__meta-item">
            <ClockIcon /> {lastExecutionLabel}
          </span>
        )}

        {isDisabled ? (
          <span className="job-card__meta-item">Paused</span>
        ) : isDanger ? (
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
