import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Dashboardemploye.css";

const getStoredSkills = (userId) => {
    if (!userId) return [];
    const saved = localStorage.getItem(`employeeSkills_${userId}`);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing skills:', e);
        }
    }
    return [];
};

const getStoredAiSkills = (userId) => {
    if (!userId) return [];
    const saved = localStorage.getItem(`employeeAiSkills_${userId}`);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing AI skills:', e);
        }
    }
    return [];
};

const SECTION_ICONS = {
    family: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    ),
    category: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    ),
    type: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
    ),
    domain: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    ),
};

const BAR_COLORS = [
    'linear-gradient(90deg, #6366f1, #818cf8)',
    'linear-gradient(90deg, #0ea5e9, #67e8f9)',
    'linear-gradient(90deg, #8b5cf6, #c4b5fd)',
    'linear-gradient(90deg, #f59e0b, #fcd34d)',
];

export default function Dashboardemploye({ skills: propSkills, aiSkills: propAiSkills, notifications: propNotifications }) {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [aiSkills, setAiSkills] = useState([]);
    const [stats, setStats] = useState({ family: {}, category: {}, type: {}, domain: {} });
    const [summary, setSummary] = useState({ totalSkills: 0, uniqueFamilies: 0, uniqueCategories: 0, uniqueTypes: 0, uniqueDomains: 0 });
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Combine toujours les deux sources
        const currentSkills = Array.isArray(propSkills) ? propSkills : [];
        const currentAiSkills = Array.isArray(propAiSkills) ? propAiSkills : [];
       const combinedSkills = [...currentSkills, ...currentAiSkills];

const getSkillKey = (skill) => {
  if (typeof skill === "string") {
    return skill.toLowerCase().trim();
  }

  return (
    skill?.skill_name ||
    skill?.skill ||
    skill?.name ||
    ""
  )
    .toLowerCase()
    .trim();
};

const uniqueSkills = combinedSkills.filter((skill, index, self) => {
  const key = getSkillKey(skill);

  if (!key) return false;

  return index === self.findIndex(s => getSkillKey(s) === key);
});
        if (propNotifications !== undefined) setNotifications(Array.isArray(propNotifications) ? propNotifications : []);
        setSkills(currentSkills);
        setAiSkills(currentAiSkills);

        const familyStats = {}, categoryStats = {}, typeStats = {}, domainStats = {};
        uniqueSkills.forEach(skill => {
            const s = typeof skill === 'string' ? { name: skill } : skill || {};
            if (s.family?.trim())   familyStats[s.family.trim()]     = (familyStats[s.family.trim()] || 0) + 1;
            if (s.category?.trim()) categoryStats[s.category.trim()] = (categoryStats[s.category.trim()] || 0) + 1;
            if (s.type?.trim())     typeStats[s.type.trim()]         = (typeStats[s.type.trim()] || 0) + 1;
            if (s.domain?.trim())   domainStats[s.domain.trim()]     = (domainStats[s.domain.trim()] || 0) + 1;
        });

        setStats({ family: familyStats, category: categoryStats, type: typeStats, domain: domainStats });
        setSummary({
            totalSkills: uniqueSkills.length,
            uniqueFamilies: Object.keys(familyStats).length,
            uniqueCategories: Object.keys(categoryStats).length,
            uniqueTypes: Object.keys(typeStats).length,
            uniqueDomains: Object.keys(domainStats).length,
        });
    }, [propSkills, propAiSkills, propNotifications]);

    const summaryCards = [
        { label: 'Total Skills', value: summary.totalSkills, accent: true, icon: '⚡' },
        { label: 'Families', value: summary.uniqueFamilies, icon: '👥' },
        { label: 'Categories', value: summary.uniqueCategories, icon: '📂' },
        { label: 'Types', value: summary.uniqueTypes, icon: '🧩' },
        { label: 'Domains', value: summary.uniqueDomains, icon: '🌐' },
    ];

    const sections = [
        { key: 'family', title: 'Family Statistics', data: stats.family, colorIdx: 0 },
        { key: 'category', title: 'Category Statistics', data: stats.category, colorIdx: 1 },
        { key: 'type', title: 'Type Statistics', data: stats.type, colorIdx: 2 },
        { key: 'domain', title: 'Domain Statistics', data: stats.domain, colorIdx: 3 },
    ];

    return (
        <div className="de-container">
            {/* Banner */}
            <div className="de-banner">
                <div className="de-banner-dots" />
                <div className="de-banner-content">
                    <div>
                        <h1 className="de-title">Skills Dashboard</h1>
                        <p className="de-subtitle">Analyze your extracted CV skills by family, domain, category, and type.</p>
                    </div>
                    <span className="de-chip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        Career Analytics
                    </span>
                </div>
            </div>

            {/* Summary cards */}
            <div className="de-summary-row">
                {summaryCards.map((c) => (
                    <div className={`de-summary-card${c.accent ? ' de-accent' : ''}`} key={c.label}>
                        <span className="de-summary-icon">{c.icon}</span>
                        <span className="de-summary-val">{c.value}</span>
                        <span className="de-summary-lbl">{c.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Recommendation Stats ── */}
            {notifications.length > 0 && (() => {
                const uniqueNotifs = notifications.reduce((acc, n) => {
                    if (!acc.find(x => x.projectId === n.projectId)) acc.push(n);
                    return acc;
                }, []);
                const assigned = uniqueNotifs.filter(n => n.assigned);
                const matching = uniqueNotifs.filter(n => !n.assigned);
                const totalCourses = uniqueNotifs.reduce((a, n) => a + (Array.isArray(n.recommendedCourses) ? n.recommendedCourses.length : 0), 0);
                const avgScore = uniqueNotifs.length > 0
                    ? Math.round(uniqueNotifs.reduce((a, n) => a + (n.score || 0), 0) / uniqueNotifs.length * 100)
                    : 0;

                return (
                    <div style={{ marginBottom: '28px' }}>
                        {/* Header */}
                        <div className="de-card-head" style={{ marginBottom: '16px', padding: '0 4px' }}>
                            <span className="de-card-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </span>
                            <h2 className="de-card-title">Recommandations & Matching</h2>
                            <span className="de-card-count">{uniqueNotifs.length} projet{uniqueNotifs.length > 1 ? 's' : ''}</span>
                        </div>

                        {/* Summary mini-cards */}
                        <div className="de-summary-row" style={{ marginBottom: '20px' }}>
                            {[
                                { label: 'Projets uniques', value: uniqueNotifs.length, icon: '🗂️', accent: true },
                                { label: 'Affectations', value: assigned.length, icon: '✅' },
                                { label: 'Matching', value: matching.length, icon: '🔍' },
                                { label: 'Formations', value: totalCourses, icon: '📚' },
                                { label: 'Score moyen', value: avgScore + '%', icon: '📊' },
                            ].map(c => (
                                <div className={`de-summary-card${c.accent ? ' de-accent' : ''}`} key={c.label}>
                                    <span className="de-summary-icon">{c.icon}</span>
                                    <span className="de-summary-val">{c.value}</span>
                                    <span className="de-summary-lbl">{c.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Projects score bars */}
                        <div className="de-grid-2">
                            {/* Score par projet */}
                            <div className="de-card">
                                <div className="de-card-head">
                                    <span className="de-card-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                                    </span>
                                    <h2 className="de-card-title">Score par projet</h2>
                                    <span className="de-card-count">{uniqueNotifs.length}</span>
                                </div>
                                <div className="de-bar-list">
                                    {[...uniqueNotifs]
                                        .sort((a, b) => (b.score || 0) - (a.score || 0))
                                        .slice(0, 8)
                                        .map((n, i) => {
                                            const pct = Math.round((n.score || 0) * 100);
                                            const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
                                            return (
                                                <div className="de-bar-item" key={i}>
                                                    <div className="de-bar-top">
                                                        <span className="de-bar-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <span style={{
                                                                width: 8, height: 8, borderRadius: '50%',
                                                                background: n.assigned ? '#10b981' : '#3b82f6',
                                                                flexShrink: 0, display: 'inline-block'
                                                            }} />
                                                            {n.projectName}
                                                        </span>
                                                        <span className="de-bar-val" style={{ color }}>{pct}%</span>
                                                    </div>
                                                    <div className="de-bar-track">
                                                        <div className="de-bar-fill" style={{
                                                            width: `${pct}%`,
                                                            background: `linear-gradient(90deg, ${color}88, ${color})`,
                                                        }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Formations par projet */}
                            <div className="de-card">
                                <div className="de-card-head">
                                    <span className="de-card-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                                    </span>
                                    <h2 className="de-card-title">Formations par projet</h2>
                                    <span className="de-card-count">{totalCourses}</span>
                                </div>
                                <div className="de-bar-list">
                                    {[...uniqueNotifs]
                                        .filter(n => (n.recommendedCourses || []).length > 0)
                                        .sort((a, b) => b.recommendedCourses.length - a.recommendedCourses.length)
                                        .slice(0, 8)
                                        .map((n, i) => {
                                            const count = n.recommendedCourses.length;
                                            const maxC = Math.max(...uniqueNotifs.map(x => (x.recommendedCourses || []).length), 1);
                                            return (
                                                <div className="de-bar-item" key={i}>
                                                    <div className="de-bar-top">
                                                        <span className="de-bar-name">{n.projectName}</span>
                                                        <span className="de-bar-val">{count} cours</span>
                                                    </div>
                                                    <div className="de-bar-track">
                                                        <div className="de-bar-fill" style={{
                                                            width: `${(count / maxC) * 100}%`,
                                                            background: 'linear-gradient(90deg, #8b5cf6, #c4b5fd)',
                                                        }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {uniqueNotifs.every(n => !(n.recommendedCourses || []).length) && (
                                        <div className="de-empty"><span>Aucune formation disponible</span></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Stats sections */}
            <div className="de-grid-2">
                {sections.map(({ key, title, data, colorIdx }) => {
                    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
                    const max = entries.length > 0 ? Math.max(...entries.map(([, c]) => c)) : 1;

                    return (
                        <div className="de-card" key={key}>
                            <div className="de-card-head">
                                <span className="de-card-icon">{SECTION_ICONS[key]}</span>
                                <h2 className="de-card-title">{title}</h2>
                                <span className="de-card-count">{entries.length}</span>
                            </div>

                            {entries.length === 0 ? (
                                <div className="de-empty">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                                    <span>No data yet</span>
                                </div>
                            ) : (
                                <div className="de-bar-list">
                                    {entries.map(([name, count]) => (
                                        <div className="de-bar-item" key={name}>
                                            <div className="de-bar-top">
                                                <span className="de-bar-name">{name}</span>
                                                <span className="de-bar-val">{count}</span>
                                            </div>
                                            <div className="de-bar-track">
                                                <div
                                                    className="de-bar-fill"
                                                    style={{
                                                        width: `${(count / max) * 100}%`,
                                                        background: BAR_COLORS[colorIdx],
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}