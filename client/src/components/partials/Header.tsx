import { useNavigate, useLocation } from "react-router";
import AppButton from "../buttons/AppButton";
import "./Header.css";

interface HeaderProps {
  token?: string | null;
  setToken?: (token: string | null) => void;
}

const Header = ({ token, setToken }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  const triggerModal = () =>
    window.dispatchEvent(new CustomEvent("open-upload-modal"));
  const triggerMenu = () =>
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));

  const logout = () => {
    if (setToken) setToken(null);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {isDashboard && (
          <button className="menu-mobile-btn" onClick={triggerMenu}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <h1 className="logo" onClick={() => navigate("/")}>
          DataShare
        </h1>
      </div>

      <div className="header-actions">
        {token ? (
          <>
            {isDashboard ? (
              <AppButton
                label="Ajouter un fichier"
                variant="filled"
                onClick={triggerModal}
                className="btn-header-action"
              />
            ) : (
              <AppButton
                label="Mon espace"
                variant="filled"
                onClick={() => navigate("/dashboard")}
                className="btn-header-action"
              />
            )}
            <AppButton
              label="Déconnexion"
              variant="outline"
              onClick={logout}
              className="btn-header-logout hide-mobile"
            />
          </>
        ) : (
          <AppButton
            label="Se connecter"
            variant="filled"
            onClick={() => navigate("/login")}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
