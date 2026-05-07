import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import "./AuthForm.css";

interface LoginFormProps {
  onLogin: (data: { email: string; password: string }) => void;
  onNavigateToRegister: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onNavigateToRegister,
  isLoading,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">DataShare</div>
      <h2 className="auth-title">Bon retour 👋</h2>
      <p className="auth-subtitle">Connecte-toi pour accéder à tes fichiers.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Saisissez votre email..."
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="Saisissez votre mot de passe..."
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <AppButton
          label={isLoading ? "Connexion..." : "Se connecter"}
          variant="filled"
          type="submit"
          className="btn-full"
          disabled={isLoading}
        />
        <div className="auth-footer">
          <button
            type="button"
            className="link-btn"
            onClick={onNavigateToRegister}
          >
            Pas encore de compte ? <span>Créer un compte</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
