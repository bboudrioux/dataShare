import { useLocation } from "react-router";
import "./Footer.css";

function Footer() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <footer>
      {!isDashboard && <p>© 2025 DataShare. All rights reserved.</p>}
    </footer>
  );
}

export default Footer;
