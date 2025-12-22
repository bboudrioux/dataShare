import { useNavigate } from "react-router";
import RegisterForm from "../../components/cards/RegisterForm";

function Register() {
  const navigate = useNavigate();

  return (
    <section>
      <RegisterForm
        onRegister={async (data) => {
          console.log("Appel API d'inscription avec :", data);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          alert("Inscription réussie !");
        }}
        onNavigateToLogin={() => navigate("/login")}
        isLoading={false}
      />
    </section>
  );
}

export default Register;
