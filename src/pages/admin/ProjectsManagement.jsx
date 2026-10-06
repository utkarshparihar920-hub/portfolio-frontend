import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";

function ProjectsManagement() {
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    technologies: "",
    featured: false,
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };


  const getImageUrl = (url) => {
  if (!url) {
    return "";
  }

  const cleanUrl = url.trim();

  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://")
  ) {
    return cleanUrl;
  }

  return `${API_URL}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`}`;
};
  useEffect(() => {
    fetchProjects();
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
      description: "",
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      technologies: "",
      featured: false,
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
        ? `${API_URL}/api/projects/${editingId}`
        : `${API_URL}/api/projects`;

      const method = isEditing ? "PUT" : "POST";

      const technologiesArray = formData.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean);

      const body = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl || null,
        liveUrl: formData.liveUrl || null,
        githubUrl: formData.githubUrl || null,
        technologies:
          technologiesArray.length > 0 ? technologiesArray : null,
        featured: formData.featured,
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
        throw new Error(data.message || "Failed to save project");
      }

      setSuccess(
        isEditing
          ? "Project updated successfully."
          : "Project created successfully."
      );

      resetForm();

      await fetchProjects();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);

    setFormData({
      title: project.title || "",
      description: project.description || "",
      imageUrl: project.imageUrl || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      featured: Boolean(project.featured),
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
      "Are you sure you want to delete this project?"
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

      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setSuccess("Project deleted successfully.");

      await fetchProjects();
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
            Projects Management
          </h1>

          <p className="mt-2 text-slate-400">
            Add, edit, and delete the projects displayed on your portfolio.
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

        {/* Project Form */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {editingId !== null ? "Edit Project" : "Add Project"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {editingId !== null
                ? "Update the selected project."
                : "Create a new project for your portfolio."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Project Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Portfolio CMS"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
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
                  placeholder="Optional image URL"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="liveUrl"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Live Project URL
                </label>

                <input
                  id="liveUrl"
                  name="liveUrl"
                  type="text"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="githubUrl"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  GitHub URL
                </label>

                <input
                  id="githubUrl"
                  name="githubUrl"
                  type="text"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/project"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project"
                rows={6}
                required
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="technologies"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Technologies
              </label>

              <input
                id="technologies"
                name="technologies"
                type="text"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate technologies with commas.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950"
              />

              <label
                htmlFor="featured"
                className="text-sm font-medium text-slate-300"
              >
                Featured Project
              </label>
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
                    ? "Update Project"
                    : "Add Project"}
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

        {/* Projects List */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Existing Projects
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {projects.length} project
              {projects.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                No projects found.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
                >
                  {project.imageUrl && (
                      <img
                        src={getImageUrl(project.imageUrl)}
                        alt={project.title}
                        className="mb-5 h-48 w-full rounded-xl object-cover"
                      />
                  
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {project.title}
                      </h3>

                      {project.featured && (
                        <span className="mt-2 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {project.description}
                  </p>

                  {Array.isArray(project.technologies) &&
                    project.technologies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.map(
                          (technology, index) => (
                            <span
                              key={`${technology}-${index}`}
                              className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        Live
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        GitHub
                      </a>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === project.id
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

export default ProjectsManagement;