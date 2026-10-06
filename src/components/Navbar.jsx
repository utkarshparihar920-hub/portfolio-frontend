import { Link, NavLink } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Skills", path: "/skills" },
  { name: "Experience", path: "/experience" },
  { name: "Projects", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          Portfolio<span className="text-blue-500">.</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-blue-400"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <Link
          to="/contact"
          className="hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 lg:block"
        >
          Let's Talk
        </Link>
      </nav>

      <div className="border-t border-slate-800 px-6 py-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm font-medium transition ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-400 hover:text-blue-400"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;