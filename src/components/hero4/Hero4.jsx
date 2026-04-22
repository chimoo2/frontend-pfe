import "./Process.css";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function Process() {
  return (
    <section id="hero4" className="process">
      <div className="process-header">
        <span className="eyebrow">Process mapping</span>
        <h2>How CapTalent works</h2>
        <p className="subtitle">
          A simple and intelligent process to align skills, careers, and projects.
        </p>
      </div>

      <div className="process-steps">

        <div className="step">
          <span className="step-number">01</span>
          <div className="step-icon">
            <PersonOutlineIcon className="icon" />
          </div>
          <h3>Profile Analysis</h3>
          <p>Analyze user skills, experience, and career goals.</p>
        </div>

        <div className="step">
          <span className="step-number">02</span>
          <div className="step-icon">
            <SearchIcon className="icon" />
          </div>
          <h3>Skill Gap Detection</h3>
          <p>Identify missing skills based on roles and market needs.</p>
        </div>

        <div className="step">
          <span className="step-number">03</span>
          <div className="step-icon">
            <PsychologyIcon className="icon" />
          </div>
          <h3>AI Recommendations</h3>
          <p>Generate career paths and learning suggestions.</p>
        </div>

        <div className="step">
          <span className="step-number">04</span>
          <div className="step-icon">
            <CheckCircleOutlineIcon className="icon" />
          </div>
          <h3>Smart Matching</h3>
          <p>Match employees to the right projects.</p>
        </div>

      </div>

    </section>
  );
}