import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";

function SkillsManagement() {
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "",
    iconUrl: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/skills`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch skills");
      }

      setSkills(data.skills || []);
    } catch (err) {
      setError(err.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      level: "",
      iconUrl: "",
    });

    setEditingId(null);
    setError("");
    setSuccess("");
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
        ? `${API_URL}/api/skills/${editingId}`
        : `${API_URL}/api/skills`;

      const method = isEditing ? "PUT" : "POST";

      const body = {
        name: formData.name,
        category: formData.category || null,
        level:
          formData.level === ""
            ? null
            : Number(formData.level),
        iconUrl: formData.iconUrl || null,
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
        throw new Error(data.message || "Failed to save skill");
      }

      setSuccess(
        isEditing
          ? "Skill updated successfully."
          : "Skill created successfully."
      );

      resetForm();

      await fetchSkills();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);

    setFormData({
      name: skill.name || "",
      category: skill.category || "",
      level:
        skill.level !== null && skill.level !== undefined
          ? String(skill.level)
          : "",
      iconUrl: skill.iconUrl || "",
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
      "Are you sure you want to delete this skill?"
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

      const response = await fetch(`${API_URL}/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete skill");
      }

      setSuccess("Skill deleted successfully.");

      await fetchSkills();
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
            Skills Management
          </h1>

          <p className="mt-2 text-slate-400">
            Add, edit, and delete the skills displayed on your portfolio.
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

        {/* Skill Form */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {editingId !== null ? "Edit Skill" : "Add Skill"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {editingId !== null
                ? "Update the selected skill."
                : "Create a new skill for your portfolio."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Skill Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. React"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Frontend"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="level"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Skill Level
                </label>

                <input
                  id="level"
                  name="level"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={handleChange}
                  placeholder="0 - 100"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="iconUrl"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Icon URL
                </label>

                <input
                  id="iconUrl"
                  name="iconUrl"
                  type="text"
                  value={formData.iconUrl}
                  onChange={handleChange}
                  placeholder="Optional icon URL"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
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
                    ? "Update Skill"
                    : "Add Skill"}
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

        {/* Skills List */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Existing Skills
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {skills.length} skill{skills.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                Loading skills...
              </p>
            </div>
          ) : skills.length === 0 ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                No skills found.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {skill.iconUrl && (
                        <img
                          src={`${API_URL} ${skill.iconUrl}`}
                          alt={skill.name}
                          className="h-10 w-10 rounded-lg object-contain"
                        />
                      )}

                      <div>
                        <h3 className="text-lg font-semibold">
                          {skill.name}
                        </h3>

                        {skill.category && (
                          <p className="mt-1 text-sm text-blue-400">
                            {skill.category}
                          </p>
                        )}
                      </div>
                    </div>

                    {skill.level !== null &&
                      skill.level !== undefined && (
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400">
                          {skill.level}%
                        </span>
                      )}
                  </div>

                  {skill.level !== null &&
                    skill.level !== undefined && (
                      <div className="mt-5">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${skill.level}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(skill)}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(skill.id)}
                      disabled={deletingId === skill.id}
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === skill.id
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

export default SkillsManagement;