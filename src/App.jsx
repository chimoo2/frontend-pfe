import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import VantaNet from "./components/VantaNet";
import SkillGraph from "./components/SkillGraph";
import Signin from "./components/signin/Signin";
import Signup from "./components/signup/signup";
import "./App.css";
import EmployeeProfile from "./components/profile/EmployeeProfile";

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

export default function App() {
  return (
    <Router>
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<EmployeeProfile />} />
          <Route path="/ecosystem" element={<Generic title="Ecosystem" />} />
          <Route path="/features" element={<Generic title="Features" />} />
          <Route path="/modules" element={<Generic title="Modules" />} />
          <Route path="/security" element={<Generic title="Security" />} />
          <Route path="/analytics" element={<Generic title="Analytics" />} />
          <Route path="/technology" element={<Generic title="Technology" />} />
          <Route path="*" element={<Generic title="Page non trouvée" />} />
        </Routes>
      </main>
    </Router>
  );
}
