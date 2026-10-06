import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";

function ServicesManagement() {
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconUrl: "",
    featured: false,
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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
      iconUrl: "",
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
        ? `${API_URL}/api/services/${editingId}`
        : `${API_URL}/api/services`;

      const method = isEditing ? "PUT" : "POST";

      const body = {
        title: formData.title,
        description: formData.description,
        iconUrl: formData.iconUrl || null,
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
        throw new Error(data.message || "Failed to save service");
      }

      setSuccess(
        isEditing
          ? "Service updated successfully."
          : "Service created successfully."
      );

      resetForm();

      await fetchServices();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setFormData({
      title: service.title || "",
      description: service.description || "",
      iconUrl: service.iconUrl || "",
      featured: Boolean(service.featured),
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
      "Are you sure you want to delete this service?"
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

      const response = await fetch(`${API_URL}/api/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete service");
      }

      setSuccess("Service deleted successfully.");

      await fetchServices();
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
            Services Management
          </h1>

          <p className="mt-2 text-slate-400">
            Add, edit, and delete the services displayed on your portfolio.
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

        {/* Service Form */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {editingId !== null ? "Edit Service" : "Add Service"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {editingId !== null
                ? "Update the selected service."
                : "Create a new service for your portfolio."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Service Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  required
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
                placeholder="Describe the service"
                rows={6}
                required
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
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
                Featured Service
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
                    ? "Update Service"
                    : "Add Service"}
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

        {/* Services List */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Existing Services
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {services.length} service
              {services.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">No services found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {service.iconUrl && (
                        <img
                          src={`${API_URL}${service.iconUrl}`}
                          alt={service.title}
                          className="h-10 w-10 rounded-lg object-contain"
                        />
                      )}

                      <div>
                        <h3 className="text-lg font-semibold">
                          {service.title}
                        </h3>

                        {service.featured && (
                          <span className="mt-2 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {service.description}
                  </p>

                  {service.iconUrl && (
                    <p className="mt-3 break-all text-xs text-slate-500">
                      Icon: {service.iconUrl}
                    </p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(service)}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === service.id
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

export default ServicesManagement;