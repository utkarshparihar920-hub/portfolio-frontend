import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import SEO from "../components/SEO";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch(`${API_URL}/api/skills`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load skills");
        }

        setSkills(data.skills || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  return (
    <>
      <SEO
        title="Skills | Utkarsh Parihar"
        description="Explore the technical skills and technologies used by Utkarsh Parihar to build modern web applications."
      />

      <div className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              What I work with
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              My <span className="text-blue-400">Skills</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
              Technologies and tools I use to build modern web applications.
            </p>
          </div>

          {loading && (
            <p className="text-center text-slate-400">
              Loading skills...
            </p>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && skills.length === 0 && (
            <p className="text-center text-slate-400">
              No skills have been added yet.
            </p>
          )}

          {!loading && !error && skills.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-blue-500/60"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {skill.iconUrl && (
                        <img
                          src={`${API_URL}${skill.iconUrl}`}
                          alt={skill.name}
                          className="h-10 w-10 rounded-lg object-contain"
                        />
                      )}

                      <h2 className="text-lg font-semibold">{skill.name}</h2>
                    </div>

                    {skill.level !== null && skill.level !== undefined && (
                      <span className="text-sm font-medium text-blue-400">
                        {skill.level}%
                      </span>
                    )}
                  </div>

                  {skill.level !== null && skill.level !== undefined && (
                    <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, skill.level))}%`,
                        }}
                      />
                    </div>
                  )}

                  {skill.category && (
                    <p className="mt-4 text-sm text-slate-400">
                      {skill.category}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default Skills;