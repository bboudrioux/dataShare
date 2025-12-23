import type { FileMeta } from "../../types/files.types";
import AddFileCard from "../cards/AddFileCard";
import "./FileCardModal.css";

interface FileCardModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  shareUrl: string | undefined;
  mode: "upload" | "error_size" | "success";
  setMode: (mode: "upload" | "error_size" | "success") => void;
  handleSubmitUpload: (data: {
    file: File | FileMeta | null;
    password?: string;
    expiration: number;
  }) => Promise<void>;
}

const FileCardModal = (props: FileCardModalProps) => {
  const { setIsModalOpen, shareUrl, mode, setMode, handleSubmitUpload } = props;
  return (
    <div
      className="modal-overlay"
      onClick={() => {
        setIsModalOpen(false);
        setMode("upload");
      }}
    >
      <div className="modal-card-wrapper" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => {
            setIsModalOpen(false);
            setMode("upload");
          }}
        >
          ×
        </button>
        <AddFileCard
          mode={mode}
          shareUrl={shareUrl}
          onUpload={handleSubmitUpload}
        />
      </div>
    </div>
  );
};

export default FileCardModal;
