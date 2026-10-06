import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AboutManagement from "./pages/admin/AboutManagement";
import SkillsManagement from "./pages/admin/SkillsManagement";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import ExperienceManagement from "./pages/admin/ExperienceManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import MediaManagement from "./pages/admin/MediaManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route
          path="/"
          element={
            <div className="flex min-h-screen flex-col bg-slate-950">
              <Navbar />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="flex min-h-screen flex-col bg-slate-950">
              <Navbar />
              <main className="flex-1">
                <About />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/skills"
          element={
            <div className="flex min-h-screen flex-col bg-slate-950">
              <Navbar />
              <main className="flex-1">
                <Skills />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/experience"
          element={
            <div className="flex min-h-screen flex-col bg-slate-950">
              <Navbar />
              <main className="flex-1">
                <Experience />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/projects"
          element={
            <div className="flex min-h-screen flex-col bg-slate-950">
              <Navbar />
              <main className="flex-1">
                <Projects />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/services"
          element={
            <div className="flex min-h-screen flex-col bg-slate-950">
              <Navbar />
              <main className="flex-1">
                <Services />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/blog"
          element={
            <div className="flex min-h-screen flex-col bg-slate-950">
              <Navbar />
              <main className="flex-1">
                <Blog />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div className="flex min-h-screen flex-col bg-slate-950">
              <Navbar />
              <main className="flex-1">
                <Contact />
              </main>
              <Footer />
            </div>
          }
        />
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Protected Admin Area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              path="dashboard"
             element={<AdminDashboard />}
            />

            <Route
              path="about"
             element={<AboutManagement />}
            />

             <Route
              path="skills"
             element={<SkillsManagement />}
            />

            <Route
              path="projects"
             element={<ProjectsManagement />}
            />

             <Route
              path="experience"
             element={<ExperienceManagement />}
            />

             <Route
              path="services"
             element={<ServicesManagement />}
            />

            <Route
              path="blog"
             element={<BlogManagement />}
            />

            <Route
              path="media"
             element={<MediaManagement />}
            />

            <Route
              path="messages"
             element={<MessagesManagement />}
            />


          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;