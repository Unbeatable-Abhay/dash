import ProjectRow from './ProjectRow';
import './ProjectsSection.css';

export default function ProjectsSection({ projects }) {
  return (
    <section className="card projects-section">
      <h2 className="section-heading projects-section__sticky-heading">Your Render Projects</h2>
      <div className="projects-section__list no-scrollbar">
        {projects && projects.length > 0 ? (
          projects.map((project) => <ProjectRow key={project.name} project={project} />)
        ) : (
          <div className="projects-section__empty">No projects yet</div>
        )}
      </div>
    </section>
  );
}
