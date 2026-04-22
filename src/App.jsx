import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero1 from "./components/hero1/Hero1";
import Hero2 from "./components/hero2/Hero2";
import Hero3 from "./components/hero3/Hero3";
import Hero4 from "./components/hero4/Hero4";
import Hero5 from "./components/hero5/Hero5";
import Hero6 from "./components/hero6/Hero6";
import Signin from "./components/signin/Signin";
import Signup from "./components/signup/signup";
import "./App.css";
import EmployeeProfile from "./components/profile/EmployeeProfile";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ProjectKanban from "./pages/manager/ProjectKanban";
import CreateProject from "./pages/manager/CreateProject";
import Matching from "./pages/manager/Matching";
import MatchingKanban from "./pages/manager/MatchingKanban";
import CourseRecommendations from "./pages/manager/CourseRecommendations";
import AdminUsers from "./pages/admin/AdminUsers";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerSidebar from "./components/layout/ManagerSidebar";
import Topbar from "./components/layout/Topbar";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { useAuth } from "./context/AuthContext";
import { Outlet, useLocation } from "react-router-dom";

function Home() {
  return (
    <>
      <Hero1 />
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
      <Hero6 />
    </>
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
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();

  const userName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : '';

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Topbar
        isSidebarOpen={isOpen}
        toggleSidebar={toggleSidebar}
        title="CareerSavvy"
        userName={userName}
        userRole="Manager"
        onLogout={logout}
        searchPlaceholder="Search projects, employees..."
      />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <ManagerSidebar />
        <main
          style={{
            marginLeft: isOpen ? 280 : 0,
            paddingTop: "84px",
            padding: "84px 2rem 2rem",
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={
          <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            {/* Header déjà rendu par HeaderRenderer */}
            <div style={{display: 'flex', flex: 1}}>
              <div style={{flex: 1, minWidth: 0}}>
                <EmployeeProfile />
              </div>
            </div>
          </div>
        } />
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
          <Route path="matching/:projectId/courses" element={<CourseRecommendations />} />
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
    </Router>
  );
}

