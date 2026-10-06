import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";

function MessagesManagement() {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch messages");
      }

      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
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

      const response = await fetch(`${API_URL}/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete message");
      }

      setSuccess("Message deleted successfully.");

      await fetchMessages();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Portfolio CMS
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Messages Management
          </h1>

          <p className="mt-2 text-slate-400">
            View and manage messages received from your portfolio contact form.
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

        <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                Received Messages
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {messages.length} message
                {messages.length === 1 ? "" : "s"} found.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchMessages}
              disabled={loading}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              Loading messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No messages found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white">
                      {message.subject || "No Subject"}
                    </h3>

                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-slate-300">
                        <span className="font-medium text-slate-400">
                          Name:
                        </span>{" "}
                        {message.name}
                      </p>

                      <p className="text-slate-300">
                        <span className="font-medium text-slate-400">
                          Email:
                        </span>{" "}
                        {message.email}
                      </p>

                      <p className="text-slate-500">
                        {message.createdAt
                          ? new Date(message.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(message.id)}
                    disabled={deletingId === message.id}
                    className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === message.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>

                <div className="mt-5 rounded-xl bg-slate-950 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesManagement;