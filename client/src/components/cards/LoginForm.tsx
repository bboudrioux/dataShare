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
      <h2 className="auth-title">Connexion</h2>
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

        <div className="auth-footer">
          <button
            type="button"
            className="link-btn"
            onClick={onNavigateToRegister}
          >
            Créer un compte
          </button>
          <AppButton
            label={isLoading ? "Connexion..." : "Connexion"}
            variant="filled"
            type="submit"
            className="btn-full"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
