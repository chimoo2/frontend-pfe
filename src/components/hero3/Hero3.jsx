import "./Features.css";
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import LinkIcon from '@mui/icons-material/Link';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsightsIcon from '@mui/icons-material/Insights';
import StorageIcon from '@mui/icons-material/Storage';

export default function Features() {
  return (
    <section id="hero3" className="features">
      <div className="section-intro">
        <span className="eyebrow">Talent intelligence</span>
        <h2>Smart features that drive talent transformation</h2>
        <p className="subtitle">
          Everything you need to analyze skills, match talent, and optimize workforce.
        </p>
      </div>

      <div className="features-grid">
        <div className="card">
          <div className="card-icon">
            <PsychologyIcon className="icon" />
          </div>
          <h3>Skill Analysis</h3>
          <p>AI analyzes employee skills and competencies.</p>
        </div>

        <div className="card">
          <div className="card-icon">
            <SchoolIcon className="icon" />
          </div>
          <h3>Career Paths</h3>
          <p>Personalized career and learning recommendations.</p>
        </div>

        <div className="card">
          <div className="card-icon">
            <LinkIcon className="icon" />
          </div>
          <h3>Project Matching</h3>
          <p>Match talent with the right projects.</p>
        </div>

        <div className="card">
          <div className="card-icon">
            <BarChartIcon className="icon" />
          </div>
          <h3>Analytics</h3>
          <p>Real-time dashboards and insights.</p>
        </div>

        <div className="card">
          <div className="card-icon">
            <InsightsIcon className="icon" />
          </div>
          <h3>Skill Gap</h3>
          <p>Identify missing skills for roles.</p>
        </div>

        <div className="card">
          <div className="card-icon">
            <StorageIcon className="icon" />
          </div>
          <h3>Data Management</h3>
          <p>Centralized talent and skills data.</p>
        </div>
      </div>
    </section>
  );
}