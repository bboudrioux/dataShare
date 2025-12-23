import React, { useState } from "react";
import type { FileMeta } from "../../types/files.types";
import { getExpiryLabel, getExpiryLevel } from "../../utils/date";
import formatBytes from "../../utils/formatBytes";
import AppButton from "../buttons/AppButton";
import "./FileCard.css";

interface DownloadFileCardProps {
  selectedFile: FileMeta | null;
  onDownload: (id: string, password?: string) => void;
}

const DownloadFileCard: React.FC<DownloadFileCardProps> = ({
  selectedFile,
  onDownload,
}) => {
  const [password, setPassword] = useState("");

  if (!selectedFile)
    return <div className="file-card loading">Chargement...</div>;

  const expiryLevel = getExpiryLevel(selectedFile.expiration_date);
  const expiryLabel = getExpiryLabel(selectedFile.expiration_date);

  return (
    <div
      className={`file-card download ${
        expiryLevel === "error" ? "error_expired" : ""
      }`}
    >
      <h2 className="file-card-title">Télécharger un fichier</h2>

      {expiryLevel !== "error" ? (
        <>
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
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
              <div className="file-text">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">
                  {formatBytes(selectedFile.size)}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`info-alert-box ${
              expiryLevel === "warning" ? "warning-alert" : "info-alert"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {expiryLevel === "warning" ? (
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              ) : (
                <circle cx="12" cy="12" r="10" />
              )}
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Ce fichier {expiryLabel.toLowerCase()}.</span>
          </div>

          {selectedFile.password && (
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                placeholder="Saisissez le mot de passe..."
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="form-footer">
            <AppButton
              label="Télécharger"
              variant="outline"
              className="btn-full"
              onClick={() => onDownload(selectedFile.id, password)}
            />
          </div>
        </>
      ) : (
        /* Vue Expirée */
        <div className="error-alert-box expired">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Ce fichier n'est plus disponible car il a expiré.</span>
        </div>
      )}
    </div>
  );
};

export default DownloadFileCard;
