import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { setApiToken } from "./services/index.ts";
import Header from "./components/partials/Header.tsx";
import Footer from "./components/partials/Footer.tsx";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  // 1. Synchroniser le token avec Axios au montage
  useEffect(() => {
    if (token) setApiToken(token);
  }, [token]);

  // 2. Écouter l'événement de déconnexion forcée
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener("unauthorized-access", handleUnauthorized);
    return () =>
      window.removeEventListener("unauthorized-access", handleUnauthorized);
  }, [navigate, setToken]);

  return (
    <>
      <Header setToken={setToken} />
      <main>
        <Outlet context={{ token, setToken }} />
      </main>
      <Footer />
    </>
  );
}

export default App;
