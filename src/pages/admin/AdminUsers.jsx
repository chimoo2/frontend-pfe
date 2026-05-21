import React, { useEffect, useState } from "react";
import { createUser } from "../../api/adminApi";
import { getAllProjects, updateProject as updateProjectApi, deleteProject as deleteProjectApi } from "../../api/projectApi";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";
import { useNavigate } from "react-router-dom";
import ProjectDetailModal from "../../components/kanban/ProjectDetailModal";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import "./AdminUsers.css";

const ROLE_OPTIONS = [
  { value: "ROLE_USER", label: "Employee" },
  { value: "ROLE_MANAGER", label: "Manager" },
  { value: "ROLE_ADMIN", label: "Administrator" },
];

function getRoleClass(role) {
  if (!role) return "";
  if (role.includes("ADMIN")) return "admin";
  if (role.includes("MANAGER")) return "manager";
  return "user";
}

function getInitials(prenom, nom) {
  return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase() || "?";
}

function getProjectStatusClass(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("progress")) return "progress";
  if (value.includes("complete") || value.includes("done")) return "completed";
  return "todo";
}

function getProjectStatusLabel(status) {
  const statusClass = getProjectStatusClass(status);
  if (statusClass === "progress") return "In Progress";
  if (statusClass === "completed") return "Completed";
  return "To Do";
}

function formatProjectDate(date) {
  if (!date) return "No date";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapProjectToDetailModal(project) {
  return {
    ...project,
    skillsNeeded: (project.requiredSkills || []).map((skill) => ({
      skill: skill.skillName || skill.skill || "",
      level: skill.level || "Intermediate",
      count: skill.count ?? 1,
      domain: skill.domain || "",
      family: skill.family || "",
      category: skill.category || "",
      type: skill.type || "",
    })),
    categoryRequirements: project.categoryRequirements || [],
    teamAssigned: project.teamMembers || project.teamAssigned || [],
  };
}

function mapDetailModalToProjectPayload(project) {
  return {
    ...project,
    requiredSkills: (project.skillsNeeded || []).map((skill) => ({
      skillName: skill.skill || skill.skillName || "",
      level: skill.level || "Intermediate",
      count: skill.count ?? 1,
      domain: skill.domain || "",
      family: skill.family || "",
      category: skill.category || "",
      type: skill.type || "",
    })),
    categoryRequirements: project.categoryRequirements || [],
    teamMembers: project.teamAssigned || project.teamMembers || [],
  };
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { users, loading: usersLoading, addUser: createUserContext } = useUsers();
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projectDeleteTarget, setProjectDeleteTarget] = useState(null);
  const [projectEditTarget, setProjectEditTarget] = useState(null);

  // Liste des rôles métiers (mêmes que CareerRecommendationForm)
  const AVAILABLE_ROLES = [
    'Junior Developer', 'Developer', 'Senior Developer', 'Tech Lead', 'Architect',
    'Junior QA Engineer', 'QA Engineer', 'Senior QA Engineer', 'QA Lead', 'QA Manager',
    'Junior DevOps Engineer', 'DevOps Engineer', 'Senior DevOps Engineer', 'DevOps Lead', 'DevOps Architect',
    'Data Analyst', 'Senior Data Analyst', 'Data Scientist', 'Data Architect', 'Chief Data Officer',
    'Junior Data Engineer', 'Data Engineer', 'Senior Data Engineer', 'Data Engineering Lead', 'Data Platform Architect',
    'ML Engineer', 'Senior ML Engineer', 'ML Architect', 'AI Research Lead', 'Chief AI Officer',
    'Business Analyst', 'Senior Business Analyst', 'BI Analyst', 'BI Manager', 'BI Director',
    'Junior Designer', 'Designer', 'Senior Designer', 'Design Lead', 'Creative Director',
    'Junior Consultant', 'Consultant', 'Senior Consultant', 'Manager', 'Director',
    'Financial Analyst', 'Senior Financial Analyst', 'Finance Manager', 'Finance Director', 'CFO',
    'Security Analyst', 'Senior Security Engineer', 'Security Architect', 'Security Manager', 'CISO',
  ];

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: "ROLE_USER",
    current_role: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setProjectsLoading(true);
    setError(null);
    try {
      const data = await getAllProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Error loading projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = { ...form };
      if (payload.current_role !== undefined) {
        payload.currentRole = payload.current_role;
        delete payload.current_role;
      }
      await createUserContext(payload);
      setForm({ prenom: "", nom: "", email: "", password: "", role: "ROLE_USER", current_role: "" });
      setSuccess("User created successfully.");
      setTimeout(() => setSuccess(null), 4000);
    } catch (e) {
      setError(e.message || "Error creating user");
    }
  };

  const handleProjectEdit = async (updatedProject) => {
    if (!updatedProject) return;
    setError(null);
    setSuccess(null);
    try {
      const parsedCount = updatedProject.count === "" || updatedProject.count === null
        ? null
        : Number(updatedProject.count);
      const payload = {
        ...mapDetailModalToProjectPayload(updatedProject),
        count: Number.isNaN(parsedCount) ? null : parsedCount,
        status: updatedProject.status || "To Do",
        endDate: updatedProject.endDate || null,
      };
      await updateProjectApi(updatedProject.id, payload);
      setSuccess(`Project ${payload.name} has been updated.`);
      setProjectEditTarget(null);
      await loadProjects();
      setTimeout(() => setSuccess(null), 4000);
    } catch (e) {
      setError(e.message || "Error updating project");
    }
  };

  const handleProjectDelete = async () => {
    if (!projectDeleteTarget) return;
    setError(null);
    setSuccess(null);
    try {
      await deleteProjectApi(projectDeleteTarget.id);
      setSuccess(`${projectDeleteTarget.name} has been deleted.`);
      setProjectDeleteTarget(null);
      await loadProjects();
      setTimeout(() => setSuccess(null), 4000);
    } catch (e) {
      setError(e.message || "Error deleting project");
      setProjectDeleteTarget(null);
    }
  };

  const openProjectEdit = (project) => {
    setProjectEditTarget(mapProjectToDetailModal(project));
  };

  const filteredProjects = projects.filter((project) => {
    const query = projectSearch.trim().toLowerCase();
    if (!query) return true;
    return [project.name, project.manager, project.status, project.description]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const counts = {
    total: users.length,
    admins: users.filter((u) => u.role === "ROLE_ADMIN").length,
    managers: users.filter((u) => u.role === "ROLE_MANAGER").length,
    employees: users.filter((u) => u.role === "ROLE_USER").length,
  };

  const projectCounts = {
    total: projects.length,
    managers: new Set(projects.map((project) => (project.manager || "").toLowerCase()).filter(Boolean)).size,
    inProgress: projects.filter((project) => getProjectStatusClass(project.status) === "progress").length,
    completed: projects.filter((project) => getProjectStatusClass(project.status) === "completed").length,
    todo: projects.filter((project) => getProjectStatusClass(project.status) === "todo").length,
  };

  const managerNameByEmail = users.reduce((acc, account) => {
    if (!account.email) return acc;
    const fullName = `${account.prenom || ""} ${account.nom || ""}`.trim();
    acc[account.email.toLowerCase()] = fullName || account.email;
    return acc;
  }, {});

  const getManagerDisplayName = (managerEmail) => {
    if (!managerEmail) return "Unknown manager";
    return managerNameByEmail[managerEmail.toLowerCase()] || managerEmail;
  };

  // --- Compute project count per manager ---
  const managerProjectCounts = users
    .filter((u) => u.role === "ROLE_MANAGER")
    .map((manager) => {
      const email = manager.email?.toLowerCase();
      const fullName = `${manager.prenom || ""} ${manager.nom || ""}`.trim() || manager.email;
      const count = projects.filter((p) => (p.manager || "").toLowerCase() === email).length;
      return { email, fullName, count };
    });

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        userName={user ? `${user.prenom || ""} ${user.nom || ""}`.trim() : "Admin"}
        userRole="Administrator"
        sections={[
          {
            title: "Administration",
            items: [
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "create-user", label: "Create User", icon: "➕" },
              { id: "projects", label: "Projects", icon: "📁" },
            ],
          },
          {
            title: "Navigation",
            items: [
              { id: "user-list", path: "/admin/users", label: "User List", icon: "👥" },
            ],
          },
        ]}
        activeItem={activeTab}
        onItemClick={(id) => {
          if (id === "user-list") {
            navigate("/admin/users");
          } else {
            setActiveTab(id);
          }
        }}
        onLogout={logout}
        useNavLink={false}
      />

      <Topbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        search={search}
        setSearch={setSearch}
        onRefresh={() => {
          loadProjects();
        }}
        loading={projectsLoading}
        title="Administration"
        searchPlaceholder="Search..."
      />

      <main className="admin-main">
        <div className="admin-content">
          {/* ===== Alerts ===== */}
          {success && (
            <div className="au-alert au-alert-success">
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke="#16a34a" strokeWidth="1.6"/><path d="M5.5 9.5l2 2 5-5" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {success}
              <button className="au-alert-close" onClick={() => setSuccess(null)}>&times;</button>
            </div>
          )}
          {error && (
            <div className="au-alert au-alert-error">
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke="#dc2626" strokeWidth="1.6"/><path d="M9 5.5v4M9 12h.01" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round"/></svg>
              {error}
              <button className="au-alert-close" onClick={() => setError(null)}>&times;</button>
            </div>
          )}

          {/* ==================== DASHBOARD TAB ==================== */}
          {(activeTab === "dashboard" || activeTab === "create-user") && (
            <>

              {activeTab === "dashboard" && (
                <>
                  <div className="au-page-header">
                    <div>
                      <h1>Dashboard</h1>
                      <p>Platform overview</p>
                    </div>
                  </div>
                  <div className="au-dashboard">
                    <div className="au-dash-card">
                      <div className="au-dash-icon purple">{"\uD83D\uDC65"}</div>
                      <span className="au-dash-val">{counts.total}</span>
                      <span className="au-dash-label">Total Users</span>
                    </div>
                    <div className="au-dash-card">
                      <div className="au-dash-icon red">{"\uD83D\uDEE1\uFE0F"}</div>
                      <span className="au-dash-val">{counts.admins}</span>
                      <span className="au-dash-label">Administrators</span>
                    </div>
                    <div className="au-dash-card">
                      <div className="au-dash-icon green">{"\uD83D\uDCBC"}</div>
                      <span className="au-dash-val">{counts.managers}</span>
                      <span className="au-dash-label">Managers</span>
                    </div>
                    <div className="au-dash-card">
                      <div className="au-dash-icon blue">{"\uD83D\uDC64"}</div>
                      <span className="au-dash-val">{counts.employees}</span>
                      <span className="au-dash-label">Employees</span>
                    </div>
                  </div>

                  {/* --- Tableau des managers et nombre de projets --- */}
                  <div className="au-card" style={{ marginTop: 32 }}>
                    <h2 style={{ marginBottom: 12 }}>Managers & Nombre de Projets</h2>
                    <table className="au-table">
                      <thead>
                        <tr>
                          <th>Manager</th>
                          <th>Email</th>
                          <th>Nombre de projets</th>
                        </tr>
                      </thead>
                      <tbody>
                        {managerProjectCounts.length === 0 ? (
                          <tr><td colSpan={3} style={{ textAlign: "center" }}>Aucun manager</td></tr>
                        ) : (
                          managerProjectCounts.map((m) => (
                            <tr key={m.email}>
                              <td>{m.fullName}</td>
                              <td>{m.email}</td>
                              <td><b>{m.count}</b></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === "create-user" && (
                <>
                  <div className="au-page-header">
                    <div>
                      <h1>User Management</h1>
                      <p>Create new user accounts</p>
                    </div>
                  </div>

                  <div className="au-grid">
                    {/* ---- Create User Card ---- */}
                    <div className="au-card">
                      <div className="au-card-header">
                        <div className="au-card-header-icon">+</div>
                        <div>
                          <h2>New User</h2>
                          <p>Fill in the form below</p>
                        </div>
                      </div>
                      <div className="au-card-body">
                        <form onSubmit={handleSubmit} className="au-form">
                          <div className="au-form-row">
                            <div className="au-field">
                              <label>First Name</label>
                              <input required value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} placeholder="John" />
                            </div>
                            <div className="au-field">
                              <label>Last Name</label>
                              <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} placeholder="Doe" />
                            </div>
                          </div>
                          <div className="au-field">
                            <label>Email</label>
                            <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="jean.dupont@email.com" />
                          </div>
                          <div className="au-form-row">
                            <div className="au-field">
                              <label>Password</label>
                              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="********" />
                            </div>
                            <div className="au-field">
                              <label>Role</label>
                              <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                                {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="au-field">
                            <label>Current Role (Métier)</label>
                            <select value={form.current_role} onChange={e => setForm({ ...form, current_role: e.target.value })} required>
                              <option value="">Select current role</option>
                              {AVAILABLE_ROLES.map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </div>
                          <button type="submit" className="au-submit-btn">
                            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            Create User
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ==================== OTHER TABS ==================== */}
          {activeTab === "projects" && (
            <>
              <div className="au-page-header">
                <div>
                  <h1>Project Management</h1>
                  <p>Browse every project, see which manager owns it, then edit or delete it from here.</p>
                </div>
                <div className="au-header-stats">
                  <div className="au-mini-stat">
                    <div className="au-stat-icon purple">📁</div>
                    <div className="au-stat-copy">
                      <div className="au-stat-val">{projectCounts.total}</div>
                      <div className="au-stat-subtext">Projects</div>
                    </div>
                  </div>
                  <div className="au-mini-stat">
                    <div className="au-stat-icon green">👤</div>
                    <div className="au-stat-copy">
                      <div className="au-stat-val">{projectCounts.managers}</div>
                      <div className="au-stat-subtext">Managers</div>
                    </div>
                  </div>
                  <div className="au-mini-stat">
                    <div className="au-stat-icon blue">⚡</div>
                    <div className="au-stat-copy">
                      <div className="au-stat-val">{projectCounts.inProgress}</div>
                      <div className="au-stat-subtext">In progress</div>
                    </div>
                  </div>
                  <div className="au-mini-stat">
                    <div className="au-stat-icon orange">📝</div>
                    <div className="au-stat-copy">
                      <div className="au-stat-val">{projectCounts.todo}</div>
                      <div className="au-stat-subtext">To Do</div>
                    </div>
                  </div>
                  <div className="au-mini-stat">
                    <div className="au-stat-icon red">✅</div>
                    <div className="au-stat-copy">
                      <div className="au-stat-val">{projectCounts.completed}</div>
                      <div className="au-stat-subtext">Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="au-card">
                <div className="au-table-toolbar">
                  <div className="au-table-search">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <input placeholder="Search projects or managers..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} />
                  </div>
                  <span className="au-table-count"><strong>{filteredProjects.length}</strong> project{filteredProjects.length !== 1 ? "s" : ""}</span>
                </div>

                {projectsLoading ? (
                  <div className="au-loading"><div className="au-spinner" /> Loading projects...</div>
                ) : filteredProjects.length === 0 ? (
                  <div className="au-empty">
                    <h3>No projects found</h3>
                    <p>Try another search or create projects from the manager side.</p>
                  </div>
                ) : (
                  <div className="au-table-wrap">
                    <table className="au-table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Manager</th>
                          <th>Timeline</th>
                          <th>Status</th>
                          <th>Scope</th>
                          <th className="au-th-actions">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((project) => {
                          const statusClass = getProjectStatusClass(project.status);
                          const managerDisplayName = getManagerDisplayName(project.manager);
                          return (
                            <tr key={project.id}>
                              <td>
                                <div className="au-project-cell">
                                  <div className="au-project-icon">📁</div>
                                  <div className="au-project-info">
                                    <span className="au-project-name">{project.name}</span>
                                    <span className="au-project-desc">{project.description || "No description provided"}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="au-project-owner">
                                  <span className="au-project-owner-name">{managerDisplayName}</span>
                                  {project.manager && managerDisplayName !== project.manager && (
                                    <span className="au-project-owner-email">{project.manager}</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="au-project-meta">
                                  <span>{formatProjectDate(project.startDate)}</span>
                                  <span>{project.duration || (project.endDate ? `Until ${formatProjectDate(project.endDate)}` : "No duration")}</span>
                                </div>
                              </td>
                              <td>
                                <span className={`au-role au-role-project au-role-${statusClass}`}>{getProjectStatusLabel(project.status)}</span>
                              </td>
                              <td>
                                <div className="au-project-scope">
                                  <span>{project.requiredSkills?.length || 0} skills</span>
                                  <span>{Array.isArray(project.categoryRequirements) ? project.categoryRequirements.length : 0} requirements</span>
                                  <span>{Array.isArray(project.teamMembers) ? project.teamMembers.length : Array.isArray(project.teamAssigned) ? project.teamAssigned.length : 0} members</span>
                                </div>
                              </td>
                              <td>
                                <div className="au-actions">
                                  <button className="au-btn-icon edit" title="Edit project" onClick={() => openProjectEdit(project)}>
                                    <span role="img" className="au-btn-emoji">✏️</span>
                                  </button>
                                  <button className="au-btn-icon danger" title="Delete project" onClick={() => setProjectDeleteTarget(project)}>
                                    <span role="img" className="au-btn-emoji">🗑️</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === "settings" && (
            <div className="au-placeholder">
              <h2>System Settings</h2>
              <p>Coming soon</p>
            </div>
          )}
        </div>
      </main>

      {/* ===== Delete Confirmation Modal ===== */}
      {projectDeleteTarget && (
        <div className="au-modal-overlay" onClick={() => setProjectDeleteTarget(null)}>
          <div className="au-modal" onClick={(e) => e.stopPropagation()}>
            <div className="au-modal-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M4 8h20M9.33 8V5.33A2.67 2.67 0 0112 2.67h4a2.67 2.67 0 012.67 2.66V8m4 0v16a2.67 2.67 0 01-2.67 2.67H8a2.67 2.67 0 01-2.67-2.67V8H22.67z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Delete this project?</h3>
            <p>You are about to remove</p>
            <p className="au-modal-user">{projectDeleteTarget.name}</p>
            <p>This action cannot be undone.</p>
            <div className="au-modal-actions">
              <button className="au-modal-cancel" onClick={() => setProjectDeleteTarget(null)}>Cancel</button>
              <button className="au-modal-delete" onClick={handleProjectDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {projectEditTarget && (
        <ProjectDetailModal
          open={!!projectEditTarget}
          onClose={() => setProjectEditTarget(null)}
          project={projectEditTarget}
          onSave={handleProjectEdit}
          onDelete={async (projectId) => {
            try {
              setError(null);
              setSuccess(null);
              await deleteProjectApi(projectId);
              setSuccess(`Project ${projectEditTarget.name} has been deleted.`);
              setProjectEditTarget(null);
              await loadProjects();
              setTimeout(() => setSuccess(null), 4000);
            } catch (e) {
              setError(e.message || "Error deleting project");
            }
          }}
          showMatchingAction={false}
        />
      )}
    </div>
  );
}
