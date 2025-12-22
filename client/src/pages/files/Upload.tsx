import { useState } from "react";
import CloudUploadButton from "../../components/buttons/CloudUploadButton";
import AddFileCard from "../../components/cards/AddFileCard";
import "./Upload.css";

function Upload() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApiCall = async (formData: {
    password?: string;
    expiration: string;
  }) => {
    setLoading(true);
    try {
      console.log("Appel API avec :", formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Fichier téléversé avec succès !");
    } catch (error) {
      console.error("Erreur API", error);
    } finally {
      setLoading(false);
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
        <AddFileCard
          fileName="IMG_9210_123123.png"
          fileSize="2,6 Mo"
          onChangeFile={() => console.log("Ouvrir sélecteur de fichier")}
          onUpload={handleApiCall}
          isLoading={loading}
        />
      )}
    </section>
  );
}

export default Upload;
