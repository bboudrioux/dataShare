import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { downloadFile, getFileMeta } from "../../services/files.service";
import DownloadFileCard from "../../components/cards/DownloadFileCard";
import type { FileMeta } from "../../types/files.types";
import "./Download.css";

function Download() {
  const [fileInfo, setFileInfo] = useState<FileMeta | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const file = await getFileMeta(id as string);
        setFileInfo(file);
      } catch (error) {
        toast.error("Échec de la récupération des informations du fichier.");
        console.error(
          "Erreur lors de la récupération des informations du fichier :",
          error
        );
      }
    };
    fetchFileInfo();
  }, [id]);

  const handleDownload = async (id: string, password?: string) => {
    if (!fileInfo) return;
    try {
      const blob = await downloadFile(id, password);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileInfo.name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Téléchargement réussi !");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const text = await error.response?.data.text();
        const message = JSON.parse(text).message;
        toast.error(message || "Échec du téléchargement du fichier.");
        console.error("Erreur lors du téléchargement du fichier :", error);
      }
    }
  };

  return (
    <section className="section-download">
      <DownloadFileCard selectedFile={fileInfo} onDownload={handleDownload} />
    </section>
  );
}

export default Download;
