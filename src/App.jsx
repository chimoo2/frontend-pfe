import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import VantaNet from "./components/VantaNet";
import SkillGraph from "./components/SkillGraph";
import Signin from "./components/signin/Signin";
import Signup from "./components/signup/signup";
import "./App.css";
import EmployeeProfile from "./components/profile/EmployeeProfile";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ProjectKanban from "./pages/manager/ProjectKanban";
import CreateProject from "./pages/manager/CreateProject";
import Matching from "./pages/manager/Matching";
import MatchingKanban from "./pages/manager/MatchingKanban";
import AdminUsers from "./pages/admin/AdminUsers";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerSidebar from "./components/layout/ManagerSidebar";
import Topbar from "./components/layout/Topbar";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { Outlet, useLocation } from "react-router-dom";

function Home() {
  return (
    <section className="hero" style={{ position: "relative", overflow: "hidden" }}>
      <VantaNet color={0x4f46e5} backgroundColor={0xf8fbff} showOnMobile={true} />
      <div className="hero-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-left">
          <h1>Build the Right Career. Power the Right <span className="highlight">Teams</span>
          </h1>
          <p style={{ color: "#334155", fontSize: 18 }}>
           An AI-powered platform for skills analysis, career recommendation, and workforce optimization.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button className="cta">👉 Get Career Insights</button>
            <button className="cta" style={{ background: "#fff", color: "#0f172a", border: "1px solid #e5e7eb" }}>
              Request a Demo
            </button>
          </div>
        </div>

        <div className="hero-right" aria-hidden="true">
          <SkillGraph />
        </div>
      </div>
    </section>
  );
}

function Generic({ title }) {
  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h2>{title}</h2>
      <p>Contenu de la page {title}.</p>
    </div>
  );
}

function HeaderRenderer() {
  const location = useLocation();
  const isManager = location.pathname.startsWith("/manager");
  return !isManager ? <Header /> : null;
}

function ManagerLayout() {
  const { isOpen } = useSidebar();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Topbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <ManagerSidebar />
        <main
          style={{
            marginLeft: isOpen ? 280 : 0,
            padding: "2rem",
            width: "100%",
            overflowY: "auto",
            transition: "margin-left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <HeaderRenderer />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<EmployeeProfile />} />
          <Route path="/ecosystem" element={<Generic title="Ecosystem" />} />
          <Route path="/features" element={<Generic title="Features" />} />
          <Route path="/modules" element={<Generic title="Modules" />} />
          <Route path="/security" element={<Generic title="Security" />} />
          <Route path="/analytics" element={<Generic title="Analytics" />} />
          <Route path="/technology" element={<Generic title="Technology" />} />

          {/* manager section with layout */}
          <Route path="/manager" element={<ProtectedRoute><SidebarProvider><ManagerLayout /></SidebarProvider></ProtectedRoute>}>
            <Route index element={<ManagerDashboard />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="projects" element={<ProjectKanban/>} />
            <Route path="projects/new" element={<CreateProject />} />
            <Route path="projects/kanban" element={<ProjectKanban />} />
            <Route path="matching" element={<MatchingKanban />} />
            <Route path="matching/:projectId" element={<Matching />} />
            <Route path="stats" element={<Generic title="Statistiques" />} />
          </Route>

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Generic title="Page non trouvée" />} />
        </Routes>
      </main>
    </Router>
  );
}
