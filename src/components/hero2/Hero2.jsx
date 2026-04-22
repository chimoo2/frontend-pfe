import "./About.css";

export default function About() {
  return (
    <section id="hero2" className="about">
      <div className="about-container">

        {/* LEFT */}
        <div className="about-text">
          <h2>What is CapTalent?</h2>
          <p>
            CapTalent is an AI-powered platform that analyzes skills,
            identifies gaps, and recommends career paths and project matches.
            It helps organizations optimize talent and improve workforce performance.
          </p>
        </div>

        {/* RIGHT */}
        <div className="about-cards">

          <div className="card">
            <span>🧠</span>
            <h4>Skill Analysis</h4>
            <p>Analyze employee skills and competencies</p>
          </div>

          <div className="card">
            <span>🤖</span>
            <h4>AI Insights</h4>
            <p>Smart career recommendations</p>
          </div>

          <div className="card">
            <span>🔗</span>
            <h4>Project Matching</h4>
            <p>Match talent to the right projects</p>
          </div>

          <div className="card">
            <span>📊</span>
            <h4>Analytics</h4>
            <p>Real-time dashboards & insights</p>
          </div>

        </div>

      </div>
    </section>
  );
}