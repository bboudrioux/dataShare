import React, { useRef, useState, type ChangeEvent } from "react";
import formatBytes from "../../utils/formatBytes";
import AppButton from "../buttons/AppButton";
import "./FileCard.css";

interface UploadFileCardProps {
  mode: "upload" | "error_size" | "success";
  shareUrl?: string;
  errorMsg?: string;
  onUpload: (data: {
    file: File;
    password?: string;
    expiration: number;
  }) => void;
}

const UploadFileCard: React.FC<UploadFileCardProps> = ({
  mode,
  shareUrl,
  errorMsg,
  onUpload,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [expiration, setExpiration] = useState(
    () => Date.now() + 7 * 24 * 3600 * 1000
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) setFile(files[0]);
  };

  const handleAction = () => {
    if (mode === "upload" && file) {
      onUpload({ file, password, expiration });
    } else if (mode === "success" && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className={`file-card ${mode}`}>
      <h2 className="file-card-title">Envoyer un fichier</h2>

      {mode !== "success" && (
        <>
          <div
            className={`file-select-zone ${file ? "has-file" : ""}`}
            onClick={() => hiddenFileInput.current?.click()}
          >
            {file ? (
              <div className="file-selected-info">
                <div className="file-select-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                </div>
                <div className="file-select-text">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatBytes(file.size)}</span>
                </div>
                <span className="file-change-hint">Changer</span>
              </div>
            ) : (
              <>
                <div className="file-select-icon-ring">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="file-select-prompt">
                  <strong>Choisir un fichier</strong>
                  <span>cliquer pour parcourir</span>
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </>
      )}

      {mode === "upload" && (
        <div className="form-fields">
          <div className="form-group">
            <label>Expiration</label>
            <select
              className="form-input form-select"
              defaultValue="Une semaine"
              onChange={(e) => {
                let exp = Date.now();
                if (e.target.value === "Une heure") exp += 3600 * 1000;
                else if (e.target.value === "Une journée")
                  exp += 24 * 3600 * 1000;
                else exp += 7 * 24 * 3600 * 1000;
                setExpiration(exp);
              }}
            >
              <option>Une heure</option>
              <option>Une journée</option>
              <option>Une semaine</option>
            </select>
          </div>
          <div className="form-group">
            <label>Mot de passe (optionnel)</label>
            <input
              type="password"
              placeholder="Laisser vide si aucun"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      )}

      {mode === "success" && (
        <div className="success-content">
          <div className="info-success-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Fichier envoyé avec succès !</span>
          </div>
          <p className="success-text">Partage ce lien — il expirera automatiquement.</p>
          <div className="url-display">
            <a href={shareUrl} target="_blank" rel="noreferrer">
              {shareUrl}
            </a>
          </div>
        </div>
      )}

      {mode === "error_size" && (
        <p className="error-message-simple">
          {errorMsg || "Fichier trop volumineux"}
        </p>
      )}

      <div className="form-footer">
        <AppButton
          label={
            mode === "success"
              ? copiedLink
                ? "✓ Copié !"
                : "Copier le lien"
              : "Envoyer le fichier"
          }
          variant="filled"
          className="btn-full"
          disabled={!file && mode === "upload"}
          onClick={handleAction}
        />
      </div>
    </div>
  );
};

export default UploadFileCard;
