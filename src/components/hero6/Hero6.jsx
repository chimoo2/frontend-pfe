import { useEffect, useState } from "react";
import "./Analytics.css";
import InsightsIcon from '@mui/icons-material/Insights';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { BASE_URL } from "../../api/apiClient";

const DEFAULT_STATS = {
  readiness: 0,
  skillCoverage: 0,
  projectFit: 0,
  staffingMultiplier: 0,
  totalProjects: 0,
  totalUsers: 0,
  totalMatchings: 0,
  analyzedProjects: 0,
};

export default function Analytics() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`${BASE_URL}/api/stats/landing`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(data => { if (alive) setStats({ ...DEFAULT_STATS, ...data }); })
      .catch(() => { /* keep defaults on error */ })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const fmtPct = (v) => `${Math.round(Number(v) || 0)}%`;
  const fmtX = (v) => {
    const n = Number(v) || 0;
    return n >= 10 ? `${Math.round(n)}x` : `${n.toFixed(1)}x`;
  };

  return (
    <section id="hero6" className="analytics">
      <div className="analytics-header">
        <span className="eyebrow">Analytics</span>
        <h2>Turn workforce data into strategic decisions</h2>
        <p className="subtitle">
          Gain clarity on skills, capacity, and project fit with a modern analytics hub built for talent leaders.
        </p>
      </div>

      <div className="analytics-grid">
        <div className="stat-card accent">
          <div className="stat-icon">
            <InsightsIcon className="icon" />
          </div>
          <strong>{loading ? "—" : fmtPct(stats.readiness)}</strong>
          <span>Employee readiness score</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AutoGraphIcon className="icon" />
          </div>
          <strong>{loading ? "—" : fmtPct(stats.skillCoverage)}</strong>
          <span>Skill coverage across the workforce</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DashboardCustomizeIcon className="icon" />
          </div>
          <strong>{loading ? "—" : fmtPct(stats.projectFit)}</strong>
          <span>Project fit accuracy</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUpIcon className="icon" />
          </div>
          <strong>{loading ? "—" : fmtX(stats.staffingMultiplier)}</strong>
          <span>Candidates analyzed per project</span>
        </div>
      </div>

      <div className="analytics-features">
        <div className="feature-card">
          <h3>Real-time dashboards</h3>
          <p>
            Monitor skills, gaps, and talent mobility in one polished view —
            built from {stats.totalUsers || 0} users and {stats.totalProjects || 0} projects.
          </p>
        </div>
        <div className="feature-card">
          <h3>Predictive staffing</h3>
          <p>
            Anticipate project needs and match the right employees ahead of time —
            {" "}{stats.analyzedProjects || 0} projects already analyzed.
          </p>
        </div>
        <div className="feature-card">
          <h3>Visual insights</h3>
          <p>
            Share executive-ready reports built from {stats.totalMatchings || 0}{" "}
            AI-powered matching computations.
          </p>
        </div>
      </div>
    </section>
  );
}
