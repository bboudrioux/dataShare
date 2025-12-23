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
      <h2 className="file-card-title">Ajouter un fichier</h2>

      {mode !== "success" && (
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
              <span className="file-name">
                {file ? file.name : "Aucun fichier sélectionné"}
              </span>
              {file && (
                <span className="file-size">{formatBytes(file.size)}</span>
              )}
            </div>
          </div>
          <AppButton
            label="Changer"
            variant="outline"
            className="btn-small"
            onClick={() => hiddenFileInput.current?.click()}
          />
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}

      {mode === "upload" && (
        <div className="form-fields">
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Optionnel"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Expiration</label>
            <select
              className="form-input"
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
        </div>
      )}

      {mode === "success" && (
        <div className="success-content">
          <p>Félicitations, ton fichier sera conservé pendant une semaine !</p>
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
                ? "Copié !"
                : "Copier le lien"
              : "Téléverser"
          }
          variant="outline"
          className="btn-full"
          disabled={!file && mode === "upload"}
          onClick={handleAction}
        />
      </div>
    </div>
  );
};

export default UploadFileCard;
