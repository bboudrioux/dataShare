import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { uploadFile } from "../../services/files.service";
import type { FileMeta } from "../../types/files.types";
import UploadFileCard from "../../components/cards/UploadFileCard";
import "./Upload.css";

function Upload() {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"upload" | "error_size" | "success">(
    "upload"
  );
  const [shareUrl, setShareUrl] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleSubmitUpload = async (data: {
    file: File | FileMeta | null;
    password?: string;
    expiration: number;
  }) => {
    try {
      const { file, password, expiration } = data;
      const uploadedFile = await uploadFile(
        file as File,
        new Date(expiration),
        password
      );
      setShareUrl(`${window.location.origin}/files/${uploadedFile.id}`);
      setMode("success");
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier :", error);
      toast.warn("vous devez etre connecté pour uploader un fichier");
      navigate("/login");
    }
  };

  return (
    <section className="section-upload">
      {!showForm ? (
        <div className="upload-hero">
          <span className="upload-hero-badge">✦ Partage sécurisé &amp; éphémère</span>
          <h1 className="upload-hero-title">
            Partage tes fichiers,
            <br />
            <span className="upload-hero-accent">sans friction.</span>
          </h1>
          <p className="upload-hero-sub">
            Upload, protège par mot de passe, définis une expiration.
            <br />
            Le lien fait tout le reste.
          </p>
          <div className="upload-dropzone" onClick={() => setShowForm(true)}>
            <div className="upload-dropzone-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="upload-dropzone-text">
              <strong>Clique pour uploader</strong>
              <br />
              <span>ou glisse un fichier ici</span>
            </p>
          </div>
        </div>
      ) : (
        <UploadFileCard
          mode={mode}
          shareUrl={shareUrl}
          onUpload={handleSubmitUpload}
        />
      )}
    </section>
  );
}

export default Upload;
