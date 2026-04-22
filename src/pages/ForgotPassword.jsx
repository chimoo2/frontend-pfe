import React, { useState } from "react";
import { forgotPassword } from "../api/authApi";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import "./ForgotPassword.css";

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

  const handleReset = () => {
    setEmail("");
    setSubmitted(false);
    setMessage(null);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-card">
        <div className="forgot-header">
          <div className="mail-icon">
            <MailOutlineIcon className="icon" />
          </div>
          <h1>Mot de passe oublié</h1>
          <p>Pas de souci! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
        </div>

        {message && (
          <div className="alert success">
            <CheckCircleOutlineIcon className="alert-icon" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert error">
            <WarningAmberIcon className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || submitted}
              placeholder="vous@example.com"
            />
          </div>

          <button 
            type="submit" 
            className="btn-send" 
            disabled={loading || submitted}
          >
            {loading ? "Envoi..." : submitted ? "Email envoyé ✓" : "Envoyer le lien"}
          </button>
        </form>

        {submitted && (
          <div className="submitted-info">
            <p>Consultez votre email pour le lien de réinitialisation.</p>
            <button type="button" className="btn-try-again" onClick={handleReset}>
              Essayer un autre email
            </button>
          </div>
        )}

        <div className="forgot-footer">
          <a href="/signin">Retour à la connexion</a>
        </div>
      </div>
    </div>
  );
}
