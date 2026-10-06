import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import SEO from "../components/SEO";
function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await fetch(`${API_URL}/api/experience`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load experience");
        }
        setExperiences(data.experiences || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);
  return (
    <>
      <SEO
        title="Experience | Utkarsh Parihar"
        description="Explore the professional experience and development journey of Utkarsh Parihar, a Full Stack Developer."
      />

      <div className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              My journey
            </p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              Work <span className="text-blue-400">Experience</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
              My professional journey and practical development experience.
            </p>
          </div>
          {loading && (
            <p className="text-center text-slate-400">
              Loading experience...
            </p>
          )}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-400">
              {error}
            </div>
          )}
          {!loading && !error && experiences.length === 0 && (
            <p className="text-center text-slate-400">
              No experience has been added yet.
            </p>
          )}
          {!loading && !error && experiences.length > 0 && (
            <div className="relative space-y-8 border-l-2 border-blue-500/40 pl-8 sm:pl-10">
              {experiences.map((experience) => (
                <article
                  key={experience.id}
                  className="relative rounded-xl border border-slate-700 bg-slate-900 p-6 sm:p-8"
                >
                  <span className="absolute -left-[43px] top-8 h-5 w-5 rounded-full border-4 border-slate-950 bg-blue-500 sm:-left-[51px]" />
                  <span className="text-sm font-semibold text-blue-400">
                    {experience.startDate
                      ? new Date(experience.startDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )
                      : ""}
                    {" – "}
                    {experience.current
                      ? "Present"
                      : experience.endDate
                        ? new Date(experience.endDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )
                        : ""}
                  </span>
                  <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                    {experience.position}
                  </h2>
                  <p className="mt-2 font-medium text-slate-300">
                    {experience.company}
                  </p>
                  <p className="mt-5 leading-7 text-slate-400">
                    {experience.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
export default Experience;