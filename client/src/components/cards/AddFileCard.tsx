import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import "./AddFileCard.css";

type CardMode = "upload" | "error_size" | "success" | "download";

interface AddFileCardProps {
  mode?: CardMode;
  fileName: string;
  fileSize: string;
  shareUrl?: string;
  expiryInfo?: string;
  errorMsg?: string;
  onChangeFile: () => void;
  onUpload?: (data: { password?: string; expiration: string }) => void;
  onDownload?: (password?: string) => void;
  isLoading?: boolean;
}

const AddFileCard: React.FC<AddFileCardProps> = ({
  mode = "upload",
  fileName,
  fileSize,
  shareUrl,
  expiryInfo,
  errorMsg = "La taille des fichiers est limitée à 1 Go",
  onChangeFile,
  onUpload,
  onDownload,
  isLoading = false,
}) => {
  const [password, setPassword] = useState("");
  const [expiration, setExpiration] = useState("Une journée");

  const renderTitle = () => {
    if (mode === "download") return "Télécharger un fichier";
    return "Ajouter un fichier";
  };

  return (
    <div className={`file-card ${mode}`}>
      <h2 className="file-card-title">{renderTitle()}</h2>

      <div className="file-info-container">
        <div className="file-details">
          <div className="file-icon-wrapper">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="file-text">
            <span className="file-name">{fileName}</span>
            <span className="file-size">{fileSize}</span>
          </div>
        </div>
        {mode !== "success" && mode !== "download" && (
          <AppButton
            label="Changer"
            variant="outline"
            className="btn-small"
            onClick={onChangeFile}
          />
        )}
      </div>

      {mode === "error_size" && <p className="error-message">{errorMsg}</p>}

      {mode === "success" && (
        <div className="success-content">
          <p className="success-text">
            Félicitations, ton fichier sera conservé chez nous pendant une
            semaine !
          </p>
          <div className="url-display">
            <a href={shareUrl} target="_blank" rel="noreferrer">
              {shareUrl}
            </a>
          </div>
        </div>
      )}

      {mode === "download" && expiryInfo && (
        <div className="info-alert">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{expiryInfo}</span>
        </div>
      )}

      {(mode === "upload" || mode === "error_size" || mode === "download") && (
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder={mode === "download" ? "**********" : "Optionnel"}
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      {mode === "upload" && (
        <div className="form-group">
          <label htmlFor="expiration">Expiration</label>
          <select
            id="expiration"
            className="form-input"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
          >
            <option>Une heure</option>
            <option>Une journée</option>
            <option>Une semaine</option>
          </select>
        </div>
      )}

      <div className="form-footer">
        {mode === "download" ? (
          <AppButton
            label="Télécharger"
            variant="outline"
            className="btn-full"
            onClick={() => onDownload?.(password)}
          />
        ) : (
          <AppButton
            label={isLoading ? "Envoi..." : "Téléverser"}
            variant="outline"
            disabled={mode === "error_size" || isLoading}
            className="btn-full"
            onClick={() => onUpload?.({ password, expiration })}
          />
        )}
      </div>
    </div>
  );
};

export default AddFileCard;
