import React from "react";
import "./CloudUploadButton.css";

interface CloudUploadButtonProps {
  onClick?: () => void;
  size?: number;
  className?: string;
  disabled?: boolean;
}

const CloudUploadButton: React.FC<CloudUploadButtonProps> = ({
  onClick,
  size = 80,
  className = "",
  disabled = false,
}) => {
  const borderThickness = size * 0.15;

  return (
    <button
      className={`cloud-upload-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        borderWidth: borderThickness,
      }}
      aria-label="Charger vers le cloud"
    >
      <svg
        className="cloud-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5C17.6 6.6 14.6 4 11 4 7.9 4 5.3 6.1 4.3 9c-2.3.4-4 2.4-4 4.8C0.3 16.6 2.6 19 5.5 19h12z" />
        <polyline points="9 12 12 9 15 12" />
        <path d="M12 9v7" />
      </svg>
    </button>
  );
};

export default CloudUploadButton;
