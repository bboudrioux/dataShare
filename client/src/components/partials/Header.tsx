import { useNavigate, useLocation } from "react-router";
import AppButton from "../buttons/AppButton";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  const triggerModal = () =>
    window.dispatchEvent(new CustomEvent("open-upload-modal"));
  const triggerMenu = () =>
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));

  return (
    <header className="app-header">
      <div className="header-left">
        {isDashboard && (
          <button className="menu-mobile-btn" onClick={triggerMenu}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <h1 className="logo" onClick={() => navigate("/")}>
          DataShare
        </h1>
      </div>

      <div className="header-actions">
        {isDashboard ? (
          <>
            <AppButton
              label="Ajouter"
              variant="filled"
              onClick={triggerModal}
              className="btn-add-mobile"
            />
            <button
              className="logout-link hide-mobile"
              onClick={() => navigate("/login")}
            >
              Déconnexion
            </button>
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
