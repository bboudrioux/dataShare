import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { uploadFile } from "../../services/files.service";
import type { FileMeta } from "../../types/files.types";
import CloudUploadButton from "../../components/buttons/CloudUploadButton";
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
      <h2 className="light-text">Tu veux partager un fichier ?</h2>
      {!showForm ? (
        <div className="upload-button-container">
          <CloudUploadButton onClick={() => setShowForm(true)} />
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
