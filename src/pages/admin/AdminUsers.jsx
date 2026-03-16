import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import "./AdminUsers.css";

const ROLE_OPTIONS = [
  { value: "ROLE_USER", label: "Utilisateur" },
  { value: "ROLE_MANAGER", label: "Manager" },
  { value: "ROLE_ADMIN", label: "Administrateur" },
];

export default function AdminUsers() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des utilisateurs");
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
      setForm((f) => ({ ...f, prenom: "", nom: "", email: "", password: "", role: "ROLE_USER" }));
      setSuccess("Utilisateur créé avec succès.");
      load();

      window.setTimeout(() => {
        setSuccess(null);
      }, 4500);
    } catch (e) {
      setError(e.message || "Erreur lors de la création de l'utilisateur");
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [u.prenom, u.nom, u.email, u.role]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        sections={[
          {
            title: "Administration",
            items: [
              { id: "dashboard", label: "Tableau de Bord", icon: "📊" },
              { id: "users", label: "Gestion Utilisateurs", icon: "👥" },
              { id: "projects", label: "Gestion de Projet", icon: "📁" },
              { id: "settings", label: "Paramètres Système", icon: "⚙️" },
              { id: "reports", label: "Rapports", icon: "📈" },
              { id: "logs", label: "Journaux", icon: "📝" }
            ]
          }
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
        searchPlaceholder="Rechercher utilisateurs, rôles..."
      />

      <main className="admin-main">
        <div className="admin-content">
          {success && <div className="success" role="status">{success}</div>}
          {error && <div className="error" role="alert">{error}</div>}

          {activeTab === "users" && (
            <div className="admin-grid">
              <div className="admin-card">
                <h2>Créer un utilisateur</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                  <label>
                    Prénom
                    <input
                      required
                      value={form.prenom}
                      onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
                    />
                  </label>
                  <label>
                    Nom
                    <input
                      required
                      value={form.nom}
                      onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </label>
                  <label>
                    Mot de passe
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    />
                  </label>
                  <label>
                    Rôle
                    <select
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit">Créer l'utilisateur</button>
                </form>
              </div>

              <div className="admin-card">
                <h2>Liste des utilisateurs</h2>
                {loading ? (
                  <p className="admin-no-results">Chargement...</p>
                ) : filteredUsers.length === 0 ? (
                  <p className="admin-no-results">Aucun utilisateur trouvé.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.prenom} {u.nom}</td>
                          <td>{u.email}</td>
                          <td>
                            {u.role ? (
                              <span className={`role-badge role-${u.role.toLowerCase().replace(/_/g, '-')}`}>
                                {u.role.replace('ROLE_', '')}
                              </span>
                            ) : (
                              <span className="role-badge" style={{ opacity: 0.65 }}>
                                Inconnu
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="dashboard-content">
              <h2>Tableau de Bord</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Utilisateurs</h3>
                  <p className="stat-number">{users.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Admins</h3>
                  <p className="stat-number">{users.filter(u => u.role === 'ROLE_ADMIN').length}</p>
                </div>
                <div className="stat-card">
                  <h3>Managers</h3>
                  <p className="stat-number">{users.filter(u => u.role === 'ROLE_MANAGER').length}</p>
                </div>
                <div className="stat-card">
                  <h3>Utilisateurs</h3>
                  <p className="stat-number">{users.filter(u => u.role === 'ROLE_USER').length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="projects-content">
              <h2>Gestion de Projet</h2>
              <p>Fonctionnalités de gestion des projets (à implémenter)</p>
              <div className="projects-placeholder">
                <div className="placeholder-card">
                  <h3>📊 Statistiques des Projets</h3>
                  <p>Nombre total de projets, projets actifs, projets terminés...</p>
                </div>
                <div className="placeholder-card">
                  <h3>👥 Gestion des Équipes</h3>
                  <p>Assignation des utilisateurs aux projets, rôles dans les projets...</p>
                </div>
                <div className="placeholder-card">
                  <h3>📈 Suivi des Progrès</h3>
                  <p>Tableaux de bord de progression, jalons, délais...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-content">
              <h2>Paramètres Système</h2>
              <p>Configuration du système (à implémenter)</p>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="reports-content">
              <h2>Rapports</h2>
              <p>Rapports et analyses (à implémenter)</p>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="logs-content">
              <h2>Journaux</h2>
              <p>Journaux système (à implémenter)</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
