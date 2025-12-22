import { useState, useEffect, useMemo } from "react";
import AppButton from "../../components/buttons/AppButton";
import AddFileCard from "../../components/cards/AddFileCard";
import "./Dashboard.css";

interface FileData {
  id: number;
  name: string;
  expiry: string;
  status: "active" | "expired";
  secure: boolean;
}

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "Tous" | "Actifs" | "Expiré"
  >("Tous");

  const filteredFiles = useMemo(() => {
    const allFiles: FileData[] = [
      {
        id: 1,
        name: "IMG_9210_12312313131231231.jpg",
        expiry: "Expire dans 2 jours",
        status: "active",
        secure: true,
      },
      {
        id: 2,
        name: "compo2.mp3",
        expiry: "Expire demain",
        status: "active",
        secure: false,
      },
      {
        id: 3,
        name: "vacances_ardeche.mp4",
        expiry: "Expiré",
        status: "expired",
        secure: false,
      },
      {
        id: 4,
        name: "rapport_final.pdf",
        expiry: "Expire dans 5 jours",
        status: "active",
        secure: true,
      },
    ];
    if (activeFilter === "Tous") return allFiles;
    if (activeFilter === "Actifs")
      return allFiles.filter((f) => f.status === "active");
    if (activeFilter === "Expiré")
      return allFiles.filter((f) => f.status === "expired");
    return allFiles;
  }, [activeFilter]);

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

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button
          className="close-sidebar-mobile"
          onClick={() => setIsSidebarOpen(false)}
        >
          ×
        </button>
        <div className="sidebar-logo-mobile">DataShare</div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active">Mes fichiers</div>
        </nav>
        <div className="sidebar-footer">Copyright DataShare© 2025</div>
      </aside>

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

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
              filteredFiles.map((file: FileData) => (
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
                      <span className="file-expiry">{file.expiry}</span>
                    </div>
                  </div>

                  <div className="file-actions">
                    {file.secure && <span className="secure-badge">🔒</span>}
                    {file.status !== "expired" ? (
                      <>
                        <AppButton
                          label="Supprimer"
                          variant="outline"
                          className="btn-table-action"
                        />
                        <AppButton
                          label="Accéder →"
                          variant="outline"
                          className="btn-table-action"
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
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <AddFileCard
              fileName="Sélectionnez un fichier..."
              fileSize="-- Mo"
              onChangeFile={() => console.log("Upload")}
              onUpload={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
