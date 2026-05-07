import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Bounce, ToastContainer } from "react-toastify";
import { setApiToken } from "./services/index.ts";
import Header from "./components/partials/Header.tsx";
import Footer from "./components/partials/Footer.tsx";
import AnimatedBackground from "./components/AnimatedBackground.tsx";

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) setApiToken(token);
    else setApiToken("");
  }, [token]);

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
      <AnimatedBackground />
      <div className="app-shell">
        <Header token={token} setToken={setToken} />
        <main>
          <Outlet context={{ token, setToken }} />
          <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
          />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
