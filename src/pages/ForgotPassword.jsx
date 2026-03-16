import React, { useState } from "react";
import { forgotPassword } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const resp = await forgotPassword(email.trim());
      setMessage(resp || "Si l'email existe, un message vient d'être envoyé.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 16 }}>
      <h1>Mot de passe oublié</h1>
      <p>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>

      {message && <div style={{ marginBottom: 16, padding: 12, background: "#e6f7ff", borderRadius: 8 }}>{message}</div>}
      {error && <div style={{ marginBottom: 16, padding: 12, background: "#fee2e2", borderRadius: 8 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 12 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            disabled={loading || submitted}
          />
        </label>

        <button type="submit" disabled={loading || submitted} style={{ padding: "10px 16px" }}>
          {loading ? "Envoi..." : submitted ? "Envoyé" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
