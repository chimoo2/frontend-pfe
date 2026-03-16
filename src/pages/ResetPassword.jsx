import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Token manquant. Veuillez redemander la réinitialisation.");
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const resp = await resetPassword(token, password);
      setMessage(resp || "Mot de passe modifié avec succès.");
      setTimeout(() => {
        navigate("/signin");
      }, 1800);
    } catch (err) {
      setError(err.message || "Impossible de réinitialiser le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 16 }}>
      <h1>Réinitialiser le mot de passe</h1>

      {message && <div style={{ marginBottom: 16, padding: 12, background: "#e6ffed", borderRadius: 8 }}>{message}</div>}
      {error && <div style={{ marginBottom: 16, padding: 12, background: "#fee2e2", borderRadius: 8 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 12 }}>
          Nouveau mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            disabled={loading}
          />
        </label>
        <label style={{ display: "block", marginBottom: 12 }}>
          Confirmer le mot de passe
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            disabled={loading}
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Envoi..." : "Réinitialiser"}
        </button>
      </form>
    </div>
  );
}
