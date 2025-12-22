import { useNavigate } from "react-router";
import LoginForm from "../../components/cards/LoginForm";

function Login() {
  const navigate = useNavigate();

  return (
    <section>
      <LoginForm
        onLogin={async (data) => {
          console.log("Appel API de connexion avec :", data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          alert("Connecté avec succès !");
        }}
        onNavigateToRegister={() => navigate("/signup")}
        isLoading={false}
      />
    </section>
  );
}

export default Login;
