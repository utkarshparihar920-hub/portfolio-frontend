import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";

function BlogManagement() {
  const [blogs, setBlogs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    imageUrl: "",
    content: "",
    published: false,
    publishedAt: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/blog`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blogs");
      }

      setBlogs(data.blogs || []);
    } catch (err) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      imageUrl: "",
      content: "",
      published: false,
      publishedAt: "",
    });

    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/api/blog/${editingId}`
        : `${API_URL}/api/blog`;

      const method = isEditing ? "PUT" : "POST";

      const body = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        imageUrl: formData.imageUrl || null,
        content: formData.content,
        published: formData.published,
        publishedAt: formData.publishedAt
          ? new Date(formData.publishedAt).toISOString()
          : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save blog");
      }

      setSuccess(
        isEditing
          ? "Blog updated successfully."
          : "Blog created successfully."
      );

      resetForm();

      await fetchBlogs();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);

    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      imageUrl: blog.imageUrl || "",
      content: blog.content || "",
      published: Boolean(blog.published),
      publishedAt: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString().slice(0, 16)
        : "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blog");
      }

      setSuccess("Blog deleted successfully.");

      await fetchBlogs();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Portfolio CMS
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Blog Management
          </h1>

          <p className="mt-2 text-slate-400">
            Add, edit, publish, and delete blog posts from your portfolio.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {editingId !== null ? "Edit Blog" : "Add Blog"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {editingId !== null
                ? "Update the selected blog post."
                : "Create a new blog post for your portfolio."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Blog title"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Slug
                </label>

                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="my-first-blog"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Excerpt
              </label>

              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Short summary of the blog post"
                rows={3}
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="imageUrl"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Image URL
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Optional blog image URL"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Content
              </label>

              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your blog content here..."
                rows={10}
                required
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="publishedAt"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Published Date
                </label>

                <input
                  id="publishedAt"
                  name="publishedAt"
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 md:pt-8">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                />

                <label
                  htmlFor="published"
                  className="text-sm font-medium text-slate-300"
                >
                  Publish this blog
                </label>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Blog"
                  : "Add Blog"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Existing Blogs
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {blogs.length} blog
              {blogs.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">No blogs found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {blog.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        /{blog.slug}
                      </p>

                      {blog.published && (
                        <span className="mt-3 inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                          Published
                        </span>
                      )}

                      {!blog.published && (
                        <span className="mt-3 inline-block rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {blog.excerpt && (
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {blog.excerpt}
                    </p>
                  )}

                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-500">
                    {blog.content}
                  </p>

                  {blog.publishedAt && (
                    <p className="mt-4 text-xs text-slate-500">
                      Published:{" "}
                      {new Date(blog.publishedAt).toLocaleString()}
                    </p>
                  )}

                  {blog.imageUrl && (
                    <p className="mt-3 break-all text-xs text-slate-500">
                      Image: {blog.imageUrl}
                    </p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(blog.id)}
                      disabled={deletingId === blog.id}
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === blog.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogManagement;