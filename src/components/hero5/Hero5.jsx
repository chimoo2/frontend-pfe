import "./Solutions.css";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';

export default function Solutions() {
  return (
    <section id="hero5" className="solutions">

      <h2>Solutions for Every Stakeholder</h2>
      <p className="subtitle">
        CapTalent empowers individuals, managers, and organizations with intelligent tools.
      </p>

      <div className="solutions-grid">

        {/* EMPLOYEE */}
        <div className="solution-card">
          <PersonOutlineIcon className="icon" />
          <h3>For Employees</h3>
          <ul>
            <li>Discover personalized career paths</li>
            <li>Identify and close skill gaps</li>
            <li>Access learning recommendations</li>
          </ul>
        </div>

        {/* MANAGER */}
        <div className="solution-card">
          <GroupIcon className="icon" />
          <h3>For Managers</h3>
          <ul>
            <li>Assign the right talent to projects</li>
            <li>Monitor team skills and performance</li>
            <li>Improve team productivity</li>
          </ul>
        </div>

        {/* ORGANIZATION */}
        <div className="solution-card">
          <BusinessIcon className="icon" />
          <h3>For Organizations</h3>
          <ul>
            <li>Optimize workforce planning</li>
            <li>Align skills with business needs</li>
            <li>Enhance talent retention</li>
          </ul>
        </div>

      </div>

    </section>
  );
}