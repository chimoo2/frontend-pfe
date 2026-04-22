import React from "react";
import VantaNet from "../VantaNet";
import SkillGraph from "../SkillGraph";

export default function Hero1() {
  return (
    <section id="hero1" className="hero hero-landing" style={{ position: "relative", overflow: "hidden" }}>
      <VantaNet color={0x4f46e5} backgroundColor={0xf8fbff} showOnMobile={true} />
      <div className="hero-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-left">
          <p className="eyebrow">Talent intelligence powered by AI</p>
          <h1>Build the Right Career. Power the Right <span className="highlight">Teams</span></h1>
          <p className="hero-copy">An AI-powered platform for skills analysis, career recommendation, and workforce optimization.</p>
          <div className="hero-actions">
            <a href="#hero2" className="cta">Learn More</a>
            <a href="#hero3" className="cta secondary">See Features</a>
          </div>
        </div>

        <div className="hero-right" aria-hidden="true">
          <SkillGraph />
        </div>
      </div>
    </section>
  );
}
