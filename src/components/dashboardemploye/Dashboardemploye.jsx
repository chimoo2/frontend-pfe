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

export default function Dashboardemploye({ skills: propSkills, aiSkills: propAiSkills }) {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [aiSkills, setAiSkills] = useState([]);
    const [stats, setStats] = useState({ family: {}, category: {}, type: {}, domain: {} });
    const [summary, setSummary] = useState({ totalSkills: 0, uniqueFamilies: 0, uniqueCategories: 0, uniqueTypes: 0, uniqueDomains: 0 });

    useEffect(() => {
        // Use props if provided, otherwise fall back to localStorage (scoped by user)
        const currentSkills = propSkills !== undefined ? propSkills : getStoredSkills(user?.id);
        const currentAiSkills = propAiSkills !== undefined ? propAiSkills : getStoredAiSkills(user?.id);
        setSkills(currentSkills);
        setAiSkills(currentAiSkills);

        const combinedSkills = [...currentSkills, ...currentAiSkills];
        const familyStats = {}, categoryStats = {}, typeStats = {}, domainStats = {};

        combinedSkills.forEach(skill => {
            const s = typeof skill === 'string' ? { name: skill } : skill || {};
            if (s.family?.trim())   familyStats[s.family.trim()]     = (familyStats[s.family.trim()] || 0) + 1;
            if (s.category?.trim()) categoryStats[s.category.trim()] = (categoryStats[s.category.trim()] || 0) + 1;
            if (s.type?.trim())     typeStats[s.type.trim()]         = (typeStats[s.type.trim()] || 0) + 1;
            if (s.domain?.trim())   domainStats[s.domain.trim()]     = (domainStats[s.domain.trim()] || 0) + 1;
        });

        setStats({ family: familyStats, category: categoryStats, type: typeStats, domain: domainStats });
        setSummary({
            totalSkills: combinedSkills.length,
            uniqueFamilies: Object.keys(familyStats).length,
            uniqueCategories: Object.keys(categoryStats).length,
            uniqueTypes: Object.keys(typeStats).length,
            uniqueDomains: Object.keys(domainStats).length,
        });
    }, [propSkills, propAiSkills]);

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