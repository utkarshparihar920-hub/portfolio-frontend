import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import SEO from "../components/SEO";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/blog`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch blog posts");
        }

        setPosts(data.blogs || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <>
      <SEO
        title="Blog | Utkarsh Parihar"
        description="Read articles, tutorials, and development insights from Utkarsh Parihar, a Full Stack Developer."
      />

      <div className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Articles & insights
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              My <span className="text-blue-400">Blog</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
              Articles, tutorials, and development insights from my learning
              and project experience.
            </p>
          </div>

          {loading && (
            <div className="py-10 text-center text-slate-400">
              Loading blog posts...
            </div>
          )}

          {!loading && error && (
            <div className="py-10 text-center text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="py-10 text-center text-slate-400">
              No blog posts available yet.
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition hover:-translate-y-1 hover:border-blue-500/60"
                >
                  <div className="flex h-48 items-center justify-center bg-slate-800">
                    {post.imageUrl ? (
                      <img
                        src={`${API_URL}${post.imageUrl}`}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-slate-500">
                        Blog Image
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    {post.publishedAt && (
                      <p className="text-sm font-medium text-blue-400">
                        {formatDate(post.publishedAt)}
                      </p>
                    )}

                    <h2 className="mt-3 text-xl font-bold">
                      {post.title}
                    </h2>

                    <p className="mt-4 flex-1 leading-7 text-slate-400">
                      {post.excerpt || "Read this article to learn more."}
                    </p>

                    <a
                      href={`/blog/${post.slug}`}
                      className="mt-6 inline-block font-semibold text-blue-400 transition hover:text-blue-300"
                    >
                      Read Article →
                    </a>
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

export default Blog;