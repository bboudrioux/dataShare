import React, { useState } from "react";
import { toast } from "react-toastify";
import AppButton from "../buttons/AppButton";
import "./AuthForm.css";

interface RegisterFormProps {
  onRegister: (data: { email: string; password: string }) => void;
  onNavigateToLogin: () => void;
  isLoading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onNavigateToLogin,
  isLoading,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warn("Les mots de passe ne correspondent pas.");
      return;
    }
    onRegister({ email, password });
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">DataShare</div>
      <h2 className="auth-title">Créer un compte</h2>
      <p className="auth-subtitle">Rejoins DataShare pour partager tes fichiers.</p>
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
        <div className="form-group">
          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            placeholder="Saisissez le à nouveau"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <AppButton
          label={isLoading ? "Création..." : "Créer mon compte"}
          variant="filled"
          type="submit"
          className="btn-full"
          disabled={isLoading}
        />
        <div className="auth-footer">
          <button
            type="button"
            className="link-btn"
            onClick={onNavigateToLogin}
          >
            Déjà un compte ? <span>Se connecter</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
