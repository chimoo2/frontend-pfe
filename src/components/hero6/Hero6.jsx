import "./Analytics.css";
import InsightsIcon from '@mui/icons-material/Insights';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Analytics() {
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
          <strong>92%</strong>
          <span>Employee readiness score</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AutoGraphIcon className="icon" />
          </div>
          <strong>87%</strong>
          <span>Skill coverage across key roles</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DashboardCustomizeIcon className="icon" />
          </div>
          <strong>78%</strong>
          <span>Project fit accuracy</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUpIcon className="icon" />
          </div>
          <strong>1.8x</strong>
          <span>Faster staffing decisions</span>
        </div>
      </div>

      <div className="analytics-features">
        <div className="feature-card">
          <h3>Real-time dashboards</h3>
          <p>Monitor skills, gaps, and talent mobility in one polished view.</p>
        </div>
        <div className="feature-card">
          <h3>Predictive staffing</h3>
          <p>Anticipate project needs and match the right employees ahead of time.</p>
        </div>
        <div className="feature-card">
          <h3>Visual insights</h3>
          <p>Share executive-ready reports that highlight workforce strengths.</p>
        </div>
      </div>
    </section>
  );
}
