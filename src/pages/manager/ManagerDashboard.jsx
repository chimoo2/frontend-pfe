import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { getProjectsByManager } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ManagerDashboard.css';

export default function ManagerDashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inprogress: 0, completed: 0, overdue: 0, dueSoon: 0 });
  const [monthlySeries, setMonthlySeries] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;
      try {
        const list = await getProjectsByManager(user.email);
        setProjects(list);
        const today = new Date();
        const counts = { total: list.length, todo: 0, inprogress: 0, completed: 0, overdue: 0, dueSoon: 0 };
        const monthly = {};
        list.forEach(p => {
          const st = (p.status || '').toLowerCase();
          if (st.includes('progress')) {
            counts.inprogress++;
          } else if (st.includes('complete') || st.includes('done')) {
            counts.completed++;
          } else if (
            st === 'to do' ||
            st === 'todo' ||
            st === 'to-do' ||
            st === 'à faire' ||
            st === 'not started' ||
            st === 'en attente'
          ) {
            counts.todo++;
          } else {
            // Par défaut, tout statut inconnu est "To Do"
            counts.todo++;
          }
          if (p.endDate) {
            const end = new Date(p.endDate);
            if (end < today && !st.includes('complete')) counts.overdue++;
            else if (end >= today && end <= new Date(today.getTime() + 30*24*60*60*1000)) counts.dueSoon++;
          }
          if (p.startDate) {
            const mi = new Date(p.startDate).getMonth();
            monthly[mi] = (monthly[mi] || 0) + 1;
          }
        });
        const skillCounts = {};
        list.forEach(p => {
          (p.requiredSkills || []).forEach(s => {
            const n = s.skillName || s.skill || 'Unknown';
            skillCounts[n] = (skillCounts[n] || 0) + 1;
          });
        });
        const ts = Object.entries(skillCounts).sort((a,b) => b[1]-a[1]).slice(0,5)
          .map(([name, count]) => ({ name, count }));
        setStats(counts);
        const mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        setMonthlySeries([{ name: 'Projects', data: mNames.map((_,i) => monthly[i] || 0) }]);
        setTopSkills(ts);
      } catch (e) {
        console.error('Failed loading projects for dashboard', e);
      }
    };
    load();
  }, [user?.email]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Donut chart config
  const donutOptions = {
    chart: { type: 'donut', toolbar: { show: false }, fontFamily: 'Inter, system-ui, sans-serif' },
    labels: ['To Do', 'In Progress', 'Completed'],
    legend: { position: 'bottom', fontSize: '13px', fontWeight: 600, markers: { width: 10, height: 10, radius: 3 } },
    colors: ['#818cf8', '#f59e0b', '#10b981'],
    stroke: { width: 3, colors: ['#fff'] },
    dataLabels: { enabled: true, style: { fontSize: '12px', fontWeight: 700 }, dropShadow: { enabled: false } },
    plotOptions: { pie: { donut: { size: '70%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '14px', fontWeight: 700, color: '#334155', formatter: () => stats.total } } } } },
    tooltip: { theme: 'light' },
  };

  // Bar chart config
  const barOptions = {
    chart: { stacked: false, toolbar: { show: false }, fontFamily: 'Inter, system-ui, sans-serif', animations: { enabled: true, speed: 600 } },
    plotOptions: { bar: { columnWidth: '50%', borderRadius: 6, borderRadiusApplication: 'end' } },
    colors: ['#6366f1'],
    xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 500 } } },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 500 } } },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4, xaxis: { lines: { show: false } } },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light', style: { fontSize: '12px' } },
  };

  // Sparkline config
  const sparkOptions = {
    chart: { sparkline: { enabled: true }, animations: { enabled: true } },
    stroke: { curve: 'smooth', width: 2.5 },
    colors: ['#6366f1'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 } },
    tooltip: { enabled: false },
  };
  const sparkSeries = [{ name: 'trend', data: monthlySeries[0]?.data || [0,0,0,0,0,0,0,0,0,0,0,0] }];

  // Recent projects (last 5)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))
    .slice(0, 5);

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('progress')) return 'md-status-progress';
    if (s.includes('complete') || s.includes('done')) return 'md-status-done';
    return 'md-status-todo';
  };

  const getStatusLabel = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('progress')) return 'In Progress';
    if (s.includes('complete') || s.includes('done')) return 'Completed';
    return 'To Do';
  };

  return (
    <div className="md-dashboard">
      {/* ===== Welcome Banner ===== */}
      <div className="md-welcome">
        <div className="md-welcome-bg" />
        <div className="md-welcome-content">
          <div className="md-welcome-left">
            <div className="md-welcome-avatar">
              {(user?.prenom?.[0] || user?.nom?.[0] || 'M').toUpperCase()}
            </div>
            <div className="md-welcome-text">
              <h1>Welcome back, {user?.prenom || user?.nom || 'Manager'}</h1>
              <p>{dateStr}</p>
            </div>
          </div>
          <div className="md-welcome-right">
            <button className="md-btn md-btn-primary" onClick={() => navigate('/manager/projects/new')}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              New Project
            </button>
            <button className="md-btn md-btn-glass" onClick={() => navigate('/manager/projects')}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 3h12M2 8h12M2 13h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              View All
            </button>
          </div>
        </div>
      </div>

      {/* ===== Stat Cards ===== */}
      <div className="md-stats-grid">
        <div className="md-stat-card md-stat-purple">
          <div className="md-stat-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" stroke="currentColor" strokeWidth="1.8"/><path d="M8 12h8M8 8h5M8 16h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
          <div className="md-stat-info">
            <span className="md-stat-label">Total Projects</span>
            <span className="md-stat-value">{stats.total}</span>
          </div>
          <div className="md-stat-sparkline">
            <Chart options={sparkOptions} series={sparkSeries} type="area" width={80} height={36} />
          </div>
        </div>

        <div className="md-stat-card md-stat-blue">
          <div className="md-stat-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="md-stat-info">
            <span className="md-stat-label">In Progress</span>
            <span className="md-stat-value">{stats.inprogress}</span>
          </div>
          <div className="md-stat-badge">Active</div>
        </div>

        <div className="md-stat-card md-stat-green">
          <div className="md-stat-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/></svg>
          </div>
          <div className="md-stat-info">
            <span className="md-stat-label">Completed</span>
            <span className="md-stat-value">{stats.completed}</span>
          </div>
          <div className="md-stat-percent">{completionRate}%</div>
        </div>

        <div className="md-stat-card md-stat-red">
          <div className="md-stat-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M8 12h8M8 8h5M8 16h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
          <div className="md-stat-info">
            <span className="md-stat-label">To Do</span>
            <span className="md-stat-value">{stats.todo}</span>
          </div>
          {stats.dueSoon > 0 && <div className="md-stat-warn">{stats.dueSoon} due soon</div>}
        </div>
      </div>

      {/* ===== Charts Row ===== */}
      <div className="md-charts-grid">
        {/* Donut Chart */}
        <div className="md-card md-card-donut">
          <div className="md-card-header">
            <div>
              <h3>Project Status</h3>
              <p>Distribution overview</p>
            </div>
          </div>
          <div className="md-card-body md-donut-wrapper">
            <Chart options={donutOptions} series={[stats.todo, stats.inprogress, stats.completed]} type="donut" height={280} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="md-card md-card-bar">
          <div className="md-card-header">
            <div>
              <h3>Monthly Activity</h3>
              <p>Projects started per month</p>
            </div>
            <span className="md-card-tag">{stats.total} total</span>
          </div>
          <div className="md-card-body">
            <Chart options={barOptions} series={monthlySeries} type="bar" height={280} />
          </div>
        </div>
      </div>

      {/* ===== Bottom Row ===== */}
      <div className="md-bottom-grid">
        {/* Top Skills */}
        <div className="md-card md-card-skills">
          <div className="md-card-header">
            <div>
              <h3>Top Skills Demanded</h3>
              <p>Most requested across projects</p>
            </div>
          </div>
          <div className="md-card-body">
            {topSkills.length === 0 ? (
              <div className="md-empty-mini">No skill data yet</div>
            ) : (
              <div className="md-skills-list">
                {topSkills.map((skill, i) => {
                  const maxCount = topSkills[0]?.count || 1;
                  const pct = Math.round((skill.count / maxCount) * 100);
                  return (
                    <div key={i} className="md-skill-item">
                      <div className="md-skill-rank">#{i + 1}</div>
                      <div className="md-skill-detail">
                        <div className="md-skill-name-row">
                          <span className="md-skill-name">{skill.name}</span>
                          <span className="md-skill-count">{skill.count} project{skill.count > 1 ? 's' : ''}</span>
                        </div>
                        <div className="md-skill-bar-bg">
                          <div className="md-skill-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="md-card md-card-recent">
          <div className="md-card-header">
            <div>
              <h3>Recent Projects</h3>
              <p>Latest activity</p>
            </div>
            <button className="md-link-btn" onClick={() => navigate('/manager/projects')}>See all →</button>
          </div>
          <div className="md-card-body md-card-body-flush">
            {recentProjects.length === 0 ? (
              <div className="md-empty-mini">No projects yet. Create your first one!</div>
            ) : (
              <div className="md-recent-list">
                {recentProjects.map((p, i) => (
                  <div key={p.id || i} className="md-recent-item">
                    <div className="md-recent-color" />
                    <div className="md-recent-info">
                      <span className="md-recent-name">{p.name || p.titre || 'Untitled'}</span>
                      <span className="md-recent-date">
                        {p.startDate ? new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                      </span>
                    </div>
                    <span className={`md-recent-status ${getStatusClass(p.status)}`}>
                      {getStatusLabel(p.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}