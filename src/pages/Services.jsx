import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import SEO from "../components/SEO";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/services`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch services");
        }

        setServices(data.services || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <SEO
        title="Services | Utkarsh Parihar"
        description="Explore the web development services offered by Utkarsh Parihar, including modern, responsive, and maintainable web applications."
      />

      <div className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              What I offer
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              My <span className="text-blue-400">Services</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
              Development services focused on building practical,
              responsive, and maintainable web applications.
            </p>
          </div>

          {loading && (
            <div className="py-10 text-center text-slate-400">
              Loading services...
            </div>
          )}

          {!loading && error && (
            <div className="py-10 text-center text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="py-10 text-center text-slate-400">
              No services available yet.
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500/60"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                    {service.iconUrl ? (
                      <img
                        src={`${API_URL}${service.iconUrl}`}
                        alt={service.title}
                        className="h-8 w-8 rounded-lg object-contain"
                      />
                    ) : (
                      <span className="text-xl font-bold text-blue-400">+</span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold">
                    {service.title}
                  </h2>

                  <p className="mt-4 leading-7 text-slate-400">
                    {service.description}
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

export default Services;