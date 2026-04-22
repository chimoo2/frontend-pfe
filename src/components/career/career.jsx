import React from "react";
import CareerRecommendationForm from "../profile/CareerRecommendationForm";
import "./career.css";

export default function CareerPage({ employeeSkills = [] }) {
  return (
    <div className="cr-page">
      {/* ---- Banner ---- */}
      <div className="cr-banner">
        <div className="cr-banner-dots" />
        <div className="cr-banner-content">
          <div>
            <h1 className="cr-title">Career Path Recommendation</h1>
            <p className="cr-subtitle">
              Discover your ideal career path with our advanced AI platform.
              Analyze your skills, explore new opportunities, and strategically plan your professional growth.
            </p>
          </div>
          <span className="cr-badge">⚡ AI-Powered</span>
        </div>
      </div>

      {/* ---- Feature cards ---- */}
      <div className="cr-features">
        <div className="cr-feature">
          <div className="cr-feature-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="#3b82f6" strokeWidth="2"/><circle cx="14" cy="14" r="6" stroke="#3b82f6" strokeWidth="2"/><circle cx="14" cy="14" r="1.5" fill="#3b82f6"/></svg>
          </div>
          <h3>Personalized Analysis</h3>
          <p>Accurate evaluation of your skills and professional experience</p>
        </div>
        <div className="cr-feature">
          <div className="cr-feature-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 20l6-6 4 4 10-12" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 6h6v6" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h3>Career Roadmap</h3>
          <p>A detailed plan to help you achieve your career goals</p>
        </div>
        <div className="cr-feature">
          <div className="cr-feature-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="8" width="6" height="16" rx="1.5" stroke="#8b5cf6" strokeWidth="2"/><rect x="11" y="4" width="6" height="20" rx="1.5" stroke="#8b5cf6" strokeWidth="2"/><rect x="19" y="12" width="6" height="12" rx="1.5" stroke="#8b5cf6" strokeWidth="2"/></svg>
          </div>
          <h3>Smart Insights</h3>
          <p>Data-driven recommendations tailored to market trends</p>
        </div>
      </div>

      {/* ---- Form section ---- */}
      <div className="cr-form-section">
        <div className="cr-form-header">
          <span className="cr-form-tag">Get Started</span>
          <h2>Start Your Career Analysis</h2>
          <p>Fill out the form below to get personalized, AI-driven career recommendations</p>
        </div>
        <div className="cr-form-body">
          <CareerRecommendationForm employeeSkills={employeeSkills} />
        </div>
      </div>
    </div>
  );
}
