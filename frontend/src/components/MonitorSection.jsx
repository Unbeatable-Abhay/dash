import JobCard from './JobCard';
import './MonitorSection.css';

export default function MonitorSection({ jobs, onToggle, pendingJobId }) {
  return (
    <section className="card monitor-section">
      <div className="monitor-section__sticky-heading">
        <h2 className="section-heading">Monitor</h2>
        <span className="monitor-section__count">{jobs?.length || 0} jobs</span>
      </div>

      <div className="monitor-section__scroll no-scrollbar">
        {jobs && jobs.length > 0 ? (
          <div className="monitor-section__grid">
            {jobs.map((job) => (
              <JobCard
                key={job.job_id || job.name}
                job={job}
                onToggle={onToggle}
                isPending={pendingJobId === job.job_id}
              />
            ))}
          </div>
        ) : (
          <div className="monitor-section__empty">No cron jobs yet</div>
        )}
      </div>
    </section>
  );
}
