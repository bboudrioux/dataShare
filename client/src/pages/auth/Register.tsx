import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { register } from "../../services/auth.service";
import RegisterForm from "../../components/cards/RegisterForm";

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      await register(data.email, data.password);
      console.info("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      toast.error("Échec de l'inscription. Veuillez réessayer.");
      console.error(
        "Erreur lors de l'inscription : " +
          (error as { message?: string }).message
      );
    }
  };

  return (
    <section>
      <RegisterForm
        onRegister={handleRegister}
        onNavigateToLogin={() => navigate("/login")}
        isLoading={false}
      />
    </section>
  );
}

export default Register;
