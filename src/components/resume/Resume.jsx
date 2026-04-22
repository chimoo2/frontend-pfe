import React from "react";
import { BASE_URL } from "../../api/apiClient";
import "./Resume.css";

export default function ResumePage({
  file,
  dragActive,
  profile,
  uploading,
  progress,
  fileInputRef,
  onDrag,
  onDrop,
  handleFiles,
  uploadCv,
  setFile,
}) {
  return (
    <div className="rs-page">
      {/* ---- Banner ---- */}
      <div className="rs-banner">
        <div className="rs-banner-dots" />
        <div className="rs-banner-content">
          <div>
            <h1 className="rs-title">Resume Management</h1>
            <p className="rs-subtitle">
              Upload your resume so our AI engine can analyze your skills,
              generate recommendations, and match your profile with the right opportunities.
            </p>
          </div>
          <span className="rs-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Upload CV
          </span>
        </div>
      </div>

      {/* ---- Drop zone card ---- */}
      <div className="rs-card">
        <div
          className={`rs-dropzone ${dragActive ? "rs-dropzone-active" : ""}`}
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />

          {!file ? (
            <div className="rs-drop-empty">
              <div className="rs-drop-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="6" width="32" height="28" rx="4" stroke="#3b82f6" strokeWidth="2.2" />
                  <path d="M20 16v10M15 21l5-5 5 5" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Drop your resume here</h3>
              <p>
                or{" "}
                <button
                  type="button"
                  className="rs-browse-link"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse files
                </button>
              </p>
              <span className="rs-formats">PDF, Word — Max 10 MB</span>
            </div>
          ) : (
            <div className="rs-file-preview">
              <div className="rs-file-left">
                <div className="rs-file-icon">
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="4" y="2" width="18" height="22" rx="3" stroke="#2563eb" strokeWidth="2"/><path d="M9 10h8M9 14h5" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <p className="rs-file-name">{file.name}</p>
                  <span className="rs-file-size">{(file.size / 1024).toFixed(0)} KB</span>
                </div>
              </div>
              <button
                type="button"
                className="rs-file-remove"
                onClick={() => setFile(null)}
                title="Remove file"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          )}
        </div>

        {profile?.cvPath && !file && (
          <div className="rs-current">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 14h12M8 2v9M5 8l3 3 3-3" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Current CV :
            <a href={`${BASE_URL}${profile.cvPath.startsWith('/') ? '' : '/'}${profile.cvPath}`} target="_blank" rel="noreferrer">Download</a>
          </div>
        )}

        {uploading && (
          <div className="rs-progress">
            <div className="rs-progress-track">
              <div className="rs-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="rs-progress-pct">{progress}%</span>
          </div>
        )}

        <button
          type="button"
          className="rs-upload-btn"
          onClick={uploadCv}
          disabled={!file || uploading || !profile?.id}
        >
          {uploading ? (
            <><span className="rs-spinner" /> Uploading...</>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 14V4M5 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Upload Resume
            </>
          )}
        </button>

        {!profile?.id && (
          <div className="rs-warning">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.4"/><path d="M8 5v3.5M8 11h.01" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round"/></svg>
            Please log in or load your profile before uploading a CV.
          </div>
        )}
      </div>

      {/* ---- Tips ---- */}
      <div className="rs-tips">
        <div className="rs-tip">
          <div className="rs-tip-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#0ea5e9" strokeWidth="1.6"/><path d="M10 7v3l2 2" stroke="#0ea5e9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <strong>Keep it fresh</strong>
            <p>Updating your resume regularly ensures better skill analysis and matches.</p>
          </div>
        </div>
        <div className="rs-tip">
          <div className="rs-tip-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" stroke="#8b5cf6" strokeWidth="1.6"/><path d="M7 7h6M7 10h4" stroke="#8b5cf6" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
          <div>
            <strong>Best formats</strong>
            <p>Use PDF or Word for optimal AI parsing and accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}