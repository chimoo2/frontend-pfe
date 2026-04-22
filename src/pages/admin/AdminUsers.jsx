import React, { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser, updateUser } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
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

export default function AdminUsers() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ prenom: "", nom: "", email: "", role: "ROLE_USER", password: "" });

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      setError(e.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createUser(form);
      setForm({ prenom: "", nom: "", email: "", password: "", role: "ROLE_USER" });
      setSuccess("User created successfully.");
      load();
      setTimeout(() => setSuccess(null), 4000);
    } catch (e) {
      setError(e.message || "Error creating user");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setError(null);
    setSuccess(null);
    try {
      await deleteUser(deleteTarget.id);
      setSuccess(`${deleteTarget.prenom} ${deleteTarget.nom} has been deleted.`);
      setDeleteTarget(null);
      load();
      setTimeout(() => setSuccess(null), 4000);
    } catch (e) {
      setError(e.message || "Error deleting user");
      setDeleteTarget(null);
    }
  };

  const openEdit = (u) => {
    setEditTarget(u);
    setEditForm({ prenom: u.prenom || "", nom: u.nom || "", email: u.email || "", role: u.role || "ROLE_USER", password: "" });
  };

  const handleEdit = async (evt) => {
    evt.preventDefault();
    if (!editTarget) return;
    setError(null);
    setSuccess(null);
    try {
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;
      await updateUser(editTarget.id, payload);
      setSuccess(`${editForm.prenom} ${editForm.nom} has been updated.`);
      setEditTarget(null);
      load();
      setTimeout(() => setSuccess(null), 4000);
    } catch (e) {
      setError(e.message || "Error updating user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = tableSearch.trim().toLowerCase();
    if (!q) return true;
    return [u.prenom, u.nom, u.email, u.role]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(q));
  });

  const counts = {
    total: users.length,
    admins: users.filter((u) => u.role === "ROLE_ADMIN").length,
    managers: users.filter((u) => u.role === "ROLE_MANAGER").length,
    employees: users.filter((u) => u.role === "ROLE_USER").length,
  };

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
              { id: "users", label: "User Management", icon: "👥" },
              { id: "projects", label: "Projects", icon: "📁" },
              { id: "settings", label: "Settings", icon: "⚙️" },
            ],
          },
        ]}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        onLogout={logout}
        useNavLink={false}
      />

      <Topbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        search={search}
        setSearch={setSearch}
        onRefresh={load}
        loading={loading}
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

          {/* ==================== USERS TAB ==================== */}
          {activeTab === "users" && (
            <>
              {/* Page Header with stats */}
              <div className="au-page-header">
                <div>
                  <h1>User Management</h1>
                  <p>Create, search and manage user accounts</p>
                </div>
                <div className="au-header-stats">
                  <div className="au-mini-stat">
                    <div className="au-stat-icon purple">{"\uD83D\uDC65"}</div>
                    <div>
                      <div className="au-stat-val">{counts.total}</div>
                      <div style={{fontSize:".75rem",color:"#64748b"}}>Total</div>
                    </div>
                  </div>
                  <div className="au-mini-stat">
                    <div className="au-stat-icon red">{"\uD83D\uDEE1\uFE0F"}</div>
                    <div>
                      <div className="au-stat-val">{counts.admins}</div>
                      <div style={{fontSize:".75rem",color:"#64748b"}}>Admins</div>
                    </div>
                  </div>
                  <div className="au-mini-stat">
                    <div className="au-stat-icon green">{"\uD83D\uDCBC"}</div>
                    <div>
                      <div className="au-stat-val">{counts.managers}</div>
                      <div style={{fontSize:".75rem",color:"#64748b"}}>Managers</div>
                    </div>
                  </div>
                  <div className="au-mini-stat">
                    <div className="au-stat-icon blue">{"\uD83D\uDC64"}</div>
                    <div>
                      <div className="au-stat-val">{counts.employees}</div>
                      <div style={{fontSize:".75rem",color:"#64748b"}}>Employees</div>
                    </div>
                  </div>
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
                      <button type="submit" className="au-submit-btn">
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        Create User
                      </button>
                    </form>
                  </div>
                </div>

                {/* ---- Users Table Card ---- */}
                <div className="au-card">
                  <div className="au-table-toolbar">
                    <div className="au-table-search">
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <input placeholder="Search users..." value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} />
                    </div>
                    <span className="au-table-count"><strong>{filteredUsers.length}</strong> user{filteredUsers.length !== 1 ? "s" : ""}</span>
                  </div>

                  {loading ? (
                    <div className="au-loading"><div className="au-spinner" /> Loading...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="au-empty">
                      <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4"/><path d="M18 28c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/><circle cx="20" cy="21" r="1.5" fill="#94a3b8"/><circle cx="28" cy="21" r="1.5" fill="#94a3b8"/></svg>
                      <h3>No users found</h3>
                      <p>Try a different search term.</p>
                    </div>
                  ) : (
                    <table className="au-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>ID</th>
                          <th style={{textAlign:"right"}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => {
                          const rc = getRoleClass(u.role);
                          return (
                            <tr key={u.id}>
                              <td>
                                <div className="au-user-cell">
                                  <div className={`au-avatar av-${rc}`}>{getInitials(u.prenom, u.nom)}</div>
                                  <div className="au-user-info">
                                    <span className="au-user-name">{u.prenom} {u.nom}</span>
                                    <span className="au-user-email">{u.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={`au-role r-${rc}`}>
                                  {u.role ? u.role.replace("ROLE_", "") : "?"}
                                </span>
                              </td>
                              <td style={{color:"#94a3b8",fontWeight:500}}>#{u.id}</td>
                              <td>
                                <div className="au-actions" style={{justifyContent:"flex-end"}}>
                                  <button className="au-btn-icon edit" title="Edit" onClick={() => openEdit(u)}>
                                    <span role="img" style={{fontSize:"15px",lineHeight:1}}>✏️</span>
                                  </button>
                                  <button className="au-btn-icon danger" title="Delete" onClick={() => setDeleteTarget(u)}>
                                    <span role="img" style={{fontSize:"15px",lineHeight:1}}>🗑️</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ==================== DASHBOARD TAB ==================== */}
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
            </>
          )}

          {/* ==================== OTHER TABS ==================== */}
          {activeTab === "projects" && (
            <div className="au-placeholder">
              <h2>Project Management</h2>
              <p>Coming soon</p>
            </div>
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
      {deleteTarget && (
        <div className="au-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="au-modal" onClick={(e) => e.stopPropagation()}>
            <div className="au-modal-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M4 8h20M9.33 8V5.33A2.67 2.67 0 0112 2.67h4a2.67 2.67 0 012.67 2.66V8m4 0v16a2.67 2.67 0 01-2.67 2.67H8a2.67 2.67 0 01-2.67-2.67V8H22.67z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Delete this user?</h3>
            <p>You are about to delete the account of</p>
            <p className="au-modal-user">{deleteTarget.prenom} {deleteTarget.nom} ({deleteTarget.email})</p>
            <p>This action cannot be undone.</p>
            <div className="au-modal-actions">
              <button className="au-modal-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="au-modal-delete" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit User Modal ===== */}
      {editTarget && (
        <div className="au-modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="au-modal au-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="au-modal-icon" style={{background:"#eff6ff"}}>
              <span style={{fontSize:"1.5rem"}}>✏️</span>
            </div>
            <h3>Edit User</h3>
            <p style={{marginBottom:"16px"}}>{editTarget.prenom} {editTarget.nom}</p>
            <form onSubmit={handleEdit} className="au-form" style={{textAlign:"left"}}>
              <div className="au-form-row">
                <div className="au-field">
                  <label>First Name</label>
                  <input required value={editForm.prenom} onChange={(e) => setEditForm({...editForm, prenom: e.target.value})} />
                </div>
                <div className="au-field">
                  <label>Last Name</label>
                  <input required value={editForm.nom} onChange={(e) => setEditForm({...editForm, nom: e.target.value})} />
                </div>
              </div>
              <div className="au-field">
                <label>Email</label>
                <input type="email" required value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
              </div>
              <div className="au-form-row">
                <div className="au-field">
                  <label>New Password</label>
                  <input type="password" value={editForm.password} onChange={(e) => setEditForm({...editForm, password: e.target.value})} placeholder="Leave blank to keep current" />
                </div>
                <div className="au-field">
                  <label>Role</label>
                  <select value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})}>
                    {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="au-modal-actions">
                <button type="button" className="au-modal-cancel" onClick={() => setEditTarget(null)}>Cancel</button>
                <button type="submit" className="au-modal-save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
