import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";

function AboutManagement() {
  const [about, setAbout] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/about`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch About information");
      }

      const aboutList = data.about || [];
      const currentAbout = aboutList[0] || null;

      setAbout(currentAbout);

      if (currentAbout) {
        setFormData({
          title: currentAbout.title || "",
          description: currentAbout.description || "",
          imageUrl: currentAbout.imageUrl || "",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to load About information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
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

      const method = about ? "PUT" : "POST";
      const url = about
        ? `${API_URL}/api/about/${about.id}`
        : `${API_URL}/api/about`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save About information");
      }

      setSuccess(
        about
          ? "About information updated successfully."
          : "About information created successfully."
      );

      if (data.about) {
        setAbout(data.about);

        setFormData({
          title: data.about.title || "",
          description: data.about.description || "",
          imageUrl: data.about.imageUrl || "",
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">
        <p className="text-slate-400">Loading About information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Portfolio CMS
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            About Management
          </h1>

          <p className="mt-2 text-slate-400">
            Manage the About section displayed on your portfolio.
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
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter About title"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
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
                placeholder="Enter About description"
                rows={8}
                required
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
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
                placeholder="Enter image URL (optional)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : about
                ? "Update About"
                : "Create About"}
            </button>
          </form>
        </div>

        {about && (
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-white">
              Current About Record
            </h2>

            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <p>
                <span className="font-medium text-slate-300">ID:</span>{" "}
                {about.id}
              </p>

              <p>
                <span className="font-medium text-slate-300">Title:</span>{" "}
                {about.title}
              </p>

              <p>
                <span className="font-medium text-slate-300">
                  Updated:
                </span>{" "}
                {about.updatedAt
                  ? new Date(about.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AboutManagement;