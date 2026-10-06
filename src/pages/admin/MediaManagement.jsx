import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";

function MediaManagement() {
  const [media, setMedia] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch media");
      }

      setMedia(data.media || []);
    } catch (err) {
      setError(err.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);
    setError("");
    setSuccess("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/api/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload media");
      }

      setSuccess("Media uploaded successfully.");
      setSelectedFile(null);

      event.target.reset();

      await fetchMedia();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this media file?"
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

      const response = await fetch(`${API_URL}/api/media/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete media");
      }

      setSuccess("Media deleted successfully.");

      await fetchMedia();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const getMediaUrl = (url) => {
    if (!url) {
      return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const isImage = (item) => {
    if (item.type?.startsWith("image/")) {
      return true;
    }

    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.filename || "");
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Portfolio CMS
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Media Management
          </h1>

          <p className="mt-2 text-slate-400">
            Upload and manage media files used by your portfolio.
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

        {/* Upload Section */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Upload Media
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Select a file and upload it to your portfolio media library.
            </p>
          </div>

          <form onSubmit={handleUpload}>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-500"
            />

            {selectedFile && (
              <p className="mt-3 text-sm text-slate-400">
                Selected:{" "}
                <span className="font-medium text-slate-200">
                  {selectedFile.name}
                </span>
              </p>
            )}

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Media"}
            </button>
          </form>
        </div>

        {/* Media List */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Media Library
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {media.length} file
              {media.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">Loading media...</p>
            </div>
          ) : media.length === 0 ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                No media files found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => {
                const mediaUrl = getMediaUrl(item.url);

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
                  >
                    <div className="flex h-48 items-center justify-center bg-slate-950">
                      {isImage(item) ? (
                        <img
                          src={mediaUrl}
                          alt={item.filename || "Uploaded media"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="px-4 text-center">
                          <p className="text-4xl">📄</p>
                          <p className="mt-2 text-sm text-slate-400">
                            File
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="break-all text-sm font-semibold text-white">
                        {item.filename || "Unnamed file"}
                      </h3>

                      {item.type && (
                        <p className="mt-2 text-xs text-slate-500">
                          Type: {item.type}
                        </p>
                      )}

                      {item.size && (
                        <p className="mt-1 text-xs text-slate-500">
                          Size: {item.size} bytes
                        </p>
                      )}

                      <p className="mt-2 break-all text-xs text-slate-500">
                        URL: {item.url}
                      </p>

                      <div className="mt-5 flex gap-3">
                        {mediaUrl && (
                          <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                          >
                            Open
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === item.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaManagement;