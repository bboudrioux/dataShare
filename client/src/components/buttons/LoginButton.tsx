import React from "react";
import "./LoginButton.css";

interface LoginButtonProps {
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  label = "Se connecter",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`login-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default LoginButton;
