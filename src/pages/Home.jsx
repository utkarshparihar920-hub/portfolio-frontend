import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../services/api";
import SEO from "../components/SEO";

function Home() {
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects`);
        const data = await response.json();

        if (response.ok) {
          setProjectCount((data.projects || []).length);
        }
      } catch (error) {
        console.error("Failed to load project count:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <SEO
        title="Utkarsh Parihar | Full Stack Developer"
        description="Explore my portfolio, projects, skills, experience, services, and blog."
      />
      <div className="bg-slate-950 text-white">
        <section className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
          <span className="mb-6 rounded-full border border-blue-400/30 bg-blue-400/10 px-5 py-2 text-sm font-medium text-blue-300">
            Welcome to my portfolio
          </span>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Hi, I'm a{" "}
            <span className="text-blue-400">Full Stack Developer</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            I build modern, responsive, and user-friendly web applications
            using frontend and backend technologies. Explore my work,
            skills, and experience.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/projects"
              className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
            >
              View My Projects
            </Link>

            <Link
              to="/contact"
              className="rounded-lg border border-slate-500 px-7 py-3.5 font-semibold text-white transition hover:border-blue-400 hover:bg-slate-800"
            >
              Contact Me
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold text-blue-400">Frontend</h2>
              <p className="mt-2 text-sm text-slate-400">
                Responsive user interfaces
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold text-blue-400">Backend</h2>
              <p className="mt-2 text-sm text-slate-400">
                APIs and database systems
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold text-blue-400">
                {projectCount}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Projects completed
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;