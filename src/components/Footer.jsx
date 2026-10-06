import { Link } from "react-router-dom";

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

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight"
            >
              Portfolio<span className="text-blue-500">.</span>
            </Link>

            <p className="mt-4 max-w-sm leading-7 text-slate-400">
              A personal portfolio showcasing my development skills,
              projects, experience, and services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Quick Links</h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm text-slate-400 transition hover:text-blue-400"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Let's Connect</h2>

            <p className="mt-4 leading-7 text-slate-400">
              Interested in working together or discussing a project?
              Feel free to get in touch.
            </p>

            <Link
              to="/contact"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Contact Me
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;