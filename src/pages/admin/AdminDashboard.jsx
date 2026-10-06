import { useEffect, useState } from "react";
import { API_URL } from "../../services/api";
function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    services: 0,
    blog: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("Admin authentication token not found");
        }
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const [
          projectsResponse,
          skillsResponse,
          experienceResponse,
          servicesResponse,
          blogResponse,
          messagesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/projects`, {
            headers,
          }),
          fetch(`${API_URL}/api/skills`, {
            headers,
          }),
          fetch(`${API_URL}/api/experience`, {
            headers,
          }),
          fetch(`${API_URL}/api/services`, {
            headers,
          }),
          fetch(`${API_URL}/api/blog`, {
            headers,
          }),
          fetch(`${API_URL}/api/messages`, {
            headers,
          }),
        ]);
        const [
          projectsData,
          skillsData,
          experienceData,
          servicesData,
          blogData,
          messagesData,
        ] = await Promise.all([
          projectsResponse.json(),
          skillsResponse.json(),
          experienceResponse.json(),
          servicesResponse.json(),
          blogResponse.json(),
          messagesResponse.json(),
        ]);
        if (!projectsResponse.ok) {
          throw new Error(
            projectsData.message || "Failed to load projects"
          );
        }
        if (!skillsResponse.ok) {
          throw new Error(
            skillsData.message || "Failed to load skills"
          );
        }
        if (!experienceResponse.ok) {
          throw new Error(
            experienceData.message || "Failed to load experience"
          );
        }
        if (!servicesResponse.ok) {
          throw new Error(
            servicesData.message || "Failed to load services"
          );
        }
        if (!blogResponse.ok) {
          throw new Error(
            blogData.message || "Failed to load blog posts"
          );
        }
        if (!messagesResponse.ok) {
          throw new Error(
            messagesData.message || "Failed to load messages"
          );
        }
        setStats({
          projects: (projectsData.projects || []).length,
          skills: (skillsData.skills || []).length,
          experience: (experienceData.experiences || []).length,
          services: (servicesData.services || []).length,
          blog: (blogData.blogs || []).length,
          messages: (messagesData.messages || []).length,
        });
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      description: "Portfolio projects",
    },
    {
      title: "Skills",
      value: stats.skills,
      description: "Technical skills",
    },
    {
      title: "Experience",
      value: stats.experience,
      description: "Work experience",
    },
    {
      title: "Services",
      value: stats.services,
      description: "Services offered",
    },
    {
      title: "Blog Posts",
      value: stats.blog,
      description: "Published blog posts",
    },
    {
      title: "Messages",
      value: stats.messages,
      description: "Contact messages",
    },
  ];
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Admin Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Manage your portfolio content and monitor your CMS data
          from one place.
        </p>
      </div>
      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">
            Loading dashboard data...
          </p>
        </div>
      )}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h2 className="font-semibold text-red-400">
            Failed to load dashboard
          </h2>
          <p className="mt-2 text-sm text-red-300">
            {error}
          </p>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40"
              >
                <p className="text-sm font-medium text-slate-400">
                  {card.title}
                </p>
                <p className="mt-3 text-4xl font-bold text-blue-400">
                  {card.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">
              Welcome to your CMS
            </h2>
            <p className="mt-3 leading-7 text-slate-400">
              Use the sidebar to manage your portfolio content,
              including About information, skills, projects,
              experience, services, blog posts, media files, and
              contact messages.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
export default AdminDashboard;