import { useNavigate, useOutletContext } from "react-router";
import "./Sidebar.css";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const navigate = useNavigate();

  const { setToken } = (
    useOutletContext as () => {
      setToken: (token: string | null) => void;
    }
  )();

  const logout = () => {
    if (setToken) {
      setToken(null);
    }
    navigate("/login");
  };

  return (
    <>
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
          <button
            className="logout-link sidebar-logout hide-desktop"
            onClick={logout}
          >
            Déconnexion
          </button>
        </nav>
        <div className="sidebar-footer">Copyright DataShare© 2025</div>
      </aside>

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
