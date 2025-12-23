import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { uploadFile, getfiles, deleteFile } from "../../services/files.service";
import Sidebar from "../../components/partials/Sidebar";
import FileCardModal from "../../components/modals/FileCardModal";
import DeleteConfirmModal from "../../components/modals/DeleteConfirmModal";
import AppButton from "../../components/buttons/AppButton";
import type { FileMeta } from "../../types/files.types";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [fileToDelete, setFileToDelete] = useState<FileMeta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"upload" | "error_size" | "success">(
    "upload"
  );
  const [activeFilter, setActiveFilter] = useState<
    "Tous" | "Actifs" | "Expiré"
  >("Tous");

  const filteredFiles = useMemo(() => {
    const allFiles: FileMeta[] = files;
    if (activeFilter === "Tous") return allFiles;
    if (activeFilter === "Actifs")
      return allFiles.filter((f) => f.status === "valide");
    if (activeFilter === "Expiré")
      return allFiles.filter((f) => f.status === "expiré");
    return allFiles;
  }, [activeFilter, files]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getfiles();
        setFiles(response);
      } catch (error) {
        toast.error("Échec de la récupération des fichiers.");
        console.error("Erreur lors de la récupération des fichiers :", error);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    window.addEventListener("toggle-sidebar", toggleSidebar);
    return () => window.removeEventListener("toggle-sidebar", toggleSidebar);
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener("open-upload-modal", handleOpenModal);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("open-upload-modal", handleOpenModal);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

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
      setFiles((prevFiles) => [uploadedFile, ...prevFiles]);
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier :", error);
    }
  };

  const handleDeleteFile = async () => {
    try {
      await deleteFile(fileToDelete!.id);
      toast.success("Fichier supprimé avec succès.");
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileToDelete!.id)
      );
      setFileToDelete(null);
    } catch (error) {
      toast.error("Échec de la suppression du fichier.");
      console.error("Erreur lors de la suppression du fichier :", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="dashboard-content">
        <section className="files-section">
          <h2 className="section-title">Mes fichiers</h2>

          <div className="filter-tabs">
            {(["Tous", "Actifs", "Expiré"] as const).map((filter) => (
              <button
                key={filter}
                className={`tab ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="file-list">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file: FileMeta) => (
                <div key={file.id} className={`file-row ${file.status}`}>
                  <div className="file-info-group">
                    <div className="file-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                    </div>
                    <div className="file-texts">
                      <span className="file-name">{file.name}</span>
                      <span className="file-expiry">{file.status}</span>
                    </div>
                  </div>

                  <div className="file-actions">
                    {file.hasPassword && (
                      <span className="secure-badge">🔒</span>
                    )}
                    {file.status !== "expiré" ? (
                      <>
                        <AppButton
                          label="Supprimer"
                          variant="outline"
                          className="btn-table-action"
                          onClick={() => setFileToDelete(file)}
                        />
                        <AppButton
                          label="Accéder →"
                          variant="outline"
                          className="btn-table-action"
                          onClick={() => navigate(`/files/${file.id}`)}
                        />
                      </>
                    ) : (
                      <p className="expired-msg">
                        Ce fichier a expiré, il n'est plus stocké chez nous
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                Aucun fichier trouvé dans cette catégorie.
              </div>
            )}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <FileCardModal
          setIsModalOpen={setIsModalOpen}
          shareUrl={shareUrl}
          mode={mode}
          setMode={setMode}
          handleSubmitUpload={handleSubmitUpload}
        />
      )}

      {fileToDelete && (
        <div className="modal-overlay" onClick={() => setFileToDelete(null)}>
          <div
            className="modal-card-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <DeleteConfirmModal
              fileName={fileToDelete.name}
              onCancel={() => setFileToDelete(null)}
              onConfirm={handleDeleteFile}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
