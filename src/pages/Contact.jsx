import { useState } from "react";
import { API_URL } from "../services/api";
import SEO from "../components/SEO";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setStatus({
        type: "",
        message: "",
      });

      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setStatus({
        type: "success",
        message: "Your message has been sent successfully!",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact | Utkarsh Parihar"
        description="Get in touch with Utkarsh Parihar for web development projects, internship opportunities, and professional collaborations."
      />

      <div className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Get in touch
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              Contact <span className="text-blue-400">Me</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
              Have a project idea, question, or opportunity? Feel free to
              get in touch with me.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 sm:p-10">
              <h2 className="text-2xl font-bold">
                Let's work <span className="text-blue-400">together</span>
              </h2>

              <p className="mt-5 leading-8 text-slate-400">
                I'm interested in web development projects, internship
                opportunities, and learning experiences. You can send me a
                message using the form.
              </p>

              <div className="mt-8 space-y-5">
                <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                  <p className="text-sm font-medium text-blue-400">
                    Email
                  </p>
                  <p className="mt-2 text-slate-300">
                    utkarshparihar920@gmail.com
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                  <p className="text-sm font-medium text-blue-400">
                    Location
                  </p>
                  <p className="mt-2 text-slate-300">
                    India
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                  <p className="text-sm font-medium text-blue-400">
                    Availability
                  </p>
                  <p className="mt-2 text-slate-300">
                    Open to opportunities
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 sm:p-10">
              <h2 className="text-2xl font-bold">
                Send a <span className="text-blue-400">Message</span>
              </h2>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Message subject"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    required
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>

                {status.message && (
                  <div
                    className={`rounded-lg border p-4 text-sm ${status.type === "success"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                      }`}
                  >
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Contact;