import { Link, Outlet, useNavigate } from "react-router-dom";
function AdminLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 md:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-800 px-6 py-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Portfolio CMS
              </p>
              <h1 className="mt-2 text-xl font-bold">
                Admin Panel
              </h1>
            </div>
            <nav className="flex-1 space-y-2 p-4">
              <Link
                to="/admin/dashboard"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Dashboard
              </Link>
              <div className="pt-4">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Content
                </p>
                <div className="mt-2 space-y-2">
                  <Link
                    to="/admin/about"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    About
                  </Link>
                  <Link
                    to="/admin/skills"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Skills
                  </Link>
                   <Link
                    to="/admin/projects"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/admin/experience"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Experience
                  </Link>
                  <Link
                    to="/admin/services"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Services
                  </Link>
                 <Link
                    to="/admin/blog"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/admin/media"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Media
                  </Link>
                  <Link
                    to="/admin/messages"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Messages
                  </Link>
                </div>
              </div>
            </nav>
            <div className="border-t border-slate-800 p-4">
              <Link
                to="/"
                className="mb-2 block rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                View Portfolio
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>
        {/* Main Admin Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile Header */}
          <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                  Portfolio CMS
                </p>
                <h1 className="mt-1 text-lg font-bold">
                  Admin Panel
                </h1>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400"
              >
                Logout
              </button>
            </div>
          </header>
          <main className="flex-1 p-6 sm:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
export default AdminLayout;