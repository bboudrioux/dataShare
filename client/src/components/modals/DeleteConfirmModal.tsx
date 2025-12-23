import AppButton from "../buttons/AppButton";
import "./DeleteConfirmModal.css";

interface DeleteConfirmModalProps {
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({
  fileName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmModalProps) => {
  return (
    <div className="delete-modal-card">
      <div className="delete-modal-header">
        <div className="warning-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e67e5d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2 className="delete-modal-title">Supprimer le fichier ?</h2>
      </div>

      <p className="delete-modal-text">
        Es-tu sûr de vouloir supprimer <strong>{fileName}</strong> ? Cette
        action est irréversible.
      </p>

      <div className="delete-modal-actions">
        <AppButton
          label="Annuler"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="btn-half"
        />
        <AppButton
          label={isLoading ? "Suppression..." : "Supprimer"}
          variant="filled"
          onClick={onConfirm}
          disabled={isLoading}
          className="btn-half btn-danger"
        />
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
