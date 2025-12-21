import { Outlet } from "react-router";
import Header from "./components/partials/Header.tsx";
import Footer from "./components/partials/Footer.tsx";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
