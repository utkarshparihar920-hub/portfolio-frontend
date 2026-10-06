import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import SEO from "../components/SEO";
function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`${API_URL}/api/projects`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load projects");
        }
        setProjects(data.projects || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);
  return (
    <>
      <SEO
        title="Projects | Utkarsh Parihar"
        description="Explore the projects built by Utkarsh Parihar, a Full Stack Developer, using modern frontend and backend technologies."
      />

      <div className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              My work
            </p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              Featured <span className="text-blue-400">Projects</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
              A selection of projects I've built while developing my
              frontend and backend skills.
            </p>
          </div>
          {loading && (
            <p className="text-center text-slate-400">
              Loading projects...
            </p>
          )}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-400">
              {error}
            </div>
          )}
          {!loading && !error && projects.length === 0 && (
            <p className="text-center text-slate-400">
              No projects have been added yet.
            </p>
          )}
          {!loading && !error && projects.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition hover:-translate-y-1 hover:border-blue-500/60"
                >
                  <div className="flex h-48 items-center justify-center bg-slate-800">
                    {project.imageUrl ? (
                      <img
                        src={`${API_URL}${project.imageUrl}`}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-slate-500">
                        Project Image
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-xl font-bold">{project.title}</h2>
                    <p className="mt-4 flex-1 leading-7 text-slate-400">
                      {project.description}
                    </p>
                    {project.technologies && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {Array.isArray(project.technologies) &&
                          project.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
                            >
                              {technology}
                            </span>
                          ))}
                      </div>
                    )}
                    <div className="mt-6 flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:bg-slate-800"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
export default Projects;