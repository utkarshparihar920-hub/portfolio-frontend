import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import SEO from "../components/SEO";

function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAbout() {
      try {
        const response = await fetch(`${API_URL}/api/about`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load About data");
        }

        setAbout(data.about?.[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAbout();
  }, []);

  return (
    <>
    <SEO
  title="About Me | Utkarsh Parihar"
  description="Learn more about Utkarsh Parihar, a Full Stack Developer, his skills, experience, and background."
/>

    <div className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Get to know me
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {about?.title || "About Me"}
          </h1>

          <div className="mt-5 h-1 w-20 rounded-full bg-blue-500" />
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">Loading About information...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && about && (
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex justify-center">
              <div className="flex h-72 w-72 items-center justify-center overflow-hidden rounded-2xl border border-blue-400/30 bg-slate-900 sm:h-96 sm:w-96">
                {about.imageUrl ? (
                  <img
                    src={`${API_URL}${about.imageUrl}`}
                    alt={about.title || "About me"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-500/10 text-5xl font-bold text-blue-400">
                      👨‍💻
                    </div>

                    <p className="mt-5 text-sm text-slate-400">
                      Profile Photo
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {about.title}
              </h2>

              <p className="mt-6 whitespace-pre-line leading-8 text-slate-300">
                {about.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                  <h3 className="font-semibold text-blue-400">
                    Frontend
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Creating responsive interfaces
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                  <h3 className="font-semibold text-blue-400">
                    Backend
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Building APIs and databases
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !about && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              About information is not available yet.
            </p>
          </div>
        )}
      </section>
    </div>
    </>
  );
}

export default About;