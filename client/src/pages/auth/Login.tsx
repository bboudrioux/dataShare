import { useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import { login } from "../../services/auth.service";
import LoginForm from "../../components/cards/LoginForm";

function Login() {
  const navigate = useNavigate();
  const { setToken } = (
    useOutletContext as () => {
      token: string | null;
      setToken: (token: string | null) => void;
    }
  )();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await login(data.email, data.password);
      setToken(response.access_token);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Échec de la connexion. Vérifiez vos identifiants.");
      console.error(
        "Erreur lors de la connexion : " +
          (error as { message?: string }).message
      );
    }
  };

  return (
    <section>
      <LoginForm
        onLogin={handleLogin}
        onNavigateToRegister={() => navigate("/signup")}
        isLoading={false}
      />
    </section>
  );
}

export default Login;
