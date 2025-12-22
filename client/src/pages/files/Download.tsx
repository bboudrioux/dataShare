import { useState } from "react";
import AddFileCard from "../../components/cards/AddFileCard";
import "./Download.css";

function Download() {
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
    <section className="section-download">
      <AddFileCard
        fileName="IMG_9210_123123.png"
        fileSize="2,6 Mo"
        onChangeFile={() => console.log("Ouvrir sélecteur de fichier")}
        onUpload={handleApiCall}
        isLoading={loading}
        mode="download"
      />
    </section>
  );
}

export default Download;
