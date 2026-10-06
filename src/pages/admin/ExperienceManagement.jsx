import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";

function ExperienceManagement() {
  const [experiences, setExperiences] = useState([]);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/experience`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch experience"
        );
      }

      setExperiences(data.experiences || []);
    } catch (err) {
      setError(err.message || "Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
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
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
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
        ? `${API_URL}/api/experience/${editingId}`
        : `${API_URL}/api/experience`;

      const method = isEditing ? "PUT" : "POST";

      const body = {
        company: formData.company,
        position: formData.position,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.current
          ? null
          : formData.endDate || null,
        current: formData.current,
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
        throw new Error(
          data.message || "Failed to save experience"
        );
      }

      setSuccess(
        isEditing
          ? "Experience updated successfully."
          : "Experience created successfully."
      );

      resetForm();

      await fetchExperiences();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingId(experience.id);

    setFormData({
      company: experience.company || "",
      position: experience.position || "",
      description: experience.description || "",
      startDate: experience.startDate
        ? experience.startDate.slice(0, 10)
        : "",
      endDate: experience.endDate
        ? experience.endDate.slice(0, 10)
        : "",
      current: Boolean(experience.current),
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
      "Are you sure you want to delete this experience?"
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

      const response = await fetch(
        `${API_URL}/api/experience/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete experience"
        );
      }

      setSuccess("Experience deleted successfully.");

      await fetchExperiences();
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
            Experience Management
          </h1>

          <p className="mt-2 text-slate-400">
            Add, edit, and delete the experience displayed on your
            portfolio.
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

        {/* Experience Form */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {editingId !== null
                ? "Edit Experience"
                : "Add Experience"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {editingId !== null
                ? "Update the selected experience."
                : "Create a new experience entry."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Company
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. ABC Technologies"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Position
                </label>

                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  required
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
                placeholder="Describe your role and responsibilities"
                rows={6}
                required
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.current}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-50 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <input
                id="current"
                name="current"
                type="checkbox"
                checked={formData.current}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950"
              />

              <label
                htmlFor="current"
                className="text-sm font-medium text-slate-300"
              >
                I currently work here
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
                  ? "Update Experience"
                  : "Add Experience"}
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

        {/* Experience List */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Existing Experience
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {experiences.length} experience
              {experiences.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                Loading experience...
              </p>
            </div>
          ) : experiences.length === 0 ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                No experience found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {experience.position}
                      </h3>

                      <p className="mt-1 text-blue-400">
                        {experience.company}
                      </p>
                    </div>

                    {experience.current && (
                      <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {experience.description}
                  </p>

                  <p className="mt-4 text-sm text-slate-500">
                    {experience.startDate
                      ? new Date(
                          experience.startDate
                        ).toLocaleDateString()
                      : "N/A"}{" "}
                    —{" "}
                    {experience.current
                      ? "Present"
                      : experience.endDate
                      ? new Date(
                          experience.endDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(experience)}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(experience.id)
                      }
                      disabled={deletingId === experience.id}
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === experience.id
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

export default ExperienceManagement;